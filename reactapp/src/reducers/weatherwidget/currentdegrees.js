export default function (currentdegrees = '--', action) {
    if (action.type === 'addTemperature') {
        return action.tempAdded;
    } else {
        return currentdegrees;
    }
}