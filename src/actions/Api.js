import C from "../constants";
import YTube from "ytube";
import MomentJS from "moment";

const {
  REACT_APP_YOUTUBE_API_KEY,
  REACT_APP_TWITCH_CLIENT_ID,
  REACT_APP_VOT_YOUTUBE_CHANNEL_ID,
  REACT_APP_VR_YOUTUBE_CHANNEL_ID,
  REACT_APP_VOT_PLAYLIST_ID_SHOW
} = process.env;

const ytube = new YTube(REACT_APP_YOUTUBE_API_KEY);

/* If youtubeData exists ? update it if the latest video is 3 days old : else update it */
const shouldUpdate = lastApiCall => {
  const shouldUpdate = MomentJS().diff(MomentJS(lastApiCall), "hours") > 12;
  // console.log(lastApiCall);
  // console.log(shouldUpdate);
  return shouldUpdate;
};

const getVoTYouTubeChannelData = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VoTYouTubeChannelData;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsLatestVideos(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getVoTYouTubeChannelData: ", e))
  );
};

const getVotChannelsPlayLists = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotChannelsPlaylist;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsPlayLists(REACT_APP_VOT_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_VOT_CHANNELS_PLAYLISTS,
          payload: res
        });
      })
      .catch(e => console.log("getVotChannelsPlayLists: ", e))
  );
};

const getVotPlaylistShow = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotPlaylistShow;

  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getPlaylistVideos(REACT_APP_VOT_PLAYLIST_ID_SHOW, 50)
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_VOT_PLAYLIST_SHOW,
          payload: res
        });
      })
      .catch(e => console.log("getVotPlaylistShow: ", e))
  );
};

const getVotTwitchStreams = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotTwitchStreams;

  return (
    shouldUpdate(lastApiCall) &&
    fetch(
      `https://api.twitch.tv/kraken/channels/pantheon_vot/videos?broadcasts=true&limit=20&client_id=${REACT_APP_TWITCH_CLIENT_ID}`
    )
      .then(response => response.json())
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_VOT_TWITCH_STREAMS,
          payload: res
        });
      })
  );
};

const getAllVotYouTube = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VotAllYouTubeChannelData;
  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .fetchAllYouTube("Voices of Terminus")
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_ALL_VOT_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getAllVotYouTube: ", e))
  );
};

const getVRYouTubeChannelData = () => (dispatch, getState) => {
  const { lastApiCall } = getState().VRYouTubeChannelData;
  return (
    shouldUpdate(lastApiCall) &&
    ytube
      .getChannelsLatestVideos(REACT_APP_VR_YOUTUBE_CHANNEL_ID, 50)
      .then(res => {
        res.lastApiCall = new Date();
        dispatch({
          type: C.GET_VR_YOUTUBE_CHANNEL_DATA,
          payload: res
        });
      })
      .catch(e => console.log("getVRYouTubeChannelData: ", e))
  );
};

export {
  getVoTYouTubeChannelData,
  getVotChannelsPlayLists,
  getVotPlaylistShow,
  getVotTwitchStreams,
  getAllVotYouTube,
  getVRYouTubeChannelData
};
