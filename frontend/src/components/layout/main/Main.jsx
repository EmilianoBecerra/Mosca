import "./Main.css";
import { Lobby } from "./lobby/Lobby";
import { CrearMesa } from "./crearMesas/CrearMesa";
import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import { Mesa } from "./mesa/Mesa";
import { Juego } from "./juego/Juego";
import { FinPartida } from "./juego/FinPartida";

export function Main() {
    const { estadoPantalla, mesaId } = useContext(GlobalContext);
    return (
        <main>
            {estadoPantalla === "lobby" && <Lobby />}
            {estadoPantalla === "crear-mesa" && <CrearMesa />}
            {estadoPantalla === "mesa" && <Mesa id={mesaId} />}
            {estadoPantalla === "en-partida" && <Juego />}
            {estadoPantalla === "fin-partida" && <FinPartida />}
        </main>
    );
}
