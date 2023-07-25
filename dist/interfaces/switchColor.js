export function getCardStyle(colorName) {
    switch (colorName) {
        case 'red':
            return `bg-red-500`;
        case 'blue':
            return `bg-blue-500`;
        case 'yellow':
            return `bg-yellow-500`;
        case 'green':
            return `bg-green-500`;
        case 'white':
            return `bg-gray-400`;
        case 'brown':
            return `bg-amber-800`;
        case 'purple':
            return `bg-purple-400`;
        case 'gray':
            return `bg-gray-600`;
        case 'pink':
            return `bg-pink-500`;
        case 'black':
            return `bg-gray-950`;
        default:
            return `bg-black`;
    }
}
