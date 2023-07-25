import { pokeApi, fetchPokemonData, filterAndRenderPokemons, currentPage, itemsPerPage } from "./pokeFetch.js";
export async function getAllPokemons() {
    try {
        const response = await pokeApi();
        const allPokemons = response.results;
        return allPokemons;
    }
    catch (error) {
        console.error('Error al encontrar los pokemones');
    }
}
getAllPokemons().then((AllPokemons) => {
    if (AllPokemons) {
        const pokeSearchBtn = document.querySelectorAll('#btnSearch');
        const inputSearchs = document.querySelectorAll('#inputSearch');
        pokeSearchBtn.forEach((searchBtn, index) => {
            searchBtn.addEventListener('click', () => {
                const foundPokemon = AllPokemons.filter(pokemon => pokemon.name.startsWith(inputSearchs[index].value.toLowerCase()));
                const totalPokemons = foundPokemon.length;
                fetchFilteredPokemonData(foundPokemon, totalPokemons);
            });
        });
    }
    else {
        console.error('No se pudo obtener la lista de Pokémon.');
    }
});
async function fetchFilteredPokemonData(filteredPokemons, totalPokemons) {
    try {
        const pokemonData = await Promise.all(filteredPokemons.map((pokemon) => fetchPokemonData(pokemon.url)));
        filterAndRenderPokemons(pokemonData, currentPage, itemsPerPage, totalPokemons);
    }
    catch (error) {
        console.error('Error fetching Pokemon data:', error);
    }
}
