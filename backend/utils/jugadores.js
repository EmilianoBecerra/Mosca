const { usuarioModel } = require("../model/usuariosModel");



async function crearJugador(nombre, id) {
    try {
        if (id) {
            let jugador = await usuarioModel.findById(id);

            if (jugador) {
                return { ok: true, msg: jugador, data: jugador };
            }
        }

        const nombreTomado = await usuarioModel.findOne({ nombre });
        if (nombreTomado) {
            return { ok: false, msg: "Ya existe un jugador con ese nombre" };
        }

        jugador = await usuarioModel.create({ id, nombre, puntosGlobales: 0 })
        return { ok: true, msg: "Jugador creado", data: jugador };
    } catch (e) {
        console.error(e);
        return { ok: false, msg: "Error al registrar usuario en base de datos." }
    }

}



module.exports = crearJugador;



