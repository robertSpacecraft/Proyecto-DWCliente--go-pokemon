import { useCapturados } from "../hooks/useCapturados.js"; // CAMBIO: usar el hook correcto
import styles from "./InsigniaEntrenador.module.css";

export default function InsigniaEntrenador({ nombre }) {
    // Leemos la cantidad de capturas del contexto global
    const { cantidadCapturados } = useCapturados(); // CAMBIO: nombre del hook

    if (!nombre) return null;

    return (
        <div
            className={styles.badge}
            aria-label={`Entrenador ${nombre}, Nivel ${cantidadCapturados}`}
        >
            {/* Texto nombre */}
            <span className={styles.text}>
                Entrenador: <strong>{nombre}</strong>
            </span>

            {/* Separador visual */}
            <div className={styles.separator}></div>

            {/* Contador de capturas (Estilo "Nivel") */}
            <div className={styles.levelBadge} title="Total Pokémon capturados">
                <span className={styles.star}>★</span>
                <span>{cantidadCapturados}</span>
            </div>
        </div>
    );
}
