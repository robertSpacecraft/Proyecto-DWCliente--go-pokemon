import PokemonListItem from "./PokemonListItem.js";

//El modelo con todos los detalles, para la pantalla de "detalle"
export default class PokemonDetail extends PokemonListItem {
    constructor({
        id,
        name,
        image,
        types,
        height,
        weight,
        abilities,
        stats,
    } = {}) {
        super({ id, name, image, types });

        //Me aseguro que la altura y el peso son números
        if (height !== undefined && (typeof height !== "number" || Number.isNaN(height))) {
            throw new Error("La altura debe ser un número.");
        }
        if (weight !== undefined && (typeof weight !== "number" || Number.isNaN(weight))) {
            throw new Error("El peso debe ser un número.");
        }

        //La habilidades deben ser un array
        if (abilities !== undefined && !Array.isArray(abilities)) {
            throw new Error("Las habilidades vienen en un array.");
        }

        //Las stats son un objeto no un array
        if (stats !== undefined && (typeof stats !== "object" || stats === null || Array.isArray(stats))) {
            throw new Error("Las stats son un objeto, no un array.");
        }

        //Permito que puedena ser null
        this.height = height ?? null;
        this.weight = weight ?? null;

        this.abilities = (abilities ?? [])
            .filter((a) => typeof a === "string" && a.trim().length > 0)
            .map((a) => a.trim().toLowerCase());

        this.stats = stats ?? {
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
        };
    }

    //Para pruebas y depuración
    toPlainObject() {
        return {
            ...super.toPlainObject(),
            height: this.height,
            weight: this.weight,
            abilities: [...this.abilities],
            stats: { ...this.stats },
        };
    }
}
