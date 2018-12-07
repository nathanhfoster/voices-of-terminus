import C from "../constants";
import { Axios } from "./Axios";
import axios from "axios";
import Cookies from "js-cookie";
import YTube from "ytube";
import qs from "qs";
const youTubeKey = process.env.REACT_APP_YOUTUBE_API_KEY;
const ytube = new YTube(youTubeKey);
const votYouTubeChanneID = process.env.REACT_APP_VOT_YOUTUBE_CHANNEL_ID;
const vrYouTubeChanneID = process.env.REACT_APP_VR_YOUTUBE_CHANNEL_ID;
const votPlaylistIdShow = process.env.REACT_APP_VOT_PLAYLIST_ID_SHOW;

export const getVoTYouTubeChannelData = () => {
  return async dispatch =>
    await ytube
      .getChannelsLatestVideos(votYouTubeChanneID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res.latest
        });
      })
      .catch(e => console.log(e));
};

export const getVotChannelsPlayLists = () => {
  return async dispatch =>
    await ytube
      .getChannelsPlayLists(votYouTubeChanneID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_CHANNELS_PLAYLISTS,
          payload: res
        });
      })
      .catch(e => console.log(e));
};

export const getVotPlaylistShow = () => {
  return async dispatch =>
    await ytube
      .getPlaylistVideos(votPlaylistIdShow, 50)
      .then(res => {
        dispatch({
          type: C.GET_VOT_PLAYLIST_SHOW,
          payload: res
        });
      })
      .catch(e => console.log(e));
};

export const getVotTwitchStreams = () => {
  return async dispatch =>
    await axios
      .get(
        "https://api.twitch.tv/kraken/channels/pantheon_vot/videos?broadcasts=true&limit=20&client_id=jvqb2pnewihctq9ov3on4ajzhyqc7t"
      )
      .then(res => {
        dispatch({
          type: C.GET_VOT_TWITCH_STREAMS,
          payload: res.data
        });
      })
      .catch(e => {});
};

export const getAllVotYouTube = () => {
  return async dispatch =>
    await ytube
      .fetchAllYouTube("Voices of Terminus")
      .then(res => {
        dispatch({
          type: C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log(e));
};

export const getVRYouTubeChannelData = () => {
  return async dispatch =>
    await ytube
      .getChannelsLatestVideos(vrYouTubeChanneID, 50)
      .then(res => {
        dispatch({
          type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
          payload: res.latest
        });
      })
      .catch(e => console.log(e));
};

export const setWindow = Window => ({
  type: C.SET_WINDOW,
  payload: Window
});

export const login = (username, password, rememberMe) => {
  return async dispatch =>
    await Axios()
      .post("login/", qs.stringify({ username, password }))
      .then(res => {
        const eightHours = 1 / 3;
        rememberMe
          ? Cookies.set("User_LoginToken", res.data.token)
          : Cookies.set("User_LoginToken", res.data.token, {
              expires: eightHours
            });
        dispatch({
          type: C.SET_LOGIN_TOKEN,
          payload: res.data
        });
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
};

export const Logout = () => {
  Cookies.remove("User_LoginToken");
  return async dispatch => {
    await dispatch({
      type: C.SET_LOGOUT,
      payload: null
    });
    //window.location.reload()
  };
};

export const setApiResponse = response => {
  return async dispatch => {
    await dispatch({
      type: C.SET_API_RESPONSE,
      payload: response
    });
  };
};

export const clearApiResponse = () => {
  return async dispatch =>
    await dispatch({
      type: C.SET_API_RESPONSE,
      payload: null
    });
};

export const getUser = id => {
  return async dispatch =>
    await Axios()
      .get(`users/${id}/`)
      .then(res => {
        dispatch({
          type: C.GET_USER,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const refreshUser = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .get(`users/${id}/refresh/`)
      .then(res => {
        const { User } = getState();
        res.data.token = Cookies.get("User_LoginToken");
        // Add all the attributes the response doesn't have
        Object.keys(User).forEach(k => {
          if (res.data[k] === undefined) res.data[k] = User[k];
        });
        dispatch({
          type: C.SET_LOGIN_TOKEN,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const clearHtmlDocument = () => async dispatch =>
  await dispatch({
    type: C.GET_HTML_DOCUMENT,
    payload: null
  });

export const toggleFooter = toggle => dispatch =>
  dispatch({
    type: C.SHOW_FOOTER,
    payload: toggle
  });
