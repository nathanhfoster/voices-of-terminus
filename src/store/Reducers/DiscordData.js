import C from "../../constants.js";

export const DiscordData = (state = {}, action) =>
  action.type === C.GET_GUILD_MEMBERS ? action.payload : state;
