import C from "../../constants.js";

export const Admin = (
  state = {
    Users: [],
    User: { Characters: [], groups: [], user_permissions: [] },
    Tickets: [],
    Ticket: { StatusChanges: [], Notes: [] },
    posting: false,
    posted: false,
    updating: false,
    updated: false,
    error: null
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_USERS:
      return { ...state, Users: payload };
    case C.UPDATE_USERS_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case C.UPDATE_USERS_SUCCESS:
      return {
        ...state,
        Users: payload,
        updating: false,
        updated: true,
        error: null
      };
    case C.GET_USER:
      return { ...state, User: payload };
    case C.CLEAR_USER:
      return {
        ...state,
        User: null,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null
      };
    case C.GET_TICKETS:
      return { ...state, Tickets: payload };
    case C.GET_TICKET:
      return { ...state, Ticket: { ...state.Ticket, ...payload } };
    case C.GET_TICKET_NOTES:
      return { ...state, Ticket: { ...state.Ticket, Notes: payload } };
    case C.GET_TICKET_STATUS_CHANGES:
      return { ...state, Ticket: { ...state.Ticket, StatusChanges: payload } };
    case C.POST_TICKETS_LOADING:
      return {
        ...state,
        posting: true,
        posted: false
      };
    case C.POST_TICKETS_SUCCESS:
      return {
        ...state,
        posting: false,
        posted: true,
        error: null
      };
    case C.POST_TICKETS_ERROR:
      return {
        ...state,
        posting: false,
        posted: true,
        error: true
      };
    case C.CLEAR_ADMIN_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null
      };
    case C.SET_LOGOUT:
      return { ...state };
    default:
      return state;
  }
};
