import { createContext, useState, useEffect, useCallback } from "react";
import { getCapturadosIds, addCapturado, liberarPokemon } from "../store/capturedStorage.js";

//Creo el contexto
export const ContextoCapturados = createContext(null);

export const ProveedorCapturados = ({ children }) => {
    //Asegura que la lectura del LocalStorage se ejecute durante el montaje inicial de la app y no en cada renderizado.
    const [idsCapturados, setIdsCapturados] = useState(() => getCapturadosIds());

    //Si se modifica el localStorage desde otra pestaña o por algún proceso, el estado se actualiza automáticamente
    useEffect(() => {
        const manejarCambioStorage = (evento) => {
            const ids = evento?.detail?.capturedIds ?? [];
            setIdsCapturados(ids);
        };

        window.addEventListener("cambioEn:pokemonsCapturadosId", manejarCambioStorage);
        return () => window.removeEventListener("cambioEn:pokemonsCapturadosId", manejarCambioStorage);
    }, []);

    //Las funciones de envuelven en callbacks por optimización, de esta forma no se re-renderizan a menos que sea necesario
    const estaCapturado = useCallback(
        (id) => idsCapturados.includes(Number(id)), //Compruebo que los id sean numéricos
        [idsCapturados]
    );

    
    const capturar = useCallback(
        (id) => {
            const nId = Number(id);
            if (!estaCapturado(nId)) {
                addCapturado(nId);
                //Aprovecho el valor anterior para calcular el nuevo y uso set para evitar duplicados.
                setIdsCapturados((prev) => Array.from(new Set([...prev, nId]))); 
            }
        },
        [estaCapturado]
    );

    const liberar = useCallback(
        (id) => {
            const nId = Number(id);
            if (estaCapturado(nId)) {
                liberarPokemon(nId);
                setIdsCapturados((prev) => prev.filter((x) => x !== nId));
            }
        },
        [estaCapturado]
    );

    const alternar = useCallback(
        (id) => {
            const nId = Number(id);
            if (estaCapturado(nId)) {
                liberar(nId);
                return false;
            } else {
                capturar(nId);
                return true;
            }
        },
        [estaCapturado, liberar, capturar]
    );

    const datosContexto = {
        idsCapturados,
        cantidadCapturados: idsCapturados.length,
        estaCapturado,
        capturar,
        liberar,
        alternar,
    };

    return (
        <ContextoCapturados.Provider value={datosContexto}>
            {children}
        </ContextoCapturados.Provider>
    );
};


