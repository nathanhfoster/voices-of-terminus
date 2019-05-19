import C from "../../constants.js";

export const VoTYouTubeChannelData = (state = [], action) =>
  action.type == C.GET_VOT_YOUTUBE_CHANNEL_DATA ? action.payload : state;
