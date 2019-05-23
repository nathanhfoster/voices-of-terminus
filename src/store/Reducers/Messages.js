import C from "../../constants.js";

const defaultState = {
  count: null,
  next: null,
  previous: null,
  results: [],
  messageRecipients: [],
  messageDetails: { count: null, next: null, previous: null, results: [] }
};

export const Messages = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_MESSAGES:
      return {
        ...state,
        ...payload
      };
    case C.GET_MESSAGE_DETAILS:
      return { ...state, messageDetails: payload };
    case C.GET_MESSAGE_RECIPIENTS:
      return { ...state, messageRecipients: payload };
    case C.SET_LOGOUT:
      return {
        count: null,
        next: null,
        previous: null,
        results: [],
        messageRecipients: [],
        messageDetails: { count: null, next: null, previous: null, results: [] }
      };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
