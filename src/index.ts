interface PokeApiResponse {
    results: Pokemon[];
    count: number;
}

interface Pokemon {
    url: string;
}

interface PokemonData {
    name: string;
    sprites: {
        front_default: string;
    };
}

const pokeApi = async (): Promise<PokeApiResponse> => {
    try {
        const request = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300');
        const response: PokeApiResponse = await request.json();
        const data: PokeApiResponse = response;
        return data;
    } catch (err) {
        console.log('Error calling API:', err);
        throw err;
    }
};

const fetchPokemonData = async (url: string): Promise<PokemonData> => {
    try {
        const request = await fetch(url);
        const response: PokemonData = await request.json();
        return response;
    } catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};

let currentPage = 0
const itemsPerPage = 50;
const totalPokemons = 300

const loadingOverlay = document.getElementById('loadingOverlay') as HTMLDivElement;
function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}


function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showLoadingOverlay(); // Mostrar el overlay de carga
        renderPokemonPage(currentPage).then(() => {
           setTimeout(() => {
             hideLoadingOverlay()
           }, 250);; // Ocultar el overlay de carga una vez completada la carga y renderizado
        });
    }
    renderPokemonPage(currentPage);

}

function nextPage() {
    const totalPages = Math.ceil(totalPokemons / itemsPerPage);
    if (currentPage + 1 < totalPages) {
        currentPage++
        showLoadingOverlay(); // Mostrar el overlay de carga
        renderPokemonPage(currentPage).then(() => {
            setTimeout(() => {
                hideLoadingOverlay()
              }, 250);; // Ocultar el overlay de carga una vez completada la carga y renderizado
        });
        
    }
    renderPokemonPage(currentPage);

    const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
    prevBtn.disabled = currentPage == 0;

}
async function renderPokemonPage(pageNumber: number) {
    const pokeContainer = document.getElementById('pokeContainer');

    if (!pokeContainer) {
        console.error("Error: PokeContainer element not found in the DOM.");
        return;
    }
    const prevBtns = document.querySelectorAll('#prevBtn') as NodeListOf<HTMLButtonElement>;
    prevBtns.forEach((prevBtn) => {
        prevBtn.disabled = currentPage === 0;
    });
    const nextBtns = document.querySelectorAll('#nextBtn') as NodeListOf<HTMLButtonElement>;
    nextBtns.forEach(nextBtn => {
        nextBtn.disabled = currentPage >= Math.ceil(totalPokemons / itemsPerPage) - 1;
    })
    pokeContainer.innerHTML = ''; // Clear the container before rendering new Pokemon

    const startIdx = pageNumber * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    try {
        const response = await pokeApi(); // Fetch the Pokémon data and the total count
        const totalPokemons = response.count;

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalPokemons / itemsPerPage);

        // Ensure the currentPage is within the valid range
        currentPage = Math.max(0, Math.min(totalPages - 1, currentPage));

        // Fetch the Pokémon data for the current page
        const pokemonData = await Promise.all(
            response.results.slice(startIdx, endIdx).map((pokemon) => fetchPokemonData(pokemon.url))
        );

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

        const currentPageSpan = document.querySelectorAll('#currentPage')
        if (currentPageSpan) {
            currentPageSpan.forEach(pages => {
                pages.textContent = (pageNumber + 1).toString();
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initial rendering on page load
renderPokemonPage(currentPage);