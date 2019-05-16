import C from "../../constants.js";

export const VotChannelsPlaylist = (state = [], action) =>
  action.type === C.GET_VOT_CHANNELS_PLAYLISTS ? action.payload : state;
