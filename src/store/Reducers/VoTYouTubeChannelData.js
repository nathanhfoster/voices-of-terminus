import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  latest: [],
  nextPageToken: null,
  resultsPerPage: null,
  totalResults: null
};

export const VoTYouTubeChannelData = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
