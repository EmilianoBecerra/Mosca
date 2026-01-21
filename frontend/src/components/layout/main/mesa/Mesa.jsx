import { useContext, useState, useEffect } from "react";
import "./Mesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Mesa({ id }) {
    const { socket, nombreJugador, setEstadoPantalla } = useContext(GlobalContext);
    const [mesa, setMesa] = useState(null);
    const [miJugador, setMiJugador] = useState(null);

    useEffect(() => {
        socket.emit("unirse-mesa", { idMesa: id, nombre: nombreJugador });

        socket.on("confirmacion-ingreso", (datosMesa) => {
            setMesa(datosMesa);
            const yo = datosMesa.jugadores.find(j => j.nombre === nombreJugador);
            setMiJugador(yo);
        });

        socket.on("actualizar-mesa", (datosMesa) => {
            setMesa(datosMesa);
            const yo = datosMesa.jugadores.find(j => j.nombre === nombreJugador);
            setMiJugador(yo);
        });

        socket.on("iniciar-partida", (datosMesa) => {
            setMesa(datosMesa);
        });

        return () => {
            socket.off("confirmacion-ingreso");
            socket.off("actualizar-mesa");
            socket.off("iniciar-partida");
        }
    }, []);

    const handleListo = () => {
        socket.emit("jugador-listo", id);
    };

    const handleSalir = () => {
        setEstadoPantalla("lobby");
    };

    if (!mesa) {
        return (
            <div className="mesa-loading">
                <div className="spinner"></div>
                <p>Conectando a la mesa...</p>
            </div>
        );
    }

    const jugadoresListos = mesa.jugadores.filter(j => j.ready).length;
    const totalJugadores = mesa.jugadores.length;
    const puedeIniciar = totalJugadores >= 2;

    // Vista de partida en curso
    if (mesa.estado === "en-partida") {
        return (
            <div className="mesa partida">
                <div className="partida-header">
                    <h2>{mesa.nombre}</h2>
                    <span className="triunfo-badge">Triunfo: {mesa.triunfo}</span>
                </div>

                <div className="mis-cartas">
                    <h3>Mis cartas</h3>
                    <div className="cartas-container">
                        {miJugador?.cartas?.map((carta, index) => (
                            <div key={index} className={`carta ${carta.palo}`}>
                                <span className="carta-numero">{carta.numero}</span>
                                <span className="carta-palo">{carta.palo}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="jugadores-partida">
                    {mesa.jugadores.map((jugador) => (
                        <div key={jugador.idJugador} className={`jugador-partida ${jugador.nombre === nombreJugador ? 'yo' : ''}`}>
                            <span className="jugador-nombre">{jugador.nombre}</span>
                            <span className="jugador-puntos">{jugador.puntos} pts</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Vista de sala de espera
    return (
        <div className="mesa sala-espera">
            <div className="mesa-header">
                <h2>{mesa.nombre}</h2>
                <span className="estado-badge">Esperando jugadores</span>
            </div>

            <div className="jugadores-info">
                <span className="contador">{totalJugadores}/6 jugadores</span>
                <span className="listos">{jugadoresListos} listos</span>
            </div>

            <div className="jugadores-lista">
                {mesa.jugadores.map((jugador) => (
                    <div key={jugador.idJugador} className={`jugador-card ${jugador.nombre === nombreJugador ? 'yo' : ''}`}>
                        <div className="jugador-info">
                            <span className="jugador-nombre">{jugador.nombre}</span>
                            {jugador.posicionMesa === 0 && <span className="host-badge">Host</span>}
                        </div>
                        <span className={`estado ${jugador.ready ? 'listo' : 'esperando'}`}>
                            {jugador.ready ? 'Listo' : 'Esperando'}
                        </span>
                    </div>
                ))}

                {/* Espacios vacios */}
                {Array.from({ length: 6 - totalJugadores }).map((_, i) => (
                    <div key={`empty-${i}`} className="jugador-card vacio">
                        <span className="jugador-nombre">Esperando jugador...</span>
                    </div>
                ))}
            </div>

            {!puedeIniciar && (
                <p className="mensaje-minimo">Se necesitan al menos 2 jugadores para iniciar</p>
            )}

            <div className="mesa-actions">
                <Buttons
                    type="button"
                    label={miJugador?.ready ? "Listo!" : "Estoy listo"}
                    onClick={handleListo}
                />
                <button className="btn-salir" onClick={handleSalir}>Salir de la mesa</button>
            </div>
        </div>
    );
}