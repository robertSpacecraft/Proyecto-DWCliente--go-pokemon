import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePokemonList } from "../hooks/usePokemonList.js";
import { connect } from "../api/pokeApiClient.js";
import styles from "./PokedexPage.module.css";

import Header from "../components/Header.jsx";
import { getTrainerName } from "../store/trainerStorage.js";

export default function PokedexPage() {
    const { pokemons, loading, loadingMore, error, hasMore, loadMore } =
        usePokemonList();

    //Término de búsqueda
    const [terminoBusqueda, setTerminoBusqueda] = useState("");

    //Con la lista ya filtrado se hace la ordenación del listado de forma ascendente.
    const [ordenSeleccionado, setOrdenSeleccionado] = useState("id-asc");

    //Para el filtro por tipo
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [nombresPermitidosPorTipo, setNombresPermitidosPorTipo] = useState(null);
    const [cargandoTipos, setCargandoTipos] = useState(false);
    const [errorTipos, setErrorTipos] = useState(null);

    //Carga la lista de tipos una sola vez
    useEffect(() => {
        let activo = true;

        const cargarTipos = async () => {
            setCargandoTipos(true);
            setErrorTipos(null);

            try {
                const data = await connect("type");
                const lista = (data.results ?? [])
                    .map((t) => t.name)
                    .filter((name) => name !== "unknown" && name !== "shadow");

                if (!activo) return;
                setTiposDisponibles(lista);
            } catch (err) {
                if (!activo) return;
                setErrorTipos(err?.message ?? "Error al cargar tipos");
            } finally {
                if (!activo) return;
                setCargandoTipos(false);
            }
        };

        cargarTipos();

        return () => {
            activo = false;
        };
    }, []);

    //Se obtiene la lista del tipo y se ordena por nombre
    useEffect(() => {
        let activo = true;

        const cargarNombresPorTipo = async () => {

            //Sin tipo seleccionado quito el filtro
            if (!tipoSeleccionado) {
                setNombresPermitidosPorTipo(null);
                return;
            }

            setCargandoTipos(true);
            setErrorTipos(null);

            try {
                const data = await connect(`type/${tipoSeleccionado}`);
                const setNombres = new Set(
                    (data.pokemon ?? []).map((p) => p.pokemon.name)
                );

                if (!activo) return;
                setNombresPermitidosPorTipo(setNombres);
            } catch (err) {
                if (!activo) return;
                setErrorTipos(err?.message ?? "Error al cargar pokémons por tipo");
                setNombresPermitidosPorTipo(null);
            } finally {
                if (!activo) return;
                setCargandoTipos(false);
            }
        };

        cargarNombresPorTipo();

        return () => {
            activo = false;
        };
    }, [tipoSeleccionado]);

    //Lista filtrada según búsqueda y tipo
    const pokemonsFiltrados = pokemons
        .filter((p) => p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()))
        .filter((p) => (nombresPermitidosPorTipo ? nombresPermitidosPorTipo.has(p.name) : true));

    //Ordeanación
    const pokemonsOrdenados = [...pokemonsFiltrados].sort((a, b) => {
        switch (ordenSeleccionado) {
            case "id-asc":
                return a.id - b.id;
            case "id-desc":
                return b.id - a.id;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    //Loading inicial
    if (loading) {
        return (
            <div className={styles.loadingState}>
                Cargando Pokédex...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                Error: {error}
            </div>
        );
    }

    //Estado vacío, si la api no devuelve nada.
    if (!pokemons || pokemons.length === 0) {
        return (
            <div className={styles.emptyState}>
                No hay Pokémon para mostrar.
            </div>
        );
    }

    const nombreEntrenador = getTrainerName();

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar Pokémon por nombre..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filterRow}>
                <label className={styles.filterLabel}>
                    Tipo:
                    <select
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value)}
                        className={styles.typeSelect}
                        disabled={cargandoTipos && tiposDisponibles.length === 0}
                    >
                        <option value="">Todos</option>
                        {tiposDisponibles.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.filterLabel}>
                    Orden:
                    <select
                        value={ordenSeleccionado}
                        onChange={(e) => setOrdenSeleccionado(e.target.value)}
                        className={styles.typeSelect}
                    >
                        <option value="id-asc">ID (asc)</option>
                        <option value="id-desc">ID (desc)</option>
                        <option value="name-asc">Nombre (A-Z)</option>
                        <option value="name-desc">Nombre (Z-A)</option>
                    </select>
                </label>

                {cargandoTipos && (
                    <span className={styles.filterHint}>Cargando tipos...</span>
                )}

                {errorTipos && (
                    <span className={styles.filterError}>Error: {errorTipos}</span>
                )}
            </div>

            {(terminoBusqueda || tipoSeleccionado) && pokemonsOrdenados.length === 0 && (
                <p className={styles.noResults}>
                    No se han encontrado Pokémon con los filtros actuales.
                </p>
            )}

            <div className={styles.grid}>
                {pokemonsOrdenados.map((pokemon) => (
                    <Link
                        key={pokemon.id}
                        to={`/pokemon/${pokemon.id}`}
                        className={styles.card}
                        aria-label={`Ver detalle de ${pokemon.name}`}
                    >
                        <img
                            src={pokemon.image ?? ""}
                            alt={pokemon.name}
                            className={styles.cardImage}
                            loading="lazy"
                        />

                        <div className={styles.cardBody}>
                            <h3 className={styles.cardName}>{pokemon.name}</h3>
                            <span className={styles.cardId}>#{pokemon.id}</span>

                            {pokemon.types && pokemon.types.length > 0 && (
                                <div className={styles.typesContainer}>
                                    {pokemon.types.map((t) => (
                                        <span key={t} className={styles.typeBadge}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div className={styles.loadMoreContainer}>
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className={styles.loadMoreBtn}
                    >
                        {loadingMore ? "Cargando..." : "Cargar más Pokémon"}
                    </button>
                </div>
            )}
        </div>
    );
}
