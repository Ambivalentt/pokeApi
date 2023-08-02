export const switchTypes = (type) => {
    switch (type) {
        case 'Hierva':
            return "grass";
        case 'Veneno':
            return "poison";
        case 'Bicho':
            return "bug";
        case 'Fuego':
            return 'fire';
        case 'Volador':
            return "flying";
        case 'Agua':
            return "water";
        case 'Hielo':
            return 'ice';
        case 'Electrico':
            return "electric";
        case 'Tierra':
            return "ground";
        case 'Hada':
            return "fairy";
        case 'Luchador':
            return "fighting";
        case 'Roca':
            return "rock";
        case 'Psiquico':
            return "psychic";
        case 'Acero':
            return "steel";
        case 'Fantasma':
            return "ghost";
        case 'Oscuro':
            return "dark";
        case 'Dragon':
            return "dragon";
        case 'Normal':
            return 'normal';
        default:
            return console.log('No se encontro al pokemon');
    }
};
