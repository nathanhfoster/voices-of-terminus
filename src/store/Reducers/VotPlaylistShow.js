import C from "../../constants.js";

const defaultState = {
  lastApiCall: null,
  latest: []
};

export const VotPlaylistShow = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_PLAYLIST_SHOW:
      return { ...state, latest: payload, lastApiCall: new Date() };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
