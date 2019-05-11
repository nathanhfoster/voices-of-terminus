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
    switch (action.type) {
      case C.GET_MESSAGES:
        return {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
          results: action.payload.results,
          messageRecipients: state.messageRecipients,
          messageDetails: state.messageDetails
        };
      case C.GET_MESSAGE_DETAILS:
        return { ...state, messageDetails: action.payload };
      case C.GET_MESSAGE_RECIPIENTS:
        return { ...state, messageRecipients: action.payload };
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