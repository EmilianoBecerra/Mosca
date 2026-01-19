
function obtenerFuerza(numero) {
    const fuerzas = [1, 3, 12, 11, 10, 9, 8, 7, 6, 5, 4, 2];

    const fuerza = fuerzas.findIndex(c => c === numero);

    return fuerza;
}

function determinarGanador(cartasJugadas, triunfo) {
    /* cartasJugadas: [{idjugador: 1, carta: {palo:"oro", numero:1}}] */
    const fuerzas = [1, 3, 12, 11, 10, 9, 8, 7, 6, 5, 4, 2];
    const paloSalida = cartasJugadas[0].carta.palo;
    const cartasTriunfo = cartasJugadas.filter(c => c.carta.palo === triunfo).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));
    const cartasSalida = cartasJugadas.filter(c => c.carta.palo === paloSalida).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));

    if (cartasTriunfo.length > 0) {
        return cartasTriunfo[0].idJugador;
    } else {
        return cartasSalida[0].idJugador;
    }
}

module.exports = { obtenerFuerza, determinarGanador }