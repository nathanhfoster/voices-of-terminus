import C from "../../constants.js";

export const User = (
    state = {
      groups: [],
      user_permissions: [],
      Characters: [],
      Tickets: [],
      Settings: { show_footer: false, push_messages: false }
    },
    action
  ) => {
    const { type, payload } = action;
    switch (type) {
      case C.SET_LOGIN_TOKEN:
        return { ...state, ...payload };
      case C.UPDATE_USER_LOADING:
        return {
          ...state,
          updating: true,
          updated: false
        };
      case C.UPDATE_USER_SUCCESS:
        return {
          ...state,
          ...payload,
          updating: false,
          updated: true,
          error: null
        };
      case C.CLEAR_USER_API:
        return {
          ...state,
          posting: false,
          posted: false,
          updating: false,
          updated: false,
          error: null
        };
      case C.GET_CHARACTERS:
        return {
          ...state,
          Characters: payload
        };
      case C.GET_USER_TICKETS:
        return {
          ...state,
          Tickets: payload
        };
      case C.SET_USER_SETTINGS:
        return {
          ...state,
          Settings: payload
        };
      case C.SET_LOGOUT:
        return {
          groups: [],
          user_permissions: [],
          AllUserGroups: [],
          AllUserPermissions: [],
          Characters: [],
          Settings: { show_footer: false, push_messages: false }
        };
      default:
        return { ...state };
    }
  };