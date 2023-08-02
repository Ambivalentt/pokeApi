import { getCardStyle } from './switchColor.js';
window.addEventListener('load', () => {
    showLoadingOverlay();
    renderPokemonPage().then(() => {
        setTimeout(() => {
            ContainerButtons.forEach(buttons => {
                buttons.classList.replace('hidden', 'flex');
            });
            hideLoadingOverlay();
        }, 300);
    });
});
;
export const pokeApi = async () => {
    try {
        const request = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${totalPokemons}`);
        const response = await request.json();
        const data = response;
        return data;
    }
    catch (err) {
        console.log('Error calling API:', err);
        throw err;
    }
};
export const fetchPokemonData = async (url) => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        const speciesRequest = await fetch(response.species.url);
        const speciesResponse = await speciesRequest.json();
        const typePokemons = response.types.map((typeData) => typeData.type);
        const abilitiesRequests = response.abilities.map(abilityData => fetch(abilityData.ability.url));
        const abilitiesResponses = await Promise.all(abilitiesRequests);
        const abilitiesDetails = await Promise.all(abilitiesResponses.map((res) => res.json()));
        return { ...response, ...speciesResponse, ...typePokemons, ...abilitiesDetails };
    }
    catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};
const pokeInfoContainer = document.getElementById('pokeInfoScreen');
const ContainerButtons = document.querySelectorAll('#containerButtons');
export const prevBtns = document.querySelectorAll('#prevBtn');
export const nextBtns = document.querySelectorAll('#nextBtn');
export const not_found_404 = document.getElementById('notFound');
const pokeContainer = document.getElementById('pokeContainer');
const pokeDetailsContainer = document.getElementById('pokemonDetails');
export let totalPokemons = 20;
let currentPage = 0;
const itemsPerPage = 20;
let filteredPokemonData = [];
setInterval(() => {
    if (totalPokemons < 500) {
        totalPokemons += 50;
    }
}, 2000);
export async function renderPokemonPage() {
    try {
        let response;
        if (filteredPokemonData.length === 0) {
            response = await pokeApi();
        }
        else {
            response = {
                results: filteredPokemonData,
                count: filteredPokemonData.length,
            };
        }
        const totalPokemons = response.count;
        prevBtns.forEach((prevBtn) => {
            prevBtn.disabled = currentPage === 0;
            prevBtn.addEventListener('click', prevPage);
        });
        nextBtns.forEach((nextBtn) => {
            nextBtn.disabled = currentPage >= Math.ceil(totalPokemons / itemsPerPage) - 1;
            nextBtn.addEventListener('click', nextPage);
        });
        pokeContainer.innerHTML = '';
        const startIdx = currentPage * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const pokemonsToRender = response.results.slice(startIdx, endIdx);
        const pokemonData = await Promise.all(pokemonsToRender.map((pokemon) => fetchPokemonData(pokemon.url)));
        const pokeArticles = pokemonData.map((pokeInfo) => {
            const cardStyleClass = getCardStyle(pokeInfo.color.name);
            return `
            <article id="pokemonCard" data-pokemon-id="${pokeInfo.id}" class="bg-white shadow-lg shadow-black rounded-md cursor-pointer hover:scale-105 transition-transform">
                <header class="flex justify-center flex-col">
                    <div class="flex justify-center">
                        <img class="w-36 select-none" src="${pokeInfo.sprites.front_default}" alt="${pokeInfo.name}" />
                    </div>
                    <div class="flex justify-center bg-bot-card rounded-b-md ${cardStyleClass}">
                        <p class="py-2 text-white custom-font text-xl">${pokeInfo.name}</p>
                    </div>
                </header>
            </article>
          `;
        })
            .join('');
        pokeContainer.innerHTML = pokeArticles;
        const pokemonCards = document.querySelectorAll('#pokemonCard');
        pokemonCards.forEach(pokemonCard => {
            const pokemonId = pokemonCard.getAttribute('data-pokemon-id');
            pokemonCard.addEventListener('click', async () => {
                const selectedPokemon = pokemonData.find((pokemon) => pokemon.id.toString() === pokemonId);
                if (selectedPokemon) {
                    const abilitiesUrls = selectedPokemon.abilities.map(ability => ability.ability.url);
                    const pokeAbilitiesFetch = await Promise.all(abilitiesUrls.map(url => fetch(url)));
                    const pokeAbilitiesData = await Promise.all(pokeAbilitiesFetch.map(response => response.json()));
                    const abilityDetails = pokeAbilitiesData.map((ability) => {
                        const nameEsp = ability.names.find((nameAbi) => nameAbi.language.name === "es");
                        const abilityDetails = ability.flavor_text_entries.find((skillDetails) => skillDetails.language.name === "es");
                        return { name: nameEsp.name, detail: abilityDetails.flavor_text };
                    });
                    const habilidad = abilityDetails.length > 1 ? 'Habilidades' : 'Habilidad';
                    document.getElementById("pokemonName").textContent = selectedPokemon.name;
                    const pokemonInfo = `
                    <article>
                        <figure class="flex justify-center items-center">
                            <img class=" w-60  select-none" src="${selectedPokemon.sprites.front_default}" alt="${selectedPokemon.name}" />
                        </figure>
                        <section class="px-4 pb-5 bg-red-600 rounded-b-lg shadow-xl text-white bg-opacity-90">
                         <h3 class="font-semibold text-xl text-center">${habilidad}:</h3>
                              ${abilityDetails.map(ability => `
                                   <section class="block md:flex justify-center items-center gap-x-1">
                                   <h4 class="font-medium text-lg">${ability.name}:</h4>
                                   <p class=" font-light">${ability.detail}</p>
                                   </section>
                                 `).join('\n')}
                        </section>
                    </article>
                    `;
                    pokeDetailsContainer.innerHTML = pokemonInfo;
                    pokeInfoContainer.classList.replace('hidden', 'flex');
                }
                else {
                    console.log('Err pokemon no encontrado para brindar informacion');
                }
            });
        });
        const currentPageSpan = document.querySelectorAll('#currentPage');
        if (currentPageSpan) {
            currentPageSpan.forEach((pages) => {
                pages.textContent = (currentPage + 1).toString();
            });
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
export async function filterAndRenderPokemons(filteredPokemons, totalPokemons) {
    filteredPokemonData = filteredPokemons;
    currentPage = 0;
    renderPokemonPage();
}
const loadingOverlay = document.getElementById('loadingOverlay');
export function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}
export function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}
export function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showLoadingOverlay();
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay();
            }, 400);
        });
    }
}
export function nextPage() {
    const totalPages = Math.ceil(totalPokemons / itemsPerPage);
    if (currentPage + 1 < totalPages) {
        currentPage++;
        showLoadingOverlay();
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay();
            }, 400);
        });
    }
}
export const inicioBtn = document.getElementById('indexBtn');
const backHomeBtn = document.getElementById('homeBtn');
inicioBtn.addEventListener('click', () => {
    currentPage = 0;
    filteredPokemonData = [];
    showLoadingOverlay();
    renderPokemonPage().then(() => {
        pokeContainer.classList.replace('hidden', 'grid');
        not_found_404.classList.replace('flex', 'hidden');
        ContainerButtons.forEach(containerBtn => {
            containerBtn.classList.replace('hidden', 'flex');
        });
        setTimeout(() => {
            hideLoadingOverlay();
        }, 250);
    });
});
backHomeBtn.addEventListener('click', () => {
    currentPage = 0;
    filteredPokemonData = [];
    showLoadingOverlay();
    renderPokemonPage().then(() => {
        pokeContainer.classList.replace('hidden', 'grid');
        not_found_404.classList.replace('flex', 'hidden');
        ContainerButtons.forEach(containerBtn => {
            containerBtn.classList.replace('hidden', 'flex');
        });
        setTimeout(() => {
            hideLoadingOverlay();
        }, 250);
    });
});
const btnClose = document.getElementById('closeInfoBtn');
btnClose.addEventListener('click', () => {
    pokeInfoContainer.classList.replace('flex', 'hidden');
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        pokeInfoContainer.classList.replace('flex', 'hidden');
    }
});
