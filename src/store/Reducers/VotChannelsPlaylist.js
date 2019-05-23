import C from "../../constants.js";

export const VotChannelsPlaylist = (
  state = {
    lastApiCall: null,
    latest: []
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_CHANNELS_PLAYLISTS:
      return { ...state, latest: payload };
    default:
      return state;
  }
};
