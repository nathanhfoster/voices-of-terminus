import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  _total: null,
  _links: {},
  videos: []
};

export const VotTwitchStreams = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_TWITCH_STREAMS:
      return { ...state, ...payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
