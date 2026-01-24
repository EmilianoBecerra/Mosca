import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext(null);

// Función para crear socket
const crearSocket = () => {
    return io("http://localhost:3000");
};

export const GlobalContextProvider = (props) => {
    // useRef para mantener el socket (puede cambiar al reconectar)
    const socketRef = useRef(crearSocket());

    const [mesas, setMesas] = useState([]);
    const [mesa, setMesa] = useState(null);
    const [estadoPantalla, setEstadoPantalla] = useState("lobby");
    const [mesaId, setMesaId] = useState("");
    const [nombreJugador, setNombreJugador] = useState(() => {
        return localStorage.getItem("nombreJugador") || "";
    });

    const guardarNombreJugador = (nombre) => {
        localStorage.setItem("nombreJugador", nombre);
        setNombreJugador(nombre);
    };
    const [error, setError] = useState("");
    const [rondaActual, setRondaActual] = useState([]);
    const [resultadoRonda, setResultadoRonda] = useState(null);
    const [finPartida, setFinPartida] = useState(null);

    // Registrar jugador: emite evento al servidor para crear/obtener de MongoDB
    const registrarJugador = (nombre) => {
        const idGuardado = localStorage.getItem("odId") || null;
        socketRef.current.emit("registrar-jugador", nombre, idGuardado);
    };

    // Función para configurar todos los listeners del socket
    const configurarListeners = (sock) => {
        sock.on("mesas-disponibles", (mesas) => {
            setMesas(mesas);
        });

        sock.on("crear-mesa", (nuevaMesa) => {
            setMesa(nuevaMesa);
            setMesaId(nuevaMesa.id);
            setEstadoPantalla("mesa");
        });

        sock.on("actualizar-mesa", (mesaActualizada) => {
            setMesa(mesaActualizada);
        });

        sock.on("confirmacion-ingreso", (mesaIngresada) => {
            setMesa(mesaIngresada);
            setMesaId(mesaIngresada.id);
            setEstadoPantalla("mesa");
        });

        sock.on("iniciar-partida", (mesaPartida) => {
            setMesa(mesaPartida);
            setRondaActual([]);
            setEstadoPantalla("en-partida");
        });

        sock.on("carta-jugada", ({ id, carta }) => {
            setRondaActual(prev => [...prev, { id, carta }]);
        });

        sock.on("ronda-resuelta", ({ ganador, idGanador, cartaGanadora }) => {
            setResultadoRonda({ ganador, idGanador, cartaGanadora });
            setTimeout(() => {
                setRondaActual([]);
                setResultadoRonda(null);
            }, 2000);
        });

        sock.on("fase-descarte", (mesaActualizada) => {
            setMesa(mesaActualizada);
            setRondaActual([]);
        });

        sock.on("nueva-ronda", ({ ronda }) => {
            setRondaActual([]);
        });

        sock.on("fin-partida", ({ ganador, jugadores }) => {
            setFinPartida({ ganador, jugadores });
            setEstadoPantalla("fin-partida");
        });

        sock.on("error", (msg) => {
            setError(msg);
            console.log("error recibido:", msg);
            alert(msg);
        });

        sock.on("confirmacion-registro", (jugador) => {
            // jugador es el documento de MongoDB
            localStorage.setItem("odId", jugador._id);
            guardarNombreJugador(jugador.nombre);
        });

        sock.on("error-registro", (msg) => {
            setError(msg);
            alert(msg);
            // Si hay error de base de datos, limpiar y volver al inicio
            if (msg === "Error al registrar usuario en base de datos.") {
                localStorage.removeItem("odId");
                localStorage.removeItem("nombreJugador");
                setNombreJugador("");
            }
        });
    };

    const crearMesa = (nombre, nombreMesa) => {
        setNombreJugador(nombre);
        socketRef.current.emit("crear-mesa", nombre, nombreMesa);
    };

    const unirseMesa = (idMesa, nombreJugador) => {
        setNombreJugador(nombreJugador);
        setMesaId(idMesa);
        socketRef.current.emit("unirse-mesa", { idMesa, nombreJugador });
    };

    const jugadorListo = () => {
        if (mesa && mesa.id) {
            socketRef.current.emit("jugador-listo", mesa.id);
        }
    };

    const descartarCartas = (indices) => {
        if (mesa && mesa.id) {
            socketRef.current.emit("descarte", { idMesa: mesa.id, indices });
        }
    };

    const jugarCarta = (carta) => {
        if (mesa && mesa.id) {
            socketRef.current.emit("jugar", { idMesa: mesa.id, carta });
        }
    };

    useEffect(() => {
        // Configurar listeners en el socket inicial
        configurarListeners(socketRef.current);

        // Si hay datos guardados, emitir evento para reconectar
        const idGuardado = localStorage.getItem("odId");
        const nombreGuardado = localStorage.getItem("nombreJugador");
        if (idGuardado && nombreGuardado) {
            socketRef.current.emit("registrar-jugador", nombreGuardado, idGuardado);
        }

        return () => {
            socketRef.current.removeAllListeners();
        };
    }, []);

    return (
        <GlobalContext.Provider value={{
            socket: socketRef.current,
            mesas,
            mesa,
            estadoPantalla,
            setEstadoPantalla,
            mesaId,
            setMesaId,
            nombreJugador,
            guardarNombreJugador,
            registrarJugador,
            crearMesa,
            unirseMesa,
            jugadorListo,
            descartarCartas,
            jugarCarta,
            rondaActual,
            resultadoRonda,
            finPartida,
            setFinPartida,
            error
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

