import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CapturaInteractiva.module.css";

function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}

export default function CapturaInteractiva({
    pokemonNombre,
    speed = 50,
    intentosMax = 2,
    onSuccess,
    onFailFinal,
    onCancel,
}) {
    // NUEVO: posición del “contador” 0..100
    const [pos, setPos] = useState(0);
    const [dir, setDir] = useState(1); // 1 = sube, -1 = baja
    const [intentos, setIntentos] = useState(intentosMax);
    const [mensaje, setMensaje] = useState("");

    const rafRef = useRef(null);
    const runningRef = useRef(true);

    // NUEVO: calcula la zona objetivo según speed (más speed = zona más pequeña)
    const { start, end, anchoZona } = useMemo(() => {
        const ancho = clamp(8, 30 - speed / 5, 30); // 8%..30%
        // colocamos la zona en un punto “aleatorio” estable por render (una sola vez por montaje)
        const minStart = 5;
        const maxStart = 100 - ancho - 5;
        const randomStart = Math.floor(minStart + Math.random() * (maxStart - minStart));
        return { start: randomStart, end: randomStart + ancho, anchoZona: ancho };
    }, [speed]);

    // NUEVO: animación suave con requestAnimationFrame
    useEffect(() => {
        runningRef.current = true;

        const tick = () => {
            if (!runningRef.current) return;

            setPos((prev) => {
                let next = prev + dir * 1.2; // velocidad del cursor (ajustable)
                if (next >= 100) next = 100;
                if (next <= 0) next = 0;

                // si llega a extremos, invertimos dirección
                if (next === 100) setDir(-1);
                if (next === 0) setDir(1);

                return next;
            });

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [dir]);

    const lanzar = () => {
        // comprobación de acierto
        const acierto = pos >= start && pos <= end;

        if (acierto) {
            setMensaje(`¡Captura exitosa! (${Math.round(pos)}%)`);
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            onSuccess?.();
            return;
        }

        // fallo
        setIntentos((prev) => prev - 1);
        const restantes = intentos - 1;

        if (restantes <= 0) {
            setMensaje(`Fallaste la captura de ${pokemonNombre}.`);
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            onFailFinal?.();
        } else {
            setMensaje(`Fallaste (${Math.round(pos)}%). Te quedan ${restantes} intento(s).`);
        }
    };

    return (
        <div className={styles.wrapper} role="dialog" aria-label="Mecánica de captura">
            <h2 className={styles.title}>Capturar a {pokemonNombre}</h2>

            <p className={styles.info}>
                Dificultad: <strong>{Math.round(100 - anchoZona)}%</strong> · Intentos:{" "}
                <strong>{intentos}</strong>
            </p>

            <div className={styles.bar}>
                {/* Zona objetivo */}
                <div
                    className={styles.target}
                    style={{
                        left: `${start}%`,
                        width: `${end - start}%`,
                    }}
                    aria-hidden="true"
                />

                {/* Cursor */}
                <div
                    className={styles.cursor}
                    style={{ left: `${pos}%` }}
                    aria-hidden="true"
                />
            </div>

            {mensaje && <p className={styles.message}>{mensaje}</p>}

            <div className={styles.actions}>
                <button type="button" className={styles.primaryBtn} onClick={lanzar} disabled={intentos <= 0}>
                    ¡Lanzar Pokéball!
                </button>

                <button type="button" className={styles.secondaryBtn} onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}
