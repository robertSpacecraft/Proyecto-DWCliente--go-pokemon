//Clase base "abstracta" para modelos de Pokémon.

export default class PokemonBase {
    constructor({ id, name, image } = {}) {
        if (new.target === PokemonBase) {
            throw new Error("Error: la clase PokemonBase es abstracta, no puede ser instaciada");
        }

        //Valido que al menos tenga un id y un nombre
        if (id === undefined || id === null) {
            throw new Error("El id es obligatorio.");
        }
        if (!name || typeof name !== "string") {
            throw new Error("El nombre es obligatorio y debe ser de tipo string.");
        }

        this.id = id;
        this.name = name.trim();
        this.image = image ?? null; //Si no hay imagen la dejo como null en la instancia.
    }

    //Obtiene el nombre en minúsculas.
    get nameKey() {
        return this.name.toLowerCase();
    }

    //Para depuración/serialización simple
    toPlainObject() {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
        };
    }
}
