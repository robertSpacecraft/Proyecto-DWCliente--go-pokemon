import { Link } from "react-router-dom";
import { useCapturados } from "../hooks/useCapturados.js";
import styles from "./CapturedPage.module.css";

function getPokemonImageById(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function CapturedPage() {
    const { idsCapturados, cantidadCapturados, liberar } = useCapturados();

    //En estado "vacío"
    if (!idsCapturados || idsCapturados.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h1 className={styles.title}>Mis capturados</h1>
                <p className={styles.text}>Aún no has capturado ningún Pokémon.</p>
                <Link to="/pokedexPage" className={styles.backLink}>
                    ← Ir a la Pokédex
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis capturados</h1>
                    <p className={styles.subtitle}>
                        Total capturados: <strong>{cantidadCapturados}</strong>
                    </p>
                </div>

                <Link to="/pokedexPage" className={styles.backLink}>
                    ← Volver a la Pokédex
                </Link>
            </header>

            <div className={styles.grid}>
                {idsCapturados.map((id) => (
                    <div key={id} className={styles.card}>
                        <Link to={`/pokemon/${id}`} className={styles.cardLink}>
                            <img
                                src={getPokemonImageById(id)}
                                alt={`Pokémon ${id}`}
                                className={styles.cardImage}
                                loading="lazy"
                            />
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardName}>Pokémon #{id}</h3>
                                <p className={styles.cardHint}>Ver detalle --</p>
                            </div>
                        </Link>

                        <button
                            type="button"
                            className={styles.releaseBtn}
                            onClick={() => liberar(id)}
                            aria-label={`Liberar Pokémon ${id}`}
                        >
                            Liberar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
