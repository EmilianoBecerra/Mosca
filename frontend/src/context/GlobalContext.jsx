import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";


export const GlobalContext = createContext(null);

const socket = io("http://localhost:3000");

export const GlobalContextProvider = (props) => {
    const [mesas, setMesas] = useState([]);
    const [estadoPantalla, setEstadoPantalla] = useState("lobby");
    const [mesaId, setMesaId] = useState("");
    const [nombreJugador, setNombreJugador] = useState("");

    useEffect(() => {
        socket.on("mesas-disponibles", (mesas) => {
            setMesas(mesas);
        });
        return () => {
            socket.off("mesas-disponibles");
        };
    }, []);

    return (
        <GlobalContext.Provider value={{
            socket, mesas, setMesas, estadoPantalla, setEstadoPantalla, mesaId, setMesaId, nombreJugador, setNombreJugador
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}


