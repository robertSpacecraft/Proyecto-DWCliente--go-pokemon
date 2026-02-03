import { useCapturados } from "../hooks/useCapturados.js";
import styles from "./InsigniaEntrenador.module.css";

export default function InsigniaEntrenador({ nombre }) {

    //Obtengo la cantidad de capturas del contexto global
    const { cantidadCapturados } = useCapturados();

    if (!nombre) return null;

    return (
        <div
            className={styles.badge}
            aria-label={`Entrenador ${nombre}, Nivel ${cantidadCapturados}`}
        >
            <span className={styles.text}>
                Entrenador: <strong>{nombre}</strong>
            </span>

            <div className={styles.separator}></div>

            <div className={styles.levelBadge} title="Total Pokémon capturados">
                <span className={styles.star}>★</span>
                <span>{cantidadCapturados}</span>
            </div>
        </div>
    );
}
