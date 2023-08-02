import { pokeApi, fetchPokemonData, PokemonSpeciesColor, filterAndRenderPokemons, hideLoadingOverlay, showLoadingOverlay, PokemonData } from './pokeFetch.js';
import { switchTypes } from './SwitchType.js';
const mySelectValues = document.querySelectorAll('#poke_filter') as NodeListOf<HTMLSelectElement>;


export const pokemonsFilter = async () => {
    // Obtener los resultados de la API
    const request = await pokeApi();
    const response = request.results;

    // Obtener los datos detallados de todos los Pokémon
    const allpokemons = await Promise.all(response.map(pokemon => fetchPokemonData(pokemon.url)));

    mySelectValues.forEach(mySelectValue => {
        mySelectValue.addEventListener('change', () => {
            showLoadingOverlay()
            let filterSelectValue = switchTypes(mySelectValue.value); //value del select del DOM
            //Filtramos todos los pokemones llamados de allpokemons que mapea fetchpokemonData con argumento de pokeApi url
            const filteredResults = allpokemons.filter(pokemon => {
                //Retornamos con some algun pokemon que tenga el valor del select comparado con type.name
                return pokemon.types.some(typeData => typeData.type.name === filterSelectValue); 
              });
            
            const filteredNames = filteredResults.map(pokemon => pokemon.name); //metodo map para juntar todos los nombres de los pokemones filtrados en un array 
            
            const pokemons_Filter_Type = response.filter(pokemon => filteredNames.includes(pokemon.name)); //filtramos y comparamos con includes si tiene el nombre del array anterior
            const total_Poke_Filters = pokemons_Filter_Type.length
            
            filterAndRenderPokemons(pokemons_Filter_Type,total_Poke_Filters).then(()=>{
                setTimeout(()=>{
                    hideLoadingOverlay()
                },400)
            })
        });
    });
   
};
