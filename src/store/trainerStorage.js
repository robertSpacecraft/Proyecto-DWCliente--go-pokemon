const STORAGE_KEY = "pokedex:trainerName";

export function getTrainerName() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? value : "";
    } catch (err) {
        console.error("Error leyendo trainerName:", err);
        return "";
    }
}

export function setTrainerName(name) {
    try {
        localStorage.setItem(STORAGE_KEY, name);
    } catch (err) {
        console.error("Error guardando trainerName:", err);
    }
}
