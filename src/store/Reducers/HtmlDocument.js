import C from "../../constants.js";

export const HtmlDocument = (state = null, action) =>
  action.type === C.GET_HTML_DOCUMENT
    ? action.payload
    : action.type === C.CLEAR_HTML_DOCUMENT
    ? null
    : state;
