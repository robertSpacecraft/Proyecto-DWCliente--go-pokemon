import PokemonBase from "./PokemonBase.js";

//Modelo para la card de cada pokemon.
export default class PokemonListItem extends PokemonBase {
    constructor({ id, name, image, types } = {}) {
        super({ id, name, image });

        //Si los tipos (types) aun no están definidos el array puede estar vacío
        if (types !== undefined && !Array.isArray(types)) {
            throw new Error("Los tipos vienen en un array.");
        }

        this.types = (types ?? [])
            .filter((type) => typeof type === "string" && type.trim().length > 0)
            .map((type) => type.trim().toLowerCase());
    }

    //Devulve los todos los tipos en minúsculas.
    hasType(type) {
        if (!type) return false;
        return this.types.includes(String(type).toLowerCase());
    }

    //Para depurar y ver que llega
    toPlainObject() {
        return {
            ...super.toPlainObject(),
            types: [...this.types],
        };
    }
}
