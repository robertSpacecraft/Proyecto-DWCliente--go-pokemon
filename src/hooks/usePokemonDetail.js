import { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "../api/pokeApiClient.js";
import { mapPokemonDetail } from "../api/pokemonMapper.js";

export function usePokemonDetail(idOrName) {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(Boolean(idOrName)); //Definido así no cambia el estado rápidamente "parpadeo".
    const [error, setError] = useState(null);

    const requestIdRef = useRef(0); //Para identificar las peticiones.

    const fetchDetail = useCallback(async () => {
        if (!idOrName) {
            setPokemon(null);
            setLoading(false);
            setError(null);
            return;
        }

        requestIdRef.current = requestIdRef.current + 1;
        const currentRequestId = requestIdRef.current;
        setLoading(true);
        setError(null);

        try {
            const data = await connect(`pokemon/${idOrName}`);
            const mapped = mapPokemonDetail(data);

            if (currentRequestId !== requestIdRef.current) return;

            setPokemon(mapped);
        } catch (err) {
            if (currentRequestId !== requestIdRef.current) return;
            setError(err?.message ?? "Error desconocido al cargar el detalle");
            setPokemon(null);
        } finally {
            if (currentRequestId !== requestIdRef.current) return;
            setLoading(false);
        }
    }, [idOrName]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const reload = useCallback(() => {
        fetchDetail();
    }, [fetchDetail]);

    return { pokemon, loading, error, reload };
}
