import C from "../../constants.js";

export const VRYouTubeChannelData = (
  state = {
    lastApiCall: null,
    latest: [],
    totalResults: null,
    resultsPerPage: null
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VR_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
