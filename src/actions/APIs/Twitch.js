import C from "../../constants";
import { shouldUpdate } from "./index";
import axios from "axios";
const { REACT_APP_TWITCH_CLIENT_ID } = process.env;
const channelId = "pantheon_vot";

const baseHeaders = {
  "Client-ID": REACT_APP_TWITCH_CLIENT_ID
};

const AxiosTwitch = OAuth =>
  axios.create({
    baseURL: `https://api.twitch.tv/kraken/channels/${channelId}/`,
    headers: OAuth
      ? {
          Authorization: "OAuth cfabdegwdoklmawdzdo98xt2fo512y",
          ...baseHeaders
        }
      : baseHeaders
  });

const getVotTwitchStreams = () => (dispatch, getState) => {
  const url = `videos?broadcasts=true&limit=20&client_id=${REACT_APP_TWITCH_CLIENT_ID}`;
  const { lastApiCall } = getState().VotTwitchStreams;

  shouldUpdate(lastApiCall) &&
    AxiosTwitch()
      .get(url)
      .then(res =>
        dispatch({
          type: C.GET_VOT_TWITCH_STREAMS,
          payload: res.data
        })
      )
      .catch(e => console.log(e));
};

const getChannelSubscribers = () => (dispatch, getState) => {
  //${REACT_APP_TWITCH_CLIENT_ID}
  const url = `subscriptions`;
  console.log("URL: ", url);
  AxiosTwitch()
    .get(url)
    .then(res => console.log("WORKED: ", res))
    .catch(e => console.log("getChannelSubscribers: ", e.response));
};

export { getVotTwitchStreams, getChannelSubscribers };
