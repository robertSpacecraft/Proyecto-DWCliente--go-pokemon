import { useContext } from "react";
import { ContextoCapturados } from "../context/CapturedContext.jsx";

export function useCapturados() {
    const datosContexto = useContext(ContextoCapturados);
    if (!datosContexto) {
        throw new Error("Este hook solo debe usarse dentro de un ProveedorCapturados");
    }
    return datosContexto;
}
