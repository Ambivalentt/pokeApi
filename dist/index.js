"use strict";
const pokeApi = async () => {
    try {
        const request = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300');
        const response = await request.json();
        const data = response;
        return data;
    }
    catch (err) {
        console.log('Error calling API:', err);
        throw err;
    }
};
const fetchPokemonData = async (url) => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        return response;
    }
    catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};
let currentPage = 0;
const itemsPerPage = 50;
const totalPokemons = 300;
const loadingOverlay = document.getElementById('loadingOverlay');
function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}
function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showLoadingOverlay();
        renderPokemonPage(currentPage).then(() => {
            setTimeout(() => {
                hideLoadingOverlay();
            }, 250);
            ;
        });
    }
    renderPokemonPage(currentPage);
}
function nextPage() {
    const totalPages = Math.ceil(totalPokemons / itemsPerPage);
    if (currentPage + 1 < totalPages) {
        currentPage++;
        showLoadingOverlay();
        renderPokemonPage(currentPage).then(() => {
            setTimeout(() => {
                hideLoadingOverlay();
            }, 250);
            ;
        });
    }
    renderPokemonPage(currentPage);
    const prevBtn = document.getElementById('prevBtn');
    prevBtn.disabled = currentPage == 0;
}
async function renderPokemonPage(pageNumber) {
    const pokeContainer = document.getElementById('pokeContainer');
    if (!pokeContainer) {
        console.error("Error: PokeContainer element not found in the DOM.");
        return;
    }
    const prevBtns = document.querySelectorAll('#prevBtn');
    prevBtns.forEach((prevBtn) => {
        prevBtn.disabled = currentPage === 0;
    });
    const nextBtns = document.querySelectorAll('#nextBtn');
    nextBtns.forEach(nextBtn => {
        nextBtn.disabled = currentPage >= Math.ceil(totalPokemons / itemsPerPage) - 1;
    });
    pokeContainer.innerHTML = '';
    const startIdx = pageNumber * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    try {
        const response = await pokeApi();
        const totalPokemons = response.count;
        const totalPages = Math.ceil(totalPokemons / itemsPerPage);
        currentPage = Math.max(0, Math.min(totalPages - 1, currentPage));
        const pokemonData = await Promise.all(response.results.slice(startIdx, endIdx).map((pokemon) => fetchPokemonData(pokemon.url)));
        const pokeArticles = pokemonData
            .map((pokeInfo) => {
            return `
                    <article class="bg-white shadow-xl rounded-md cursor-pointer hover:scale-105 transition-transform">
                        <header class="flex justify-center flex-col">
                            <div class="flex justify-center">
                                <img class="w-36" src="${pokeInfo.sprites.front_default}" alt="${pokeInfo.name}" />
                            </div>
                            <div class="flex justify-center bg-green-800 rounded-b-md">
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
            currentPageSpan.forEach(pages => {
                pages.textContent = (pageNumber + 1).toString();
            });
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
renderPokemonPage(currentPage);
