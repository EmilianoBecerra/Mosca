const { descartarCartas, repartirPostDescarte } = require("../utils/cartas");
const { determinarGanador, resolverMano } = require("../utils/partida");

class PartidaController {
    constructor(io, mesas) {
        this.io = io;
        this.mesas = mesas;
    }

    registrar(socket) {
        socket.on("descarte", ({ idMesa, indices }) => {
            this.descartarYRepartir(socket, { idMesa, indices });
        })

        socket.on("jugar", ({ idMesa, carta }) => {
            this.jugarCarta(socket, { idMesa, carta });
        })
    }

    descartarYRepartir(socket, { idMesa, indices }) {
        const mesa = this.mesas[idMesa];
        if (!mesa) return;

        const jugador = mesa.jugadores.find(j => j.id === socket.id);
        if (!jugador) return;

        if (mesa.estado === "descarte") {
            jugador.descarte = indices;
            jugador.listoParaDescartar = true;

            this.io.to(idMesa).emit("actualizar-mesa", mesa);

            const todosDescartaron = mesa.jugadores.every(j => j.listoParaDescartar);

            if (todosDescartaron) {
                const arrayJugadores = mesa.jugadores.map(j => ({ id: j.id, indices: j.descarte || [] }));

                descartarCartas(mesa, arrayJugadores);
                repartirPostDescarte(mesa);

                mesa.jugadores.forEach(j => {
                    delete j.descarte;
                    j.listoParaDescartar = false;
                });
                mesa.estado = "en-partida";
                this.io.to(idMesa).emit("actualizar-mesa", mesa);
            }
        }

    }

    jugarCarta(socket, { idMesa, carta }) {
        const mesa = this.mesas[idMesa];

        if (!mesa) return;

        if (mesa.estado !== "en-partida") return;

        /* Calculo quien tiene el turno */
        const numeroJugadores = mesa.jugadores.length;
        const turnoJugador = (mesa.repartidor + 1 + mesa.turnoActual) % numeroJugadores;

        if (mesa.jugadores[turnoJugador].id !== socket.id) return;

        const jugador = mesa.jugadores[turnoJugador];

        /* Remover la carta de la mano del jugador */

        const indiceCarta = jugador.cartas.findIndex(
            c => c.palo === carta.palo && c.numero === carta.numero
        )

        if (indiceCarta === - 1) return;

        jugador.cartas.splice(indiceCarta, 1);

        /* Agregar carta a la mesa */

        mesa.cartasPorRonda.push({ id: socket.id, carta });

        /* Notificar jugada a todos los jugadores en la mesa*/

        this.io.to(idMesa).emit("carta-jugada", { id: socket.id, carta });
    }
}


module.exports = PartidaController;


/*

if (mesa.cartasPorRonda.length === numeroJugadores) {
    const cartaGanadora = determinarGanador(mesa.cartasPorRonda, mesa.triunfo);

    const jugadaGanadora = mesa.cartasPorRonda.find(j => j.carta.palo === cartaGanadora.palo && j.carta.numero === cartaGanadora.numero);
    const ganador = mesa.jugadores.find(j => j.id === jugadaGanadora.id);


    ganador.rondasGanadas = (ganador.rondasGanadas || 0) + 1;

    mesa.cartasPorRonda = [];
    mesa.ronda++;
    mesa.turnoActual = 0;

    mesa.repartidor++;
    if (mesa.repartidor > mesa.jugadores.length) {
        mesa.repartidor = 0;
    }

    this.io.to(idMesa).emit("ronda-terminada", {
        ganador: ganador.nombre,
        cartaGanadora
    })

    if (mesa.ronda === 5) {
        resolverMano(mesa, idMesa);
    } else {
        mesa.turnoActual++;
    }

    this.io.to(idMesa).emit("actualizar-mesa", mesa);
} */
