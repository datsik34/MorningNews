export default function (apikey = null, action) {
    if (action.type === 'addAPI') {
        return action.APIadded;
    } else if (action.type === 'RESET') {
        return null;
    } else {
        return apikey;
    }
}