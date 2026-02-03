import { Link } from "react-router-dom";
import InsigniaEntrenador from "./InsigniaEntrenador.jsx";
import { getTrainerName } from "../store/trainerStorage.js";
import styles from "./Header.module.css";

export default function Header() {

    //Leo el nombre del entrenador desde localStorage
    const nombreEntrenador = getTrainerName();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                

                <Link to="/" className={styles.logoLink} aria-label="Ir al inicio">
                    <img 
                        src="public/pokédex_logo.png" 
                        alt="Pokédex Logo" 
                        className={styles.logoImage} 
                    />
                </Link>

                <nav className={styles.nav}>
                    <Link to="/capturados" className={styles.linkCapturados}>
                        Ver mis capturados →
                    </Link>
                </nav>

                <InsigniaEntrenador nombre={nombreEntrenador} />
            </header>
        </div>
    );
}