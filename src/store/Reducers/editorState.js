import C from "../../constants.js";

export const editorState = (state = null, action) =>
  action.type === C.SET_EDITOR_STATE ? action.payload : state;
