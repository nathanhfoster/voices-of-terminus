import C from "../../constants.js";

export const Galleries = (state = { results: [], Gallery: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_GALLERIES_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_GALLERIES:
      return {
        ...payload,
        loading: false,
        loaded: true,
        error: null,
        Gallery: { results: [] }
      };

    case C.GET_GALLERY_LOADING:
      return {
        ...state,
        loading: false,
        loaded: true
      };

    case C.GET_GALLERY:
      return {
        ...state,
        Gallery: {
          ...payload,
          loading: false,
          loaded: true,
          error: null
        }
      };

    case C.GET_GALLERY_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: payload
      };

    case C.CLEAR_GALLERY:
      return {
        ...state,
        Gallery: { ...state.Gallery, results: [] }
      };
    default:
      return state;
  }
};
