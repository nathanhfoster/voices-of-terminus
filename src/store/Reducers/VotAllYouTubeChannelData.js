import C from "../../constants.js";

export const VotAllYouTubeChannelData = (
  state = {
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
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
