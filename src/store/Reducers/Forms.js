import C from "../../constants.js";

export const Forms = (
  state = {
    results: [],
    Form: {},
    Questions: [],
    Choices: [],
    Responses: { results: [] },
    Recipients: []
  },
  action
) => {
  const { id, type, payload } = action;
  switch (type) {
    case C.GET_FORMS_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_FORMS_SUCCESS:
      const { posting, posted, updating, updated } = state;
      return {
        loading: false,
        loaded: true,
        posting,
        posted,
        updating,
        updated,
        error: null,
        ...state,
        ...payload
      };
    case C.GET_FORM:
      return { ...state, Form: payload };
    case C.POST_FORMS_LOADING:
      return {
        ...state,
        posting: true,
        posted: false
      };
    case C.POST_FORMS_SUCCESS:
      return {
        ...state,
        posting: false,
        posted: true,
        error: null
      };
    case C.POST_FORMS_ERROR:
      return {
        ...state,
        posting: false,
        posted: true,
        error: true
      };
    case C.UPDATE_FORMS_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case C.UPDATE_FORMS_SUCCESS:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      };
    case C.GET_QUESTIONS:
      return {
        ...state,
        Questions: payload
      };
    case C.GET_CHOICES:
      return {
        ...state,
        Choices: payload
      };
    case C.GET_RESPONSES:
      return {
        ...state,
        Responses: { ...state.Responses, ...payload }
      };
    case C.CLEAR_RESPONSES:
      return {
        ...state,
        Responses: { ...state.Responses, results: [] }
      };
    case C.POST_RESPONSE_LOADING:
      return {
        ...state,
        Responses: { ...state.Responses, posting: true, posted: false }
      };
    case C.POST_RESPONSE_SUCCESS:
      return {
        ...state,
        Responses: {
          ...state.Responses,
          posting: false,
          posted: true,
          error: null
        }
      };
    case C.POST_RESPONSE_ERROR:
      return {
        ...state,
        Responses: {
          ...state.Responses,
          posting: false,
          posted: true,
          error: true
        }
      };
    case C.GET_RECIPIENTS:
      return {
        ...state,
        Recipients: payload
      };
    case C.CLEAR_POLLS_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null,
        Form: {}
      };
    default:
      return { ...state };
  }
};