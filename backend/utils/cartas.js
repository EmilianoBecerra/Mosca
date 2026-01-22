const paloNumero = {
    palo: ["oro", "espada", "basto", "copa"],
    numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

function crearMazo() {
    const mazo = [];
    for (let i = 0; i < paloNumero.palo.length; i++) {
        for (let j = 0; j < paloNumero.numeros.length; j++) {
            mazo.push({ palo: paloNumero.palo[i], numero: paloNumero.numeros[j] })
        }
    }
    return mazo;
}

function mezclarMazo(mazo) {
    const copia = [...mazo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function repartirCartas(mesa) {
    const numeroJugadores = mesa.jugadores.length;
    let triunfo;
    const mazo = mesa.mazo;
    mesa.jugadores.forEach(j => j.cartas = []);
    for (let c = 0; c < 5; c++) {
        for (let i = 0; i < numeroJugadores; i++) {
            const carta = mazo.pop();
            mesa.jugadores[i].cartas.push(carta);
        }
    }
    const cartasRepartidor = mesa.jugadores[mesa.repartidor].cartas;
    triunfo = cartasRepartidor[cartasRepartidor.length - 1].palo;
    mesa.triunfo = triunfo;
}


function descartarCartas(mesa, arrayJugadores) {
    const jugadores = mesa.jugadores;
    for (const jugador of jugadores) /* Jugador del array jugadores en la mesa */ {
        const jugadorEncontrado = arrayJugadores.find(j => j.id === jugador.id);
        if (!jugadorEncontrado) {
            continue; /* Si no se encuentra jugador, pasa al siguiente */
        }
        /* determina cartas seleccionadas .indices propiedad de objeto que envia el front */
        const indiceCartasADescartar = jugadorEncontrado.indices;
        const cartasRestantes = jugador.cartas.filter((_, i) => !indiceCartasADescartar.includes(i));
        jugador.cartas = cartasRestantes;
    }
}

function repartirPostDescarte(mesa) {
    /* Guardo en una variable los jugadores para manejar el array desde ahi */
    const jugadoresEnLaMesa = mesa.jugadores;
    for (let i = 0; i < jugadoresEnLaMesa.length; i++) {
        /* Busco cual es el jugador que le sigue al que reparte */
        const posicionJugador = (mesa.repartidor + 1 + i) % jugadoresEnLaMesa.length;
        /* Pregunto cuantas cartas le falta a cada jugador */
        const cartasFaltante = 5 - jugadoresEnLaMesa[posicionJugador].cartas.length;
        /* Reparto las cartas para que cada jugador tenga 5 */
        for (let c = 0; c < cartasFaltante; c++) {
            const carta = mesa.mazo.pop();
            jugadoresEnLaMesa[posicionJugador].cartas.push(carta);
        }
    }
}



module.exports = { crearMazo, mezclarMazo, repartirCartas, descartarCartas, repartirPostDescarte };