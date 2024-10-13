export default function (token = null, action) {
    if (action.type === 'addToken') {
        return action.tokenAdded;
    } else if (action.type === 'RESET_TOKEN') {
        return null;
    } else {
        return token;
    }
}