import { useContext, useState } from "react";
import "./CrearMesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import { InputCrearMesa } from "../../../parts/inputs/InputCrearMesa";

export function CrearMesa() {
    const { socket, setEstadoPantalla } = useContext(GlobalContext);
    const [nombre, setNombre] = useState("");
    const [nombreMesa, setNombreMesa] = useState("");

    const handleCrear = (e) => {
        e.preventDefault();
        socket.emit("crear-mesa", nombre, nombreMesa);
        setEstadoPantalla("lobby");
    }

    return (
        <form onSubmit={handleCrear} className="form">
            <InputCrearMesa label={"Nombre Mesa"} setValue={setNombreMesa} />
            <InputCrearMesa label={"Nombre Creador"} setValue={setNombre} />
            <Buttons type={"submit"} label={"Crear Mesa"} />
        </form>
    )
}