import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  publishedAt: null,
  channelId: null,
  title: null,
  description: null,
  channelTitle: null,
  liveBroadcastContent: null,
  thumbnail: null,
  thumbnails: [],
  kind: null,
  playlists: []
};

export const VotAllYouTubeChannelData = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
