


function crearJugador(nombre, id, jugadores) {
    const arrayJugadores = Object.values(jugadores);
    
    if (arrayJugadores.length > 1) {
        const existeJugador = arrayJugadores.find(j => j.nombre === nombre || j.id === id);
        if (existeJugador) return { ok: false, msg: "Ya existe un jugador con ese nombre o ya estas registrado." };
    }

    const jugador = { id, nombre };

    return { ok: true, msg: jugador };
}



module.exports = crearJugador;