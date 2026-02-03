import { useState } from "react"; // NUEVO: estado para mostrar/ocultar la captura interactiva
import { Link, useParams, useNavigate } from "react-router-dom";
import { usePokemonDetail } from "../hooks/usePokemonDetail.js";
import { useCapturados } from "../hooks/useCapturados.js";
import CapturaInteractiva from "../components/CapturaInteractiva.jsx"; // NUEVO: componente del minijuego
import styles from "./PokemonDetailPage.module.css";

export default function PokemonDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { pokemon, loading, error } = usePokemonDetail(id);
    const { estaCapturado, alternar } = useCapturados();

    const capturado = estaCapturado(id);

    const [mostrandoCaptura, setMostrandoCaptura] = useState(false); // NUEVO: controla el panel de captura

    //Loading
    if (loading) {
        return (
            <div className={styles.loadingState}>
                Cargando detalle...
            </div>
        );
    }

    //Error
    if (error) {
        return (
            <div className={styles.errorState}>
                <p>Error: {error}</p>
                <Link to="/pokedexPage" className={styles.backLink}>
                    ← Volver a la Pokédex
                </Link>
            </div>
        );
    }

    //Sin datos
    if (!pokemon) {
        return (
            <div className={styles.emptyState}>
                <p>No se ha encontrado el Pokémon.</p>
                <Link to="/pokedexPage" className={styles.backLink}>
                    ← Volver a la Pokédex
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Cabecera */}
            <header className={styles.header}>
                <Link to="/pokedexPage" className={styles.backLink}>
                    ← Ir a la pokédex
                </Link>

                <div className={styles.headerTitle}>
                    <h1 className={styles.name}>{pokemon.name}</h1>
                    <span className={styles.id}>#{pokemon.id}</span>
                </div>

                <button
                    type="button"
                    className={capturado ? styles.captureBtnOn : styles.captureBtnOff}
                    onClick={() => {
                        if (capturado) {
                            navigate("/capturados");
                        } else {
                            alert("Aún no tienes este Pokémon. ¡Captúralo abajo para añadirlo a tu lista!");
                        }
                    }}
                >
                    {capturado ? "Ver en Capturados" : "No capturado"}
                </button>
            </header>

            {/* Imagen + Tipos (siempre visible) */}
            <section className={styles.topSection}>
                <img
                    src={pokemon.image ?? ""}
                    alt={pokemon.name}
                    className={styles.image}
                />

                {pokemon.types && pokemon.types.length > 0 && (
                    <div className={styles.typesContainer}>
                        {pokemon.types.map((t) => (
                            <span key={t} className={styles.typeBadge}>
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </section>

            {/* Bloqueo por captura (pulido) */}
            {!capturado ? (
                <section className={styles.lockedSection}>
                    <div className={styles.lockedCard}>
                        <p className={styles.lockedTitle}>Información bloqueada</p>

                        <p className={styles.lockedText}>
                            Captura este Pokémon para registrar su ficha completa en tu Pokédex.
                        </p>

                        <ul className={styles.unlockList}>
                            <li>Stats (HP, ataque, defensa…)</li>
                            <li>Habilidades</li>
                            <li>Altura y peso</li>
                        </ul>

                        {/* NUEVO: el botón ya no captura directamente, abre el minijuego */}
                        {!mostrandoCaptura ? (
                            <button
                                type="button"
                                className={styles.lockedCaptureBtn}
                                onClick={() => setMostrandoCaptura(true)}
                            >
                                Iniciar captura
                            </button>
                        ) : (
                            <CapturaInteractiva
                                pokemonNombre={pokemon.name}
                                speed={pokemon.stats?.speed ?? 50}
                                intentosMax={2}
                                onSuccess={() => {
                                    alternar(pokemon.id);
                                    setMostrandoCaptura(false);
                                }}
                                onFailFinal={() => {
                                    setMostrandoCaptura(false);
                                }}
                                onCancel={() => setMostrandoCaptura(false)}
                            />
                        )}

                        <p className={styles.lockedHint}>
                            Consejo: puedes capturarlo y liberarlo cuando quieras.
                        </p>
                    </div>
                </section>
            ) : (
                <section className={styles.detailSection}>
                    {/* Datos generales */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Datos</h2>
                        <ul className={styles.list}>
                            <li>
                                <span className={styles.label}>Altura:</span>{" "}
                                <span>{pokemon.height ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Peso:</span>{" "}
                                <span>{pokemon.weight ?? "-"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Habilidades */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Habilidades</h2>
                        {pokemon.abilities && pokemon.abilities.length > 0 ? (
                            <ul className={styles.list}>
                                {pokemon.abilities.map((a) => (
                                    <li key={a}>{a}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.muted}>Sin habilidades disponibles.</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Stats</h2>
                        <ul className={styles.list}>
                            <li>
                                <span className={styles.label}>HP:</span>{" "}
                                <span>{pokemon.stats?.hp ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Ataque:</span>{" "}
                                <span>{pokemon.stats?.attack ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Defensa:</span>{" "}
                                <span>{pokemon.stats?.defense ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Ataque especial:</span>{" "}
                                <span>{pokemon.stats?.specialAttack ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Defensa especial:</span>{" "}
                                <span>{pokemon.stats?.specialDefense ?? "-"}</span>
                            </li>
                            <li>
                                <span className={styles.label}>Velocidad:</span>{" "}
                                <span>{pokemon.stats?.speed ?? "-"}</span>
                            </li>
                        </ul>
                    </div>
                </section>
            )}
        </div>
    );
}
