import { getCardStyle } from './switchColor.js';
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
        return {
            ...response,
            color: speciesResponse.color,
        };
    }
    catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};
export const totalPokemons = 900;
let currentPage = 0;
const itemsPerPage = 20;
let filteredPokemonData = [];
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
        const pokeContainer = document.getElementById('pokeContainer');
        const prevBtns = document.querySelectorAll('#prevBtn');
        const nextBtns = document.querySelectorAll('#nextBtn');
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
        const pokeArticles = pokemonData
            .map((pokeInfo) => {
            const cardStyleClass = getCardStyle(pokeInfo.color.name);
            return `
            <article class="bg-white shadow-2xl rounded-md cursor-pointer hover:scale-105 transition-transform">
                <header class="flex justify-center flex-col">
                    <div class="flex justify-center">
                        <img class="w-36" src="${pokeInfo.sprites.front_default}" alt="${pokeInfo.name}" />
                    </div>
                    <div class="flex justify-center bg-bot-card rounded-b-md ${cardStyleClass}">
                        <p class="py-2 text-white custom-font">${pokeInfo.name}</p>
                    </div>
                </header>
            </article>
          `;
        })
            .join('');
        pokeContainer.innerHTML = pokeArticles;
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
            }, 250);
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
            }, 250);
        });
    }
}
const inicioBtn = document.getElementById('indexBtn');
inicioBtn.addEventListener('click', () => {
    currentPage = 0;
    showLoadingOverlay();
    renderPokemonPage().then(() => {
        setTimeout(() => {
            hideLoadingOverlay();
        }, 250);
    });
});
