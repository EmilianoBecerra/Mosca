const paloNumero = {
    palo: ["oro", "espada", "basto", "copa"],
    numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}


export function crearMazo() {
    const mazo = [];
    for (let i = 0; i < paloNumero.palo.length; i++) {
        for (let j = 0; j < paloNumero.numeros.length; j++) {
            mazo.push({ palo: paloNumero.palo[i], numero: paloNumero.numeros[j] })
        }
    }
    return mazo;
}

export function mezclarMazo(mazo) {
    const copia = [...mazo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}


export function repartirCartas() {

}