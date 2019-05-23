import C from "../../constants.js";

export const VoTYouTubeChannelData = (
  state = {
    lastApiCall: null,
    latest: [],
    nextPageToken: null,
    resultsPerPage: null,
    totalResults: null
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
