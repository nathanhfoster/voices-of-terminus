import C from "../../constants.js";

export const VRYouTubeChannelData = (state = [], action) =>
  action.type == C.GET_VR_YOUTUBE_CHANNEL_DATA ? action.payload : state;
