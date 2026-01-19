const mesa = {
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
    cartasDescartadas: [],
    cartasJugadasPorRonda: [
        {
            idJugador: "socket.id", carta: { numero: 1, palo: "oro" },
        }
    ],
    estado: "llena",
    ronda: 0 /* segun posicion de los jugadores jugadores.posicionMesa usar los turnos desde aca*/,
    fase: "esperando-jugadores-ready",
    turnoActual: 0,
    repartidor: 0
}