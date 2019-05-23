import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  latest: [],
  totalResults: null,
  resultsPerPage: null
};

export const VRYouTubeChannelData = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VR_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
