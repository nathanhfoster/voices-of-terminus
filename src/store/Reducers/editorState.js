import C from "../../constants.js";

const defaultState = null;

export const editorState = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.SET_EDITOR_STATE:
      return payload;
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
