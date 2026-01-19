const test = require("node:test");
const assert = require("node:assert");
const { determinarGanador } = require("../utils/partida.js")

const cartasJugadas = [
    { idJugador: 0, carta: { palo: "espada", numero: 1 } },
    { idJugador: 1, carta: { palo: "copa", numero: 3 } },
    { idJugador: 2, carta: { palo: "copa", numero: 1 } },
    { idJugador: 3, carta: { palo: "espada", numero: 7 } },
]

const triunfo = "oro";

test("determinar ganadores", () => {
    const ganador = determinarGanador(cartasJugadas, triunfo);
    assert.strictEqual(ganador, 0);
})

