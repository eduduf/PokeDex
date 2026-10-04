const pokeContainer = document.querySelector("#pokeContainer");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const typeFilter = document.querySelector("#typeFilter");
const sortFilter = document.querySelector("#sortFilter");
const emptyState = document.querySelector("#emptyState");
const pokemonCount = 1351;
let isLoading = true;
const colors = {fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    ice: '#d6f1f5',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
    ghost: '#b7a7d8',
    dark: '#a7a7a7',
    steel: '#c7d1d6'
}

const mainTypes = Object.keys(colors);

const fecthPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemons(i);
    }
    isLoading = false;
    filterPokemons();
}

const getPokemons = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url)
    const data = await res.json()
    createPokemonCard(data)
}

const createPokemonCard = (pokemon) => {
    const card = document.createElement("div");
    card.classList.add("pokemon");

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, "0");

    card.dataset.name = pokemon.name;
    card.dataset.id = id;

    const pokeTypes = pokemon.types.map(type => type.type.name);
    card.dataset.types = pokeTypes.join(" ");
    const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
    const color = colors[type];

    card.style.backgroundColor = color;

    const pokemonInnerHTML = `<div class="imgContainer">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="Arte oficial de ${name}">
            </div>
            <div class="info">
                <span class="number">#${id}</span>
                <h3 class="name">${name}</h3>
                <small class="type">Type: <span>${type}</span></small>
            </div>
    `

    card.innerHTML = pokemonInnerHTML;
    card.hidden = !matchesCurrentFilters(card);
    insertPokemonCard(card);
}

const matchesCurrentFilters = card => {
    const query = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    const matchesQuery = card.dataset.name.includes(query) || card.dataset.id.includes(query);
    const matchesType = !selectedType || card.dataset.types.split(" ").includes(selectedType);

    return matchesQuery && matchesType;
}

const filterPokemons = () => {
    const cards = pokeContainer.querySelectorAll(".pokemon");
    let visibleCount = 0;

    cards.forEach(card => {
        const matches = matchesCurrentFilters(card);
        card.hidden = !matches;
        if (matches) visibleCount++;
    });

    emptyState.hidden = visibleCount > 0 || isLoading;
}

const comparePokemonCards = (firstCard, secondCard) => {
    if (sortFilter.value === "name") {
        return firstCard.dataset.name.localeCompare(secondCard.dataset.name);
    }

    return Number(firstCard.dataset.id) - Number(secondCard.dataset.id);
}

const insertPokemonCard = card => {
    const nextCard = Array.from(pokeContainer.children)
        .find(existingCard => comparePokemonCards(card, existingCard) < 0);
    pokeContainer.insertBefore(card, nextCard || null);
}

const sortPokemonCards = () => {
    const cards = Array.from(pokeContainer.querySelectorAll(".pokemon"));
    cards.sort(comparePokemonCards).forEach(card => pokeContainer.appendChild(card));
}

searchInput.addEventListener("input", filterPokemons);
typeFilter.addEventListener("change", filterPokemons);
sortFilter.addEventListener("change", sortPokemonCards);
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    filterPokemons();
});

fecthPokemons();

// const getPokes = async () => {
//     const url = `https://pokeapi.co/api/v2/pokemon`;
//     const res = await fetch(url)
//     const data = await res.json()
//     console.log(data)
// }
// getPokes()
