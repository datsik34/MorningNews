export default function (apikey = null, action) {
    if (action.type == 'addAPI') {
        return action.APIadded;
    } else {
        return apikey;
    }
}