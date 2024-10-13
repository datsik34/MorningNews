export default function (username = null, action) {
    if (action.type === 'addUsername') {
        return action.usernameAdded;
    } else if (action.type === 'changeUsername') {
        return action.usernameAdded;
    } else if (action.type === 'RESET_USERNAME') {
        return null;
    } else {
        return username;
    }
}