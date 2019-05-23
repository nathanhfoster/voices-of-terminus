import C from "../../constants.js";

const defaultState = {};

export const DiscordData = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.GET_GUILD_MEMBERS:
      return payload;
    case C.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
