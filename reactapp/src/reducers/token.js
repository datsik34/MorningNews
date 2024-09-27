export default function (token = null, action) {
    if (action.type == 'addToken') {
        return action.tokenAdded;
    } else {
        return token;
    }
}