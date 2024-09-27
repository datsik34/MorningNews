export default function (username = null, action) {
    if (action.type == 'addUser') {
        return action.userAdded;
    } else if (action.type == 'changeUser') {
        return action.userChanged;
    } else {
        return username;
    }
}