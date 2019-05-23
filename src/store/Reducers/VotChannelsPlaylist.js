import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  latest: []
};

export const VotChannelsPlaylist = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_CHANNELS_PLAYLISTS:
      return { ...state, latest: payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
