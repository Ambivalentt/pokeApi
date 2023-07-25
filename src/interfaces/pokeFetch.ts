interface PokeApiResponse {
    results: Pokemon[];
    count: number;
}

export interface Pokemon {
    url: string;
    name: string
}

interface PokemonData {
    name: string;
    sprites: {
        front_default: string;
    };
}

export const pokeApi = async (): Promise<PokeApiResponse> => {
    try {
        const request = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${totalPokemons}`);
        const response: PokeApiResponse = await request.json();
        const data: PokeApiResponse = response;
        return data;
    } catch (err) {
        console.log('Error calling API:', err);
        throw err;
    }
};

export const fetchPokemonData = async (url: string): Promise<PokemonData> => {
    try {
        const request = await fetch(url);
        const response: PokemonData = await request.json();
        return response;
    } catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};

export let currentPage = 0
export const itemsPerPage = 5
export const totalPokemons = 300

const loadingOverlay = document.getElementById('loadingOverlay') as HTMLDivElement;
export function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

export function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}


const nextBtns = document.querySelectorAll('#nextBtn') as NodeListOf<HTMLButtonElement>;
nextBtns.forEach((nextBtn) => {
    nextBtn.addEventListener('click', nextPage);
});

const prevBtns = document.querySelectorAll('#prevBtn') as NodeListOf<HTMLButtonElement>;
prevBtns.forEach((prevBtn) => {
    prevBtn.addEventListener('click', prevPage);
});

export function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showLoadingOverlay(); // Mostrar el overlay de carga
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay()
            }, 250);; // Ocultar el overlay de carga una vez completada la carga y renderizado
        });
    }

}

export function nextPage() {
    const totalPages = Math.ceil(totalPokemons / itemsPerPage);
    
    if (currentPage + 1 < totalPages) {
        currentPage++
        showLoadingOverlay(); // Mostrar el overlay de carga
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay()
            }, 250);; // Ocultar el overlay de carga una vez completada la carga y renderizado
        });

    }
}

export async function renderPokemonPage() {
    const pokeContainer = document.getElementById('pokeContainer') as HTMLElement

    prevBtns.forEach((prevBtn) => {
        prevBtn.disabled = currentPage === 0;
    });

    nextBtns.forEach(nextBtn => {
        nextBtn.disabled = currentPage >= Math.ceil(totalPokemons / itemsPerPage) - 1;
    })

    pokeContainer.innerHTML = ''; // Clear the container before rendering new Pokemon

    const startIdx = currentPage * itemsPerPage;
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
                    <article class="bg-white shadow-2xl rounded-md cursor-pointer hover:scale-105 transition-transform">
                        <header class="flex justify-center flex-col">
                            <div class="flex justify-center">
                                <img class="w-36" src="${pokeInfo.sprites.front_default}" alt="${pokeInfo.name}" />
                            </div>
                            <div class="flex justify-center bg-bot-card rounded-b-md">
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
                pages.textContent = (currentPage + 1).toString();
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

//filtrar
export async function filterAndRenderPokemons(filteredPokemons: PokemonData[], currentPage:number, itemsPerPage:number, totalPokemons:number) {
    const pokeContainer = document.getElementById('pokeContainer') as HTMLElement

    prevBtns.forEach((prevBtn) => {
        prevBtn.disabled = currentPage === 0;
    });

    nextBtns.forEach(nextBtn => {
        nextBtn.disabled = currentPage >= Math.ceil(totalPokemons / itemsPerPage) - 1;
    })

    pokeContainer.innerHTML = ''; // Clear the container before rendering new Pokemon

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const totalPages = Math.ceil(totalPokemons / itemsPerPage);

    
    currentPage = Math.max(0, Math.min(totalPages - 1, currentPage));
    const pokemonsFilters = filteredPokemons.slice(startIdx, endIdx)

    const pokeArticles = pokemonsFilters
        .map((pokeInfo) => {
            return `
          <article class="bg-white shadow-2xl rounded-md cursor-pointer hover:scale-105 transition-transform">
              <header class="flex justify-center flex-col">
                  <div class="flex justify-center">
                      <img class="w-36" src="${pokeInfo.sprites.front_default}" alt="${pokeInfo.name}" />
                  </div>
                  <div class="flex justify-center bg-bot-card rounded-b-md">
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
                pages.textContent = (currentPage + 1).toString();
            });
        }
}