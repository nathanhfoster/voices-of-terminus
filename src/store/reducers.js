import { combineReducers } from "redux";

import { Admin } from "./Reducers/Admin";
import { ApiResponse } from "./Reducers/ApiResponse";
import { Articles } from "./Reducers/Articles";
import { AuthenticationAndAuthorization } from "./Reducers/AuthenticationAndAuthorization";
import { DiscordData } from "./Reducers/DiscordData";
import { editorState } from "./Reducers/editorState";
import { Events } from "./Reducers/Events";
import { Forms } from "./Reducers/Forms";
import { Galleries } from "./Reducers/Galleries";
import { HtmlDocument } from "./Reducers/HtmlDocument";
import { Messages } from "./Reducers/Messages";
import { Newsletters } from "./Reducers/Newsletters";
import { User } from "./Reducers/User";
import { VotAllYouTubeChannelData } from "./Reducers/VotAllYouTubeChannelData";
import { VotChannelsPlaylist } from "./Reducers/VotChannelsPlaylist";
import { VotPlaylistShow } from "./Reducers/VotPlaylistShow";
import { VotTwitchStreams } from "./Reducers/VotTwitchStreams";
import { VoTYouTubeChannelData } from "./Reducers/VoTYouTubeChannelData";
import { VRYouTubeChannelData } from "./Reducers/VRYouTubeChannelData";
import { Window } from "./Reducers/Window";

export const appReducer = combineReducers({
  Admin,
  ApiResponse,
  Articles,
  AuthenticationAndAuthorization,
  DiscordData,
  editorState,
  Events,
  Forms,
  Galleries,
  HtmlDocument,
  Messages,
  Newsletters,
  User,
  VotAllYouTubeChannelData,
  VotChannelsPlaylist,
  VotPlaylistShow,
  VotTwitchStreams,
  VoTYouTubeChannelData,
  VRYouTubeChannelData,
  Window
});
