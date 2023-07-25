import { pokeApi, fetchPokemonData, Pokemon, filterAndRenderPokemons, hideLoadingOverlay, showLoadingOverlay } from "./pokeFetch.js";

export async function getAllPokemons() {
  try {
    const response = await pokeApi();
    const allPokemons = response.results;
    return allPokemons;
  } catch (error) {
    console.error('Error al encontrar los pokemones');
  }
}

getAllPokemons().then((AllPokemons) => {
  if (AllPokemons) {
    const pokeSearchBtn = document.querySelectorAll('#btnSearch') as NodeListOf<HTMLButtonElement>;
    let inputSearchs = document.querySelectorAll('#inputSearch') as NodeListOf<HTMLInputElement> ;

    pokeSearchBtn.forEach((searchBtn, index) => {
      searchBtn.addEventListener('click', () => {
        const foundPokemon = AllPokemons.filter(pokemon => pokemon.name.startsWith(inputSearchs[index].value.toLowerCase()));
        const totalPokemons = foundPokemon.length;
        showLoadingOverlay()
        fetchFilteredPokemonData(foundPokemon, totalPokemons).then(()=>{
            setTimeout(() => {
                hideLoadingOverlay()
            }, 400);
        })
      });
    });

  } else {
    console.error('No se pudo obtener la lista de Pokémon.');
  }
});

async function fetchFilteredPokemonData(filteredPokemons: Pokemon[], totalPokemons: number) {
    try {
      const pokemonData = await Promise.all(
        filteredPokemons.map(async (pokemon) => {
          const data = await fetchPokemonData(pokemon.url);
          return { url: pokemon.url, name: data.name };
        })
      );
  
      filterAndRenderPokemons(pokemonData, totalPokemons);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  }
