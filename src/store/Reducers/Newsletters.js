import C from "../../constants.js";

export const Newsletters = (state = { results: [] }, action) => {
    switch (action.type) {
      case C.GET_NEWSLETTERS_LOADING:
        return {
          ...state,
          loading: true,
          loaded: false
        };
      case C.GET_NEWSLETTERS_SUCCESS:
        const { posting, posted, updating, updated } = state;
        return {
          ...action.payload,
          loading: false,
          loaded: true,
          posting,
          posted,
          updating,
          updated,
          error: null
        };
      case C.GET_NEWSLETTERS_ERROR:
        return {
          ...state,
          loading: false,
          loaded: true,
          error: action.payload
        };
      case C.POST_NEWSLETTERS_LOADING:
        return {
          ...state,
          posting: true,
          posted: false
        };
      case C.POST_NEWSLETTERS_SUCCESS:
        return {
          ...state,
          posting: false,
          posted: true,
          error: null
        };
      case C.UPDATE_NEWSLETTERS_LOADING:
        return {
          ...state,
          updating: true,
          updated: false
        };
      case C.UPDATE_NEWSLETTERS_SUCCESS:
        return {
          ...state,
          updating: false,
          updated: true,
          error: null
        };
      case C.CLEAR_NEWSLETTERS_API:
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