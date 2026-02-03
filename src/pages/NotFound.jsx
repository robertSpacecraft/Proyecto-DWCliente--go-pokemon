// src/pages/NotFoundPage.jsx
import { Link, useLocation } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFoundPage() {
    const location = useLocation();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.text}>Lo que estás buscando no está por aquí...</p>

            <p className={styles.path}>
                Ruta: <code>{location.pathname}</code>
            </p>

            <p className={styles.text}>Si te has perdido puedes: </p>

            <div className={styles.actions}>
                <Link to="/" className={styles.primaryBtn}>
                    Ir al inicio
                </Link>

                <Link to="/pokedexPage" className={styles.secondaryBtn}>
                    Ir a la Pokédex
                </Link>
            </div>
        </div>
    );
}
