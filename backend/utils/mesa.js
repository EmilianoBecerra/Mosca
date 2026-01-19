
function crearMesa(idCreador, nombreCreador) {
    const idMesa = Date.now() + "-" + idCreador;
    const mesa = {
        id: idMesa,
        jugadores: [
            {
                idJugador: idCreador,
                nombre: nombreCreador,
                enPartida: true,
                cartas: [],
                idMesa: idMesa,
                posicionMesa: 0,
                puntos: 20,
                listoParaSiguienteFase: false,
                ready: false
            }
        ],
        mazo: [],
        triunfo: "",
        estado: "esperando-jugadores",
        ronda: 0,
        fase: "esperando-jugadores-ready",
        turnoActual: 0,
        repartidor: 0
    }

    return mesa;
}


/* const mesa = {
    id: "mesa-1",
    jugadores: [{
        idJugador: "socket.id",
        nombre: "pepe",
        enPartida: true,
        cartas: [],
        idMesa: "mesa-1",
        posicionMesa: 0,
        puntos: 15,
        listoParaSiguienteFase: false,
        ready: false,
    }
    ],
    mazo: [],
    triunfo: "solamente el palo que sea el triunfo",
    estado: "llena",
    ronda: 0,
    fase: "esperando-jugadores-ready",
    turnoActual: 0,
    repartidor: 0
} */


module.exports = { crearMesa }