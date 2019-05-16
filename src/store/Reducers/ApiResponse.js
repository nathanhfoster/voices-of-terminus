import C from "../../constants.js";

export const ApiResponse = (state = {}, action) =>
  action.type === C.SET_API_RESPONSE
    ? action
      ? action.payload
      : {}
    : action.type === C.CLEAR_API_RESPONSE
    ? {}
    : state;
