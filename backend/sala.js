const sala = {
    id: "sala-1",
    jugadores: [{
        idJugador: "socket.id",
        nombre: "pepe",
        enPartida: true,
        cartas: [{ numero: 1, palo: "oro" }, { numero: 3, palo: "basto" }, { numero: 7, palo: "espada" }],
        idMesa: "sala-1",
        posicionMesa: 0,
        puntos: 15,
        listoParaSiguienteFase: false,
        ready: true,
    }, {}],
    mazo: [],
    triunfo: {},
    cartasDescartadas: [],
    cartasJugadasPorRonda: [
        {
            idJugador: 0, carta: { numero: 1, palo: "oro" },
        }
    ],
    estado: "llena",
    ronda: 0 /* segun posicion de los jugadores jugadores.posicionMesa usar los turnos desde aca*/,
    fase: "esperando-jugadores-ready",
    turnoActual:0,
    repartidor: 0
}