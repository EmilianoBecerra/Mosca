const crearJugador = require("../utils/jugadores");



class JugadoresController {
    constructor(io, jugadores) {
        this.io = io;
        this.jugadores = jugadores;
    }


    registrar(socket) {
        socket.on("registrar-jugador", (nombre) => {
            this.registrarJugador(socket, nombre);
        })
    }



    registrarJugador(socket, nombre) {
        const id = socket.odId;
        const jugador = crearJugador(nombre, id, this.jugadores);
        this.jugadores[id] = {
            id,
            nombre: jugador.msg.nombre
        };

        if (!jugador.ok) {
            socket.emit("error-registro", jugador.msg);
            return;
        }
        socket.emit("confirmacion-registro", jugador);
    }
}


module.exports = JugadoresController;