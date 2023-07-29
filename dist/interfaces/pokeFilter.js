import { pokeApi, fetchPokemonData, filterAndRenderPokemons, hideLoadingOverlay, showLoadingOverlay } from './pokeFetch.js';
import { switchTypes } from './SwitchType.js';
const mySelectValues = document.querySelectorAll('#poke_filter');
export const pokemonsFilter = async () => {
    const request = await pokeApi();
    const response = request.results;
    const allpokemons = await Promise.all(response.map(pokemon => fetchPokemonData(pokemon.url)));
    mySelectValues.forEach(mySelectValue => {
        mySelectValue.addEventListener('change', () => {
            showLoadingOverlay();
            let filterSelectValue = switchTypes(mySelectValue.value);
            const filteredResults = allpokemons.filter(pokemon => {
                return pokemon.types.some(typeData => typeData.type.name === filterSelectValue);
            });
            const filteredNames = filteredResults.map(pokemon => pokemon.name);
            const pokemons_Filter_Type = response.filter(pokemon => filteredNames.includes(pokemon.name));
            const total_Poke_Filters = pokemons_Filter_Type.length;
            filterAndRenderPokemons(pokemons_Filter_Type, total_Poke_Filters).then(() => {
                setTimeout(() => {
                    hideLoadingOverlay();
                }, 400);
            });
        });
    });
};
