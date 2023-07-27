import { getCardStyle } from './switchColor.js'

interface PokeApiResponse {
    results: Pokemon[];
    count: number;
}

export interface Pokemon {
    url: string;
    name: string;
}

interface PokemonData {
    name: string;
    sprites: {
        front_default: string;
    };
    species: {
        name: string;
        url: string;
    };
}

interface PokemonSpeciesColor {
    color: {
        name: string;
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

export const fetchPokemonData = async (url: string): Promise<PokemonData & PokemonSpeciesColor> => {
    try {
        const request = await fetch(url);
        const response: PokemonData = await request.json();

        const speciesRequest = await fetch(response.species.url);
        const speciesResponse: PokemonSpeciesColor = await speciesRequest.json();

        return { ...response, ...speciesResponse };
    } catch (err) {
        console.log('Error fetching Pokemon data:', err);
        throw err;
    }
};
const ContainerButtons = document.querySelectorAll('#containerButtons') as NodeListOf<HTMLButtonElement>
export const prevBtns = document.querySelectorAll('#prevBtn') as NodeListOf<HTMLButtonElement>;
export const nextBtns = document.querySelectorAll('#nextBtn') as NodeListOf<HTMLButtonElement>;
export const not_found_404 = document.getElementById('notFound') as HTMLDivElement
const pokeContainer = document.getElementById('pokeContainer') as HTMLElement;
export const totalPokemons = 900;

let currentPage = 0;
const itemsPerPage = 20;
export let filteredPokemonData: Pokemon[] = [];

export async function renderPokemonPage() {
    try {
        let response: PokeApiResponse;

        if (filteredPokemonData.length === 0) {
            response = await pokeApi()
        } else {
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

        pokeContainer.innerHTML = ''; // Clear the container before rendering new Pokemon

        const startIdx = currentPage * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;

        const pokemonsToRender = response.results.slice(startIdx, endIdx);

        const pokemonData = await Promise.all(
            pokemonsToRender.map((pokemon) => fetchPokemonData(pokemon.url)) // Ensure the 'url' is used correctly
        );

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
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function filterAndRenderPokemons(filteredPokemons: Pokemon[], totalPokemons: number) {
    filteredPokemonData = filteredPokemons;
    currentPage = 0;
    renderPokemonPage();
}


const loadingOverlay = document.getElementById('loadingOverlay') as HTMLDivElement;
export function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

export function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}

export function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showLoadingOverlay()
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay()
            }, 250)
        })
    }
}

export function nextPage() {
    const totalPages = Math.ceil(totalPokemons / itemsPerPage);
    if (currentPage + 1 < totalPages) {
        currentPage++;
        showLoadingOverlay();
        renderPokemonPage().then(() => {
            setTimeout(() => {
                hideLoadingOverlay()
            }, 250)
        })
    }
}

export const inicioBtn = document.getElementById('indexBtn') as HTMLButtonElement

inicioBtn.addEventListener('click', () => {
    currentPage = 0
    filteredPokemonData = []
    showLoadingOverlay();
    renderPokemonPage().then(() => {
        pokeContainer.classList.replace('hidden','grid');
        not_found_404.classList.replace('flex','hidden')
        ContainerButtons.forEach(containerBtn => {
            containerBtn.classList.replace('hidden','flex')
          })
        setTimeout(() => {
            hideLoadingOverlay()
        }, 250)
    })
})