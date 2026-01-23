import { useContext } from "react";
import "./Lobby.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Lobby() {
    const { mesas, unirseMesa, nombreJugador, setEstadoPantalla } = useContext(GlobalContext);

    const handleClick = (mesa) => {
        unirseMesa(mesa.id, nombreJugador);
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
                                <span className={`jugadores-badge ${mesa.jugadores.length >= 6 ? 'llena' : ''}`}>
                                    {mesa.jugadores.length}/6
                                </span>
                            </div>
                            <div className="mesa-card-body">
                                <div className="mesa-info-row">
                                    <span className="label">Creador:</span>
                                    <span className="value">{mesa?.jugadores[0]?.nombre || "Anonimo"}</span>
                                </div>
                                <div className="mesa-progress">
                                    <div
                                        className="mesa-progress-bar"
                                        style={{ width: `${(mesa.jugadores.length / 6) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <Buttons
                                type="button"
                                label={mesa.jugadores.length >= 6 ? "Mesa Llena" : "Unirse"}
                                onClick={() => handleClick(mesa)}
                                disabled={mesa.jugadores.length >= 6}
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
