import C from "../../constants.js";

const defaultState = {
  results: [],
  Event: {
    title: null,
    start_date: new Date(),
    end_date: new Date(),
    url: null,
    description: null,
    tags: null,
    sub_tags: null,
    min_level: 1,
    max_level: 60,
    locations: null,
    group_size: null
  },
  Groups: [],
  GroupMembers: []
};

export const Events = (state = defaultState, action) => {
  const { id, type, payload } = action;
  switch (type) {
    case C.GET_EVENTS_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case C.GET_EVENTS_SUCCESS:
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
        results: payload
      };
    case C.GET_EVENT:
      return { ...state, Event: payload };
    case C.GET_EVENT_GROUPS:
      return { ...state, Groups: payload };
    case C.GET_EVENT_GROUP_MEMBERS:
      return { ...state, GroupMembers: payload };
    case C.POST_EVENTS_LOADING:
      return {
        ...state,
        posting: true,
        posted: false
      };
    case C.POST_EVENTS_SUCCESS:
      return {
        ...state,
        posting: false,
        posted: true,
        error: null
      };
    case C.POST_EVENTS_ERROR:
      return {
        ...state,
        posting: false,
        posted: true,
        error: true
      };
    case C.UPDATE_EVENTS_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case C.UPDATE_EVENTS_SUCCESS:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      };
    case C.CLEAR_EVENTS_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null,
        Event: {
          title: null,
          start_date: new Date(),
          end_date: new Date(),
          url: null,
          description: null,
          tags: null,
          sub_tags: null,
          min_level: 1,
          max_level: 60,
          locations: null,
          group_size: null
        },
        Groups: [],
        GroupMembers: []
      };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return { ...state };
  }
};
