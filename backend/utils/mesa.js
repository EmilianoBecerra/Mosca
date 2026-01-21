
function crearMesa(idCreador, nombreCreador, nombreMesa) {
    const idMesa = Date.now() + "-" + idCreador;
    const mesa = {
        id: idMesa,
        nombre: nombreMesa,
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



function enviarMesasDisponibles(mesas) {
    const arrayMesas = Object.values(mesas);
    const arrayMesasDisponibles = arrayMesas.filter(m => m.jugadores.length < 6);
    const infoMesas = []
    for (const mesa of arrayMesasDisponibles) {
        const id = mesa.id;
        const nombreCreador = mesa.jugadores[0].nombre;
        const jugadores = mesa.jugadores.length;
        const nombre = mesa.nombre;
        const info = { id, nombreCreador, jugadores, nombre };
        infoMesas.push(info);
    }

    return infoMesas;
}


function agregarNuevoUsuario(idMesa, nombre, mesas, idJugador) {
    const mesa = mesas[idMesa];
    if (!mesa || mesa.jugadores.length >= 6) {
        return null;
    }
    const jugador = {
        idJugador: idJugador,
        nombre: nombre,
        enPartida: true,
        cartas: [],
        idMesa: idMesa,
        posicionMesa: mesa.jugadores.length,
        puntos: 20,
        listoParaSiguienteFase: false,
        ready: false
    };

    mesa.jugadores.push(jugador);
    return jugador.nombre;
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


module.exports = { crearMesa, enviarMesasDisponibles, agregarNuevoUsuario }