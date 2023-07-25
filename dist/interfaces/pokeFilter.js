import { pokeApi } from "./pokeFetch.js";
export async function getAllPokemons() {
    try {
        const response = await pokeApi();
        const allPokemons = response.results;
        console.log(allPokemons);
    }
    catch (error) {
        console.error('Error al encontrar los pokemones');
    }
}
