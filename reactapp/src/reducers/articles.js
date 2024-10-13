export default function (wishList = [], action) {
    var wishListCopy = [...wishList];
    if (action.type === 'addArticle') {
        var found = false;
        for (var i = 0; i < wishListCopy.length; i++) {
            if (wishListCopy[i].title === action.articleLiked.title) {
                found = true
            }
        }
        if (!found) {
            wishListCopy.push(action.articleLiked);
        }
        return wishListCopy;

    } else if (action.type === 'suprArticle') {
        var position = null;
        for (var i = 0; i < wishListCopy.length; i++) {
            if (wishListCopy[i].title === action.articleDeleted) {
                position = i;
            }
        }
        wishListCopy.splice(position, 1);
        return wishListCopy;

    } else if (action.type === 'getArticles'){
        wishListCopy = action.articles
        return wishListCopy;
    } else if (action.type === 'RESET_ARTICLES') {
        return [];
    } else {
        return wishList;
    }
}