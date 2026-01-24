const { Schema, model } = require("mongoose");

const usuariosSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    puntosGlobales: Number,
    enPartida: Boolean,
    cartas: Array,
    idMesa: String,
    posicionMesa: Number,
    puntosPartida: Number,
    listoParaSiguienteFase: Boolean,
    listo: Boolean
})


const usuarioModel = model("usuario", usuariosSchema);

module.exports = { usuarioModel }