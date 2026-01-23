const { crearMesa, enviarMesasDisponibles, agregarNuevoUsuario } = require("../utils/mesa.js")
const { crearMazo, mezclarMazo, repartirCartas } = require("../utils/cartas.js");

class MesaController {
    constructor(io, mesas) {
        this.io = io;
        this.mesas = mesas;
    }

    registrar(socket) {
        socket.on("crear-mesa", (nombre, nombreMesa) => {
            this.crearNuevaMesa(socket, nombre, nombreMesa);
        });

        socket.on("unirse-mesa", (data) => {
            this.unirseMesa(socket, data);
        });

        socket.on("jugador-listo", (idMesa) => {
            this.jugadorListo(socket, idMesa);
        })
    }

    crearNuevaMesa(socket, nombre, nombreMesa) {
        const nuevaMesa = crearMesa(socket.id, nombre, nombreMesa);
        this.mesas[nuevaMesa.id] = nuevaMesa;
        socket.join(nuevaMesa.id);
        socket.emit("crear-mesa", nuevaMesa);
        this.io.emit("mesas-disponibles", enviarMesasDisponibles(this.mesas));
    }

    unirseMesa(socket, { idMesa, nombreJugador }) {
        const jugador = agregarNuevoUsuario(this.mesas, idMesa, nombreJugador, socket.id);

        if (!jugador.ok) {
            if (jugador.error === "ya-en-otra-mesa") {
                const mesaActual = this.mesas[jugador.mesaActual];
                socket.join(jugador.mesaActual);
                socket.emit("confirmacion-ingreso", mesaActual);
                socket.emit("mesas-disponibles", enviarMesasDisponibles(this.mesas));
                return;
            } if (jugador.error === "ya-en-esta-mesa") {
                const mesa = this.mesas[idMesa];
                const jugadorExistente = mesa.jugadores.find(j => j.nombre === nombreJugador);
                jugadorExistente.id = socket.id;
                socket.join(idMesa);
                socket.emit("confirmacion-ingreso", mesa);
                this.io.to(idMesa).emit("actualizar-mesa", mesa);
                return;
            }

            else {
                socket.emit("error", jugador.error);
                return;
            }
        }
        socket.join(idMesa);
        this.io.to(idMesa).emit("actualizar-mesa", this.mesas[idMesa]);
        socket.emit("confirmacion-ingreso", this.mesas[idMesa]);
        this.io.emit("mesas-disponibles", enviarMesasDisponibles(this.mesas));
    }

    jugadorListo(socket, idMesa) {
        const mesa = this.mesas[idMesa];
        const jugador = mesa.jugadores.find(j => j.id === socket.id);
        jugador.ready = true;
        const todosListos = mesa.jugadores.every(j => j.ready === true);
        if (todosListos && mesa.jugadores.length >= 2) {
            mesa.mazo = mezclarMazo(crearMazo());
            repartirCartas(mesa);
            mesa.estado = "descarte"
            this.io.to(idMesa).emit("iniciar-partida", mesa);
        } else {
            this.io.to(idMesa).emit("actualizar-mesa", mesa);
        }
    }
}


module.exports = MesaController;