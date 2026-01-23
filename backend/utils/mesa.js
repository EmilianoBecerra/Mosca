
function crearMesa(idCreador, nombreCreador, nombreMesa) {
    const idMesa = Date.now() + "-" + idCreador;
    const mesa = {
        id: idMesa,
        nombre: nombreMesa,
        mazo: [],
        triunfo: "",
        estado: "esperando-jugadores",
        fase: "esperando-jugadores-ready",
        turnoActual: 0,
        repartidor: 0,
        cartasPorRonda: [/* recibir {numero:1, palo: basto} */],
        ronda: 0,
        jugadores: [
            {
                id: idCreador,
                nombre: nombreCreador,
                enPartida: true,
                cartas: [],
                idMesa: idMesa,
                posicionMesa: 0,
                puntos: 20,
                listoParaSiguienteFase: false,
                ready: false
            }
        ]
    }

    return mesa;
}

function enviarMesasDisponibles(mesas) {
    const arrayMesas = Object.values(mesas);
    const arrayMesasDisponibles = arrayMesas.filter(m => m.jugadores.length < 6);
    return arrayMesasDisponibles;
}


function agregarNuevoUsuario(mesas, idMesa, nombreJugador, idJugador) {
    const mesa = mesas[idMesa];
    if (!mesa) {
        return { ok: false, error: "mesa-no-existe" };
    }
    if (mesa.jugadores.length >= 6) {
        return { ok: false, error: "mesa-llena" };
    }

    const usuarioExisteEnMesa = mesa.jugadores.find(j => j.id === idJugador || j.nombre === nombreJugador);

    if (usuarioExisteEnMesa) {
        return { ok: false, error: "ya-en-esta-mesa" };
    }

    for (const [id, otraMesa] of Object.entries(mesas)) {
        if (id === idMesa) continue;
        const enOtraMesa = otraMesa.jugadores.find(j => j.id === idJugador || j.nombre === nombreJugador);
        if (enOtraMesa) {
            return { ok: false, error: "ya-en-otra-mesa", mesaActual: id };
        }
    }

    const jugador = {
        id: idJugador,
        nombre: nombreJugador,
        enPartida: true,
        cartas: [],
        idMesa: idMesa,
        posicionMesa: mesa.jugadores.length,
        puntos: 20,
        listoParaSiguienteFase: false,
        ready: false
    };

    mesa.jugadores.push(jugador);
    return { ok: true, jugador };
}

module.exports = { crearMesa, enviarMesasDisponibles, agregarNuevoUsuario }