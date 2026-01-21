import { useContext, useState } from "react";
import "./Lobby.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import { useEffect } from "react";


export function Lobby() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { mesas, setEstadoPantalla, setMesaId, nombreJugador, setNombreJugador } = useContext(GlobalContext);

    const handleClick = (mesa) => {
        if (nombreJugador) {
            setMesaId(mesa.id);
            setEstadoPantalla("mesa");
        } else {
            const nombre = prompt("Escribi tu nombre de jugador");
            console.log(nombre);
            setNombreJugador(nombre);
            setMesaId(mesa.id);
            setEstadoPantalla("mesa");
        }
    }
    return (
        <div className="lobby">
            <h2>Mesas disponibles</h2>
            {
                mesas.length < 1 ?
                    <p className="sin-mesas">No hay mesas disponibles</p> :
                    <div className="sala">
                        {
                            mesas.map((mesa) => {
                                return (
                                    <div className="lista-mesas" key={mesa.id}>
                                        <p>Nombre Mesa </p>
                                        <p className="info">{mesa.nombre ? mesa.nombre : " -"} </p>
                                        <p>Nombre creador </p>
                                        <p className="info"> {mesa.nombreCreador ? mesa.nombreCreador : "-"}</p>
                                        <p>Numeros de Jugadores </p>
                                        <p className="info"> {mesa.jugadores ? `${mesa.jugadores}/6 ` : "-"}</p>
                                        <Buttons type={"button"} label={"Ingresar"} onClick={() => handleClick(mesa)} />
                                    </div>
                                )
                            })
                        }

                    </div>

            }
        </div>
    )
}