import C from "../../constants.js";
export const AuthenticationAndAuthorization = (
    state = { AllUserGroups: [], AllUserPermissions: [] },
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
      default:
        return { ...state };
    }
  };