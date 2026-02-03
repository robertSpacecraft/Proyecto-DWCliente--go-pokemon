const STORAGE_KEY = "pokemonsCapturadosId";
const EVENT_NAME = "cambioEn:pokemonsCapturadosId";

//Obtiene los datos del localStorage
function getDatosLocalStorage() {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        const ids = guardado ? JSON.parse(guardado) : [];

        return Array.isArray(ids) ? ids.map((x) => Number(x)).filter(Number.isFinite) : [];
    } catch (err) {
        console.error(`Ha ocurrido un error al obtener los datos: ${err}`);
        return [];
    }
}

//Guarda los datos en el localStorage
function guardarEnLocalStorage(ids) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

        //Para que la UI tenga en cuenta el cambio lanzo un evento
        window.dispatchEvent(
            new CustomEvent(EVENT_NAME, { detail: { capturedIds: ids } })
        );
    } catch (err) {
        console.error(
            `Ha habido un error al guardar el registro en localStorage: ${err}`
        );
    }
}

//Resetea el LocalStorage con un nuevo usuario.
export function resetCapturados() {
    try {
        localStorage.removeItem("pokemonsCapturadosId");
        window.dispatchEvent(
            new CustomEvent("cambioEn:pokemonsCapturadosId", {
                detail: { capturedIds: [] }
            })
        );
    } catch (err) {
        console.error("Error reseteando capturados:", err);
    }
}


//Para escuchar el evento desde fuera
export function getCapturedEventName() {
    return EVENT_NAME;
}

//Devuelve todos los ids capturados
export function getCapturadosIds() {
    return getDatosLocalStorage();
}

//Comprueba si un id ya está capturado
export function estaCapturado(id) {
    const listaCapturados = getDatosLocalStorage();
    return listaCapturados.includes(Number(id));
}

//Añade un pokemon capturado
export function addCapturado(id) {
    const listaCapturados = getDatosLocalStorage();
    const set = new Set(listaCapturados);
    set.add(Number(id));
    guardarEnLocalStorage([...set]);
}

//Elimina un pokemon de la lista
export function liberarPokemon(id) {
    const listaCapturados = getDatosLocalStorage();
    const nuevaListaCapturados = listaCapturados.filter(
        (idCapturado) => idCapturado !== Number(id)
    );
    guardarEnLocalStorage(nuevaListaCapturados);
}

//Alterna el estado, si está lo quita y si no está lo añade
export function alterarCapturado(id) {
    if (estaCapturado(id)) {
        liberarPokemon(id);
        return false; // no está capturado
    } else {
        addCapturado(id);
        return true; // sí está capturado
    }
}

