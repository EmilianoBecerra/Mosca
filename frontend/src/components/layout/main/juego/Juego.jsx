import { useContext, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import "./Juego.css";
import { Buttons } from "../../../parts/Buttons";

const ICONOS_PALO = {
    oro: "🪙",
    espada: "⚔️",
    basto: "🪵",
    copa: "🏆"
};

export function Juego() {
    const { mesa, nombreJugador, descartarCartas, jugarCarta, bazaActual, resultadoBaza } = useContext(GlobalContext);
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

    if (!mesa) return null;

    const miJugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
    const otrosJugadores = mesa.jugadores.filter(j => j.nombre !== nombreJugador);

    const numeroJugadores = mesa.jugadores.length;
    const turnoIndex = (mesa.repartidor + 1 + mesa.turnoActual) % numeroJugadores;
    const jugadorEnTurno = mesa.jugadores[turnoIndex];
    const esMiTurno = jugadorEnTurno?.idJugador === miJugador?.idJugador;

    const esDescarte = mesa.estado === "descarte";
    const esPartida = mesa.estado === "en-partida";

    const toggleCarta = (index) => {
        if (esPartida) return;
        if (cartasSeleccionadas.includes(index)) {
            setCartasSeleccionadas(cartasSeleccionadas.filter(i => i !== index));
        } else {
            setCartasSeleccionadas([...cartasSeleccionadas, index]);
        }
    };

    const handleDescartar = () => {
        descartarCartas(cartasSeleccionadas);
        setCartasSeleccionadas([]);
    };

    const handleJugarCarta = (carta, index) => {
        if (!esPartida || !esMiTurno) return;
        jugarCarta(carta);
    };

    const obtenerNombreJugador = (idJugador) => {
        const jugador = mesa.jugadores.find(j => j.idJugador === idJugador);
        return jugador?.nombre || "Jugador";
    };

    return (
        <div className="juego-container">
            <div className="info-mesa">
                <div className="info-left">
                    <h2>{mesa.nombre}</h2>
                    <span className="ronda-info">Ronda {mesa.ronda + 1}</span>
                </div>
                <div className="triunfo">
                    <span>Triunfo:</span>
                    <span className={`palo-badge ${mesa.triunfo?.toLowerCase()}`}>
                        {ICONOS_PALO[mesa.triunfo?.toLowerCase()]} {mesa.triunfo}
                    </span>
                </div>
                <div className="fase-badge">
                    {esDescarte ? "Fase de Descarte" : "En Partida"}
                </div>
            </div>

            <div className="area-juego">
                <div className="otros-jugadores">
                    {otrosJugadores.map((jugador) => {
                        const esElTurno = jugador.idJugador === jugadorEnTurno?.idJugador;
                        return (
                            <div
                                key={jugador.idJugador}
                                className={`jugador-rival ${esElTurno ? 'turno-activo' : ''}`}
                            >
                                <div className="avatar">
                                    {esElTurno && <span className="turno-indicator">▶</span>}
                                    👤
                                </div>
                                <span className="nombre">{jugador.nombre}</span>
                                <div className="jugador-stats">
                                    <span className="cartas-count">🃏 {jugador.cartas?.length || 0}</span>
                                    <span className="puntos">{jugador.puntos} pts</span>
                                </div>
                                {esDescarte && jugador.listoParaDescartar && (
                                    <span className="listo-badge">Listo</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="tablero-centro">
                    {resultadoBaza ? (
                        <div className="resultado-baza">
                            <div className="resultado-baza-content">
                                <span className="resultado-icon">🏆</span>
                                <h4>¡{resultadoBaza.ganador} gana la baza!</h4>
                                {resultadoBaza.cartaGanadora && (
                                    <div className={`carta-ganadora carta ${resultadoBaza.cartaGanadora.palo.toLowerCase()}`}>
                                        <span className="numero">{resultadoBaza.cartaGanadora.numero}</span>
                                        <span className="palo-icon">
                                            {ICONOS_PALO[resultadoBaza.cartaGanadora.palo.toLowerCase()]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : bazaActual.length > 0 ? (
                        <div className="baza-actual">
                            <h4>Baza Actual</h4>
                            <div className="cartas-baza">
                                {bazaActual.map((jugada, idx) => (
                                    <div key={idx} className="carta-jugada-container">
                                        <span className="jugador-nombre-baza">
                                            {obtenerNombreJugador(jugada.idJugador)}
                                        </span>
                                        <div className={`carta ${jugada.carta.palo.toLowerCase()}`}>
                                            <span className="numero">{jugada.carta.numero}</span>
                                            <span className="palo-icon">
                                                {ICONOS_PALO[jugada.carta.palo.toLowerCase()]}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="esperando-jugadas">
                            {esDescarte ? (
                                <p>Selecciona las cartas que deseas descartar</p>
                            ) : esPartida ? (
                                <p>{esMiTurno ? "¡Es tu turno! Haz clic en una carta para jugarla" : `Esperando a ${jugadorEnTurno?.nombre}...`}</p>
                            ) : (
                                <p>Esperando...</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mis-cartas-area">
                    <div className="mi-info">
                        <h3>{miJugador?.nombre}</h3>
                        <span className="mis-puntos">{miJugador?.puntos} puntos</span>
                        {esMiTurno && esPartida && <span className="mi-turno-badge">Tu turno</span>}
                    </div>

                    <div className="mano">
                        {miJugador?.cartas?.map((carta, index) => (
                            <div
                                key={index}
                                className={`carta ${carta.palo.toLowerCase()} ${cartasSeleccionadas.includes(index) ? 'seleccionada' : ''} ${esPartida && esMiTurno ? 'jugable' : ''}`}
                                onClick={() => esDescarte ? toggleCarta(index) : handleJugarCarta(carta, index)}
                            >
                                <span className="numero">{carta.numero}</span>
                                <span className="palo-icon">{ICONOS_PALO[carta.palo.toLowerCase()]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="acciones">
                        {esDescarte && (
                            miJugador?.listoParaDescartar ? (
                                <p className="estado-espera">Esperando a otros jugadores...</p>
                            ) : (
                                <Buttons
                                    type="button"
                                    label={cartasSeleccionadas.length > 0 ? `Descartar (${cartasSeleccionadas.length})` : "No descartar"}
                                    onClick={handleDescartar}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
