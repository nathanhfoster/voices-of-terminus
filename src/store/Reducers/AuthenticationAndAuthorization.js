import C from "../../constants.js";

const defaultState = { AllUserGroups: [], AllUserPermissions: [] };

export const AuthenticationAndAuthorization = (
  state = defaultState,
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_ALL_USER_GROUPS:
      return {
        ...state,
        AllUserGroups: payload
      };
    case C.GET_ALL_USER_PERMISSIONS:
      return {
        ...state,
        AllUserPermissions: payload
      };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
