import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTrainerName, setTrainerName } from "../store/trainerStorage.js";
import styles from "./LandingPage.module.css";

function validarNombreEntrenador(valor) {
    const name = valor.trim();

    if (!name) return "El nombre es obligatorio.";
    if (name.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (name.length > 20) return "El nombre no puede superar 20 caracteres.";

    // Solo letras (incluye acentos), números, espacios y guiones
    const regex = /^[\p{L}0-9 -]+$/u;
    if (!regex.test(name)) return "Solo se permiten letras, números, espacios y guiones.";

    return null;
}

export default function LandingPage() {
    const navigate = useNavigate();

    const [trainerName, setTrainerNameState] = useState("");
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState(null);

    // Carga inicial desde localStorage (si ya existe, pre-rellena)
    useEffect(() => {
        const guardado = getTrainerName();
        if (guardado) {
            setTrainerNameState(guardado);
            setTouched(true);
            setError(null);
        }
    }, []);

    // Validación derivada (manual)
    const errorActual = useMemo(() => {
        if (!touched) return null;
        return validarNombreEntrenador(trainerName);
    }, [trainerName, touched]);

    // Sincroniza el error visible
    useEffect(() => {
        setError(errorActual);
    }, [errorActual]);

    const onSubmit = (e) => {
        e.preventDefault();
        setTouched(true);

        const msg = validarNombreEntrenador(trainerName);
        if (msg) {
            setError(msg);
            return;
        }

        const limpio = trainerName.trim();
        setTrainerName(limpio);
        navigate("/pokedexPage");
    };

    return (
        <div className={styles.container}>
            <img src="/pokemonLogo.png" alt="Pokémon" className={styles.logo} />

            <p className={styles.subtitle}>
                Bienvenido a la Pokédex. Escribe tu nombre de entrenador para empezar.
            </p>
            <video
                className={styles.video}
                src="/PokemonLanding.mp4"
                autoPlay
                muted
                loop
                playsInline
            />

            <form className={styles.form} onSubmit={onSubmit}>
                <label className={styles.label}>
                    Nombre de entrenador
                    <input
                        type="text"
                        value={trainerName}
                        onChange={(e) => setTrainerNameState(e.target.value)}
                        onBlur={() => setTouched(true)}
                        className={styles.input}
                        placeholder="Ej.: Ash"
                    />
                </label>

                {error && <p className={styles.formError}>{error}</p>}

                <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={Boolean(errorActual)}
                >
                    Hazte con todos
                </button>

                {/* Enlace secundario opcional si ya hay nombre guardado */}
                {getTrainerName() && (
                    <Link to="/pokedexPage" className={styles.secondaryLink}>
                        Entrar directamente
                    </Link>
                )}
            </form>
        </div>
    );
}
