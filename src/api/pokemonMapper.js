import PokemonListItem from "../model/PokemonListItem.js";
import PokemonDetail from "../model/PokemonDetail.js";

//Obtengo el id de la url
function extraerIdDesdeUrl(url) {
    const partes = url.split("/").filter(Boolean);
    return Number(partes[partes.length - 1]);
}

//Obtengo la imagen oficial del pokemon con us id.
function obtenerImagenPokemon(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

//Mapea un Pokémon del listado (respuesta de /pokemon)
export function mapPokemonListItem(apiItem) {
    const id = extraerIdDesdeUrl(apiItem.url);

    return new PokemonListItem({
        id,
        name: apiItem.name,
        image: obtenerImagenPokemon(id),
        types: [] //se rellenarán más adelante si hace falta
    });
}

//Mapea el detalle completo de un Pokémon (respuesta de /pokemon/{id})
export function mapPokemonDetail(apiData) {
    return new PokemonDetail({
        id: apiData.id,
        name: apiData.name,
        image:
            apiData.sprites?.other?.official_artwork?.front_default ??
            apiData.sprites?.front_default ??
            null,

        types: apiData.types.map(t => t.type.name),

        height: apiData.height,
        weight: apiData.weight,

        abilities: apiData.abilities.map(a => a.ability.name),

        stats: {
            hp: apiData.stats.find(s => s.stat.name === "hp")?.base_stat ?? null,
            attack: apiData.stats.find(s => s.stat.name === "attack")?.base_stat ?? null,
            defense: apiData.stats.find(s => s.stat.name === "defense")?.base_stat ?? null,
            specialAttack: apiData.stats.find(s => s.stat.name === "special-attack")?.base_stat ?? null,
            specialDefense: apiData.stats.find(s => s.stat.name === "special-defense")?.base_stat ?? null,
            speed: apiData.stats.find(s => s.stat.name === "speed")?.base_stat ?? null,
        }
    });
}
