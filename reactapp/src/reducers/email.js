export default function (email = null, action) {
    if (action.type === 'addEmail') {
        return action.emailAdded;
    } else if (action.type === 'changeEmail') {
        return action.emailAdded;
    } else if (action.type === 'RESET') {
        return null;
    } else {
        return email;
    }
}