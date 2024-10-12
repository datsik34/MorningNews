export default function (currentstatus = 'add City', action) {
    if (action.type === 'addStatus') {
        return action.statusAdded;
    } else {
        return currentstatus;
    }
}