import { useContext, useState } from "react";
import "./CrearMesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import { InputCrearMesa } from "../../../parts/inputs/InputCrearMesa";

export function CrearMesa() {
    const { crearMesa } = useContext(GlobalContext);
    const [nombre, setNombre] = useState("");
    const [nombreMesa, setNombreMesa] = useState("");

    const handleCrear = (e) => {
        e.preventDefault();
        crearMesa(nombre, nombreMesa);
        // setEstadoPantalla("lobby"); // No es necesario volver al lobby, el evento crear-mesa redirige a la mesa
    }

    return (
        <form onSubmit={handleCrear} className="form">
            <InputCrearMesa label={"Nombre Mesa"} setValue={setNombreMesa} />
            <InputCrearMesa label={"Nombre Creador"} setValue={setNombre} />
            <Buttons type={"submit"} label={"Crear Mesa"} />
        </form>
    )
}