import C from "../../constants.js";

export const VotTwitchStreams = (
  state = { lastApiCall: new Date(), _total: null, _links: {}, videos: [] },
  action
) => {
  state.lastApiCall = new Date();
  const { type, payload } = action;
  switch (type) {
    case C.GET_VOT_TWITCH_STREAMS:
      return { ...state, ...payload };
    default:
      return state;
  }
};
