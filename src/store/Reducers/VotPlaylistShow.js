import C from "../../constants.js";

export const VotPlaylistShow = (
  state = {
    lastApiCall: null,
    latest: []
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_PLAYLIST_SHOW:
      return { ...state, latest: payload };
    default:
      return state;
  }
};
