import C from "../../constants.js";

const defaultState = { results: [], Gallery: {} };

export const Galleries = (state = defaultState, action) => {
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
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
