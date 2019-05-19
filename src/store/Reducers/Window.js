import C from "../../constants.js";

export const Window = (state = {}, action) =>
  action.type == C.SET_WINDOW ? action.payload : state;
