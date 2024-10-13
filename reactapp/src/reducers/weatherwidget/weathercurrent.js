const initialState = {
    currentCity: null,
    currentTemp: '--',
    currentStatus: 'add city',
    currentIcon: null
  };

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_CURRENT_CITY':
      return {
        ...state,
        currentCity: action.payload,
      };
    case 'SET_CURRENT_TEMP':
      return {
        ...state,
        currentTemp: action.payload,
      };
    case 'SET_CURRENT_STATUS':
      return {
        ...state,
        currentStatus: action.payload,
      };
    case 'SET_CURRENT_ICON':
      return {
        ...state,
        currentIcon: action.payload,
      };
    case 'RESET_CURRENTS':
      return initialState;
    default:
      return state;
  }
};