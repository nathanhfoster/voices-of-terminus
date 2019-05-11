import C from "../../constants.js";

export const VotTwitchStreams = (state = { videos: [] }, action) =>
  action.type === C.GET_VOT_TWITCH_STREAMS ? action.payload : state;