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

    unirseMesa(socket, { idMesa, nombre }) {
        const jugador = agregarNuevoUsuario(idMesa, nombre, this.mesas, socket.id);

        if (!jugador) {
            socket.emit("error", "No se pudo unir a la mesa");
            return;
        }

        if (jugador === "jugador-en-la-mesa") {
            this.io.to(idMesa).emit("actualizar-mesa", this.mesas[idMesa]);
            socket.emit("confirmacion-ingreso", this.mesas[idMesa]);
            this.io.emit("mesas-disponibles", enviarMesasDisponibles(this.mesas));
            return;
        }

        socket.join(idMesa);
        this.io.to(idMesa).emit("actualizar-mesa", this.mesas[idMesa]);
        socket.emit("confirmacion-ingreso", this.mesas[idMesa]);
        this.io.emit("mesas-disponibles", enviarMesasDisponibles(this.mesas));
    }

    jugadorListo(socket, idMesa) {
        const mesa = this.mesas[idMesa];
        const jugador = mesa.jugadores.find(j => j.idJugador === socket.id);
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