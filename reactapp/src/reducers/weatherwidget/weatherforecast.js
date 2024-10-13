const initialState = {
    items: [],
  };
export default function (state = initialState, action) {
    switch (action.type) {
      case 'SET_FORECAST':
        return {
          ...state,
          items: [action.payload],
        };
      case 'RESET_FORECAST':
        return initialState
      default:
        return state;
    }
  };