import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext(null);

// Función para generar UUID simple
const generarUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Función para crear socket con o sin auth
const crearSocket = () => {
    const odId = localStorage.getItem("odId");
    const nombre = localStorage.getItem("nombreJugador");

    // Si tenemos datos guardados, conectamos con auth
    if (odId && nombre) {
        return io("http://localhost:3000", {
            auth: { odId, nombre }
        });
    }

    // Si no, conectamos sin auth
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

    // Registrar jugador: genera UUID, guarda datos, y reconecta con auth
    const registrarJugador = (nombre) => {
        // Generar nuevo UUID o usar existente
        let odId = localStorage.getItem("odId");
        if (!odId) {
            odId = generarUUID();
            localStorage.setItem("odId", odId);
        }

        // Guardar nombre
        localStorage.setItem("nombreJugador", nombre);

        // Desconectar socket actual
        socketRef.current.disconnect();

        // Crear nuevo socket con auth
        const nuevoSocket = io("http://localhost:3000", {
            auth: { odId, nombre }
        });

        // Configurar listeners en el nuevo socket
        configurarListeners(nuevoSocket);
        socketRef.current = nuevoSocket;
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

        sock.on("confirmacion-registro", (data) => {
            if (data.ok) {
                guardarNombreJugador(data.msg.nombre);
            }
        });

        sock.on("error-registro", (msg) => {
            setError(msg);
            alert(msg);
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

