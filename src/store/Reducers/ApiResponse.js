import C from "../../constants.js";

const defaultState = null;

export const ApiResponse = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.SET_API_RESPONSE:
      return payload;
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
