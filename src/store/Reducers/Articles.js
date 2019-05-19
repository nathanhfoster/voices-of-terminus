import C from "../../constants.js";

export const Articles = (state = { results: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_ARTICLES_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_ARTICLES_SUCCESS:
      const { posting, posted, updating, updated } = state;
      return {
        ...payload,
        loading: false,
        loaded: true,
        posting,
        posted,
        updating,
        updated,
        error: null
      };
    case C.GET_ARTICLES_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: payload
      };
    case C.POST_ARTICLES_LOADING:
      return {
        ...state,
        posting: true,
        posted: false
      };
    case C.POST_ARTICLES_SUCCESS:
      return {
        ...state,
        posting: false,
        posted: true,
        error: null
      };
    case C.UPDATE_ARTICLES_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case C.UPDATE_ARTICLES_SUCCESS:
      return {
        ...state,
        updating: false,
        updated: true,
        error: null
      };
    case C.CLEAR_ARTICLES_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false
      };
    default:
      return state;
  }
};
