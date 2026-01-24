const crearJugador = require("../utils/jugadores");



class JugadoresController {
    constructor(io, jugadores) {
        this.io = io;
        this.jugadores = jugadores;
    }

    registrar(socket) {
        socket.on("registrar-jugador", (nombre, id) => {
            this.registrarJugador(socket, nombre, id);
        })
    }


    async registrarJugador(socket, nombre, id) {
        const jugador = await crearJugador(nombre, id);

        if (!jugador.ok) {
            socket.emit("error-registro", jugador.msg);
            return;
        }
        socket.emit("confirmacion-registro", jugador.data);
    }
}


module.exports = JugadoresController;