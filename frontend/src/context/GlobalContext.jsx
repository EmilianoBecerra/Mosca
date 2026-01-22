import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";


export const GlobalContext = createContext(null);

const socket = io("http://localhost:3000");

export const GlobalContextProvider = (props) => {
    const [mesas, setMesas] = useState([]);
    const [mesa, setMesa] = useState(null);
    const [estadoPantalla, setEstadoPantalla] = useState("lobby");
    const [mesaId, setMesaId] = useState("");
    const [nombreJugador, setNombreJugador] = useState("");
    const [error, setError] = useState("");
    const [bazaActual, setBazaActual] = useState([]);
    const [resultadoBaza, setResultadoBaza] = useState(null);
    const [finPartida, setFinPartida] = useState(null);

    const crearMesa = (nombre, nombreMesa) => {
        setNombreJugador(nombre);
        socket.emit("crear-mesa", nombre, nombreMesa);
    };

    const unirseMesa = (idMesa, nombre) => {
        setNombreJugador(nombre);
        setMesaId(idMesa); // Guardamos el ID por si acaso, aunque mesa actual deberia bastar
        socket.emit("unirse-mesa", { idMesa, nombre });
    };

    const jugadorListo = () => {
        if (mesa && mesa.id) {
            socket.emit("jugador-listo", mesa.id);
        }
    };

    const descartarCartas = (indices) => {
        if (mesa && mesa.id) {
            socket.emit("descarte", { idMesa: mesa.id, indices });
        }
    };

    const jugarCarta = (carta) => {
        if (mesa && mesa.id) {
            socket.emit("jugar", { idMesa: mesa.id, carta });
        }
    };

    useEffect(() => {
        socket.on("mesas-disponibles", (mesas) => {
            setMesas(mesas);
        });

        socket.on("crear-mesa", (nuevaMesa) => {
            setMesa(nuevaMesa);
            setMesaId(nuevaMesa.id);
            setEstadoPantalla("mesa");
        });

        socket.on("actualizar-mesa", (mesaActualizada) => {
            setMesa(mesaActualizada);
        });

        socket.on("confirmacion-ingreso", (mesaIngresada) => {
            setMesa(mesaIngresada);
            setMesaId(mesaIngresada.id);
            setEstadoPantalla("mesa");
        });

        socket.on("iniciar-partida", (mesaPartida) => {
            setMesa(mesaPartida);
            setBazaActual([]);
            setEstadoPantalla("en-partida");
        });

        socket.on("carta-jugada", ({ idJugador, carta }) => {
            setBazaActual(prev => [...prev, { idJugador, carta }]);
        });

        socket.on("baza-resuelta", ({ ganador, idGanador, cartaGanadora }) => {
            setResultadoBaza({ ganador, idGanador, cartaGanadora });
            setTimeout(() => {
                setBazaActual([]);
                setResultadoBaza(null);
            }, 2000);
        });

        socket.on("fase-descarte", (mesaActualizada) => {
            setMesa(mesaActualizada);
            setBazaActual([]);
        });

        socket.on("nueva-ronda", ({ ronda }) => {
            setBazaActual([]);
        });

        socket.on("fin-partida", ({ ganador, jugadores }) => {
            setFinPartida({ ganador, jugadores });
            setEstadoPantalla("fin-partida");
        });

        socket.on("error", (msg) => {
            setError(msg);
            alert(msg);
        });

        return () => {
            socket.off("mesas-disponibles");
            socket.off("crear-mesa");
            socket.off("actualizar-mesa");
            socket.off("confirmacion-ingreso");
            socket.off("iniciar-partida");
            socket.off("carta-jugada");
            socket.off("baza-resuelta");
            socket.off("fase-descarte");
            socket.off("nueva-ronda");
            socket.off("fin-partida");
            socket.off("error");
        };
    }, []);

    return (
        <GlobalContext.Provider value={{
            socket,
            mesas,
            mesa,
            estadoPantalla,
            setEstadoPantalla,
            mesaId,
            setMesaId,
            nombreJugador,
            setNombreJugador,
            crearMesa,
            unirseMesa,
            jugadorListo,
            descartarCartas,
            jugarCarta,
            bazaActual,
            resultadoBaza,
            finPartida,
            setFinPartida,
            error
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

