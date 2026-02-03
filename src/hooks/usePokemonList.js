// src/hooks/usePokemonList.js
import { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "../api/pokeApiClient.js";
import { mapPokemonListItem } from "../api/pokemonMapper.js";

const LIMITE_POR_PAGINA = 150;

export function usePokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false); //Cuando llega al final de scroll y debe cargar 20 más.

    const [error, setError] = useState(null);

    //Para definir la cantidad de Pokémons que debe saltarse en la petición dependiendo de las página que se hayan renderizado.
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchingRef = useRef(false); //Evita que scrollear continuemoente no genere peticiones constantes y cause problemas.

    useEffect(() => {

        //Soluciona el problema de pulsar mientra carga más páginnas.
        //Esta variable cancela la actualización si el componenete se canceló antes de recibir los datos.
        let isMounted = true;

        const fetchPage = async () => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;

            let isFirstPage;
            if (offset === 0) {
                isFirstPage = true;
            } else {
                isFirstPage = false;
            }

            if (isFirstPage) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            setError(null);

            try {
                const data = await connect(`pokemon?limit=${LIMITE_POR_PAGINA}&offset=${offset}`);
                const nuevos = (data.results ?? []).map(mapPokemonListItem);

                if (!isMounted) return;

                setPokemons((prev) => {
                    //En lugar de sumar los arrrays, uso el id como clave. De esta forma, si llegaran datos repetidos, el map sobreescribe el valor viejo con el nuevo.
                    //Garantizo que nunca habrán dos Pokémon con el mismo ID en la lista.
                    const map = new Map(prev.map((p) => [p.id, p]));
                    for (const p of nuevos) map.set(p.id, p);
                    return Array.from(map.values());
                });

                setHasMore(Boolean(data.next));
            } catch (err) {
                if (!isMounted) return;
                setError(err?.message ?? "Error al cargar pokémon");
            } finally {
                fetchingRef.current = false; // CAMBIO: liberamos el "candado" SIEMPRE para evitar bloqueos en StrictMode/cleanup.
                if (!isMounted) return;
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchPage();

        return () => {
            isMounted = false;
            fetchingRef.current = false; //Al estar en desarrollo el remontaje dejaba esto a true, si no estoy en strictMode puedo borrar la línea.
        };
    }, [offset]);

    //Cambia el offset, al detectarse el cambio, el useEffect llama a la API.
    const loadMore = useCallback(() => {
        if (!fetchingRef.current && hasMore) {
            setOffset((prev) => prev + LIMITE_POR_PAGINA);
        }
    }, [hasMore]);

    //Pone todo a 0, al poner el offset a 0, useEffect recargará la primera página.
    const reset = useCallback(() => {
        setPokemons([]);
        setOffset(0);
        setHasMore(true);
        setError(null);
        setLoading(true);
        setLoadingMore(false);
    }, []);

    return {
        pokemons,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        reset,
    };
}
