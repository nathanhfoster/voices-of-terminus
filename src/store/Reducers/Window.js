import C from "../../constants.js";

const defaultState = { innerHeight: null, innerWidth: null, isMobile: null };

export const Window = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.SET_WINDOW:
      return payload;
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
