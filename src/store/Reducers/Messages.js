import C from "../../constants.js";

export const Messages = (
  state = {
    count: null,
    next: null,
    previous: null,
    results: [],
    messageRecipients: [],
    messageDetails: { count: null, next: null, previous: null, results: [] }
  },
  action
) => {
  const { id, type, payload } = action;
  switch (type) {
    case C.GET_MESSAGES:
      return {
        ...state,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
        results: payload.results
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
    default:
      return state;
  }
};
