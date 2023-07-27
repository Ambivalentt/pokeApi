import { pokeApi, fetchPokemonData, filterAndRenderPokemons, hideLoadingOverlay, showLoadingOverlay } from "./pokeFetch.js";
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
let pokemonNotFound = false;
getAllPokemons().then((AllPokemons) => {
    if (AllPokemons) {
        const pokeSearchBtn = document.querySelectorAll('#btnSearch');
        const inputSearchs = document.querySelectorAll('#inputSearch');
        const performSearch = async (index) => {
            const inputValue = inputSearchs[index].value.toLowerCase();
            const foundPokemon = AllPokemons.filter(pokemon => pokemon.name.startsWith(inputValue));
            let totalPokemons = foundPokemon.length;
            if (totalPokemons > 0) {
                showLoadingOverlay();
                pokemonNotFound = false;
                console.log(pokemonNotFound);
                fetchFilteredPokemonData(foundPokemon, totalPokemons).then(() => {
                    setTimeout(() => {
                        hideLoadingOverlay();
                    }, 400);
                });
            }
            else {
                pokemonNotFound = true;
                console.log(pokemonNotFound);
            }
            notFound404();
        };
        pokeSearchBtn.forEach((searchBtn, index) => {
            searchBtn.addEventListener('click', () => {
                const inputValue = inputSearchs[index].value.trim();
                if (inputValue === '') {
                    inputSearchs[index].setCustomValidity('El campo no puede estar vacío o contener solo espacios.');
                    inputSearchs[index].value = '';
                }
                else {
                    inputSearchs[index].setCustomValidity('');
                    hiddenMobileContent();
                    performSearch(index);
                    inputSearchs[index].value = '';
                }
            });
        });
        inputSearchs.forEach((input, index) => {
            input.addEventListener('keydown', (event) => {
                const inputValue = input.value.trim();
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (inputValue === '') {
                        inputSearchs[index].setCustomValidity('El campo no puede estar vacío o contener solo espacios');
                        inputSearchs[index].value = '';
                    }
                    else {
                        hiddenMobileContent();
                        inputSearchs[index].setCustomValidity('');
                        performSearch(index);
                        inputSearchs[index].value = '';
                    }
                    notFound404();
                }
            });
        });
    }
    else {
        console.error('No se pudo obtener la lista de Pokémon.');
    }
});
async function fetchFilteredPokemonData(filteredPokemons, totalPokemons) {
    try {
        const pokemonData = await Promise.all(filteredPokemons.map(async (pokemon) => {
            const data = await fetchPokemonData(pokemon.url);
            return { url: pokemon.url, name: data.name };
        }));
        filterAndRenderPokemons(pokemonData, totalPokemons);
    }
    catch (error) {
        console.error('Error fetching Pokemon data:', error);
    }
}
export const pokeContainer = document.getElementById('pokeContainer');
const not_found_404 = document.getElementById('notFound');
const ContainerButtons = document.querySelectorAll('#containerButtons');
function notFound404() {
    if (pokemonNotFound == true) {
        pokeContainer.classList.replace('grid', 'hidden');
        not_found_404.classList.replace('hidden', 'flex');
        ContainerButtons.forEach(containerBtn => {
            containerBtn.classList.replace('flex', 'hidden');
        });
    }
    else {
        not_found_404.classList.replace('flex', 'hidden');
        pokeContainer.classList.replace('hidden', 'grid');
        ContainerButtons.forEach(containerBtn => {
            containerBtn.classList.replace('hidden', 'flex');
        });
    }
}
const menuMobileContent = document.getElementById('menuMobilContent');
function hiddenMobileContent() {
    menuMobileContent.classList.toggle('invisible');
    menuMobileContent.classList.toggle('h-28');
    menuMobileContent.classList.toggle('opacity-100');
}
