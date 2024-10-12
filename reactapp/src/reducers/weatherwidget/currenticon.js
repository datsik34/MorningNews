export default function (currenticon = '01d', action) {
    if (action.type === 'addIcon') {
        return action.iconAdded;
    } else {
        return currenticon;
    }
}