import { useContext, useState } from "react";
import "./Lobby.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Lobby() {
    const { mesas, unirseMesa, nombreJugador, setNombreJugador, setEstadoPantalla } = useContext(GlobalContext);
    const [nombreInput, setNombreInput] = useState(nombreJugador || "");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

    const handleClick = (mesa) => {
        if (!nombreJugador) {
            setMesaSeleccionada(mesa);
            setMostrarModal(true);
            return;
        }
        unirseMesa(mesa.id, nombreJugador);
    };

    const handleConfirmarNombre = (e) => {
        e.preventDefault();
        if (!nombreInput.trim()) return;
        setNombreJugador(nombreInput.trim());
        setMostrarModal(false);
        if (mesaSeleccionada) {
            unirseMesa(mesaSeleccionada.id, nombreInput.trim());
        }
    };

    return (
        <div className="lobby">
            <div className="lobby-header">
                <h2>Mesas Disponibles</h2>
                <button
                    className="btn-crear-mesa"
                    onClick={() => setEstadoPantalla("crear-mesa")}
                >
                    + Crear Mesa
                </button>
            </div>

            {mesas.length < 1 ? (
                <div className="sin-mesas">
                    <div className="sin-mesas-icon">🃏</div>
                    <h3>No hay mesas disponibles</h3>
                    <p>Crea una mesa nueva para comenzar a jugar</p>
                    <Buttons
                        label="Crear Mesa"
                        onClick={() => setEstadoPantalla("crear-mesa")}
                    />
                </div>
            ) : (
                <div className="sala">
                    {mesas.map((mesa) => (
                        <div className="mesa-card" key={mesa.id}>
                            <div className="mesa-card-header">
                                <span className="mesa-nombre">{mesa.nombre || "Sin nombre"}</span>
                                <span className={`jugadores-badge ${mesa.jugadores >= 6 ? 'llena' : ''}`}>
                                    {mesa.jugadores}/6
                                </span>
                            </div>
                            <div className="mesa-card-body">
                                <div className="mesa-info-row">
                                    <span className="label">Creador:</span>
                                    <span className="value">{mesa.nombreCreador || "Anonimo"}</span>
                                </div>
                                <div className="mesa-progress">
                                    <div
                                        className="mesa-progress-bar"
                                        style={{ width: `${(mesa.jugadores / 6) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <Buttons
                                type="button"
                                label={mesa.jugadores >= 6 ? "Mesa Llena" : "Unirse"}
                                onClick={() => handleClick(mesa)}
                                disabled={mesa.jugadores >= 6}
                            />
                        </div>
                    ))}
                </div>
            )}

            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Ingresa tu nombre</h3>
                        <form onSubmit={handleConfirmarNombre}>
                            <input
                                type="text"
                                value={nombreInput}
                                onChange={(e) => setNombreInput(e.target.value)}
                                placeholder="Tu nombre de jugador"
                                maxLength={20}
                                minLength={2}
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <Buttons type="submit" label="Confirmar" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
