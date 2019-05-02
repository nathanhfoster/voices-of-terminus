import C from "../constants";

const setEditorState = editorState => ({
  type: C.SET_EDITOR_STATE,
  payload: editorState
});

export { setEditorState };
