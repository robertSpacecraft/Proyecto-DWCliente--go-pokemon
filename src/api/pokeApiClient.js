
const URL_POKE_API = "https://pokeapi.co/api/v2/";

export async function connect(endpoint) {
    //Como me ha pasado ya lo de que busque con barra o sin ella, con esto me ahorro lios.
    const urlCompleta = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    try {
        const response = await fetch(`${URL_POKE_API}${urlCompleta}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        throw new Error(`Fallo de conexión: ${err.message}`);
    }
}