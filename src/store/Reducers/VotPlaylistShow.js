import C from "../../constants.js";

export const VotPlaylistShow = (state = [], action) =>
  action.type == C.GET_VOT_PLAYLIST_SHOW ? action.payload : state;
