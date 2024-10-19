export default function (favorites = [], action) {
    var favoritesCopy = [...favorites];
    if (action.type === 'addSource') {
        var found = false;
        for (var i = 0; i < favoritesCopy.length; i++) {
            if (favoritesCopy[i].id === action.source.id) {
                found = true
            }
        }
        if (!found) {
            favoritesCopy.push(action.source);
        }
        return favoritesCopy;

    } else if (action.type === 'suprSource') {
        var position = null;
        for (var i = 0; i < favoritesCopy.length; i++) {
            if (favoritesCopy[i].id === action.id) {
                position = i;
            }
        }
        favoritesCopy.splice(position, 1);
        return favoritesCopy;

    } else if (action.type === 'getFavorites'){
        favoritesCopy = action.favorites
        return favoritesCopy;
    } else if (action.type === 'RESET_FAVORITES') {
        return [];
    } else {
        return favorites;
    }
}