export default function (weathercity = null, action) {
    if (action.type === 'addWeatherCity') {
        return action.cityAdded;
    } else {
        return weathercity;
    }
}