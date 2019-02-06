import C from "../constants";
import axios from "axios";
const { REACT_APP_DISCORD_API_URL } = process.env;

export const getGuildMembers = () => {
  return dispatch =>
    axios
      .get(REACT_APP_DISCORD_API_URL)
      .then(res => res.data)
      .then(payload => {
        const discordMembers = Object.keys(payload.members).map(i => {
          payload.members[i].guildMember = false;
          if (
            payload.members[i].nick &&
            payload.members[i].nick.includes("VoT")
          ) {
            payload.members[i].guildMember = true;
          }
          // Remove '<VoT>'
          if (payload.members[i].nick)
            payload.members[i].nick = payload.members[i].nick
              .replace("<VoT>", "")
              .replace(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/, "");

          return payload.members[i];
        });
        payload.members = discordMembers.filter(i => i.guildMember);
        dispatch({
          type: C.GET_GUILD_MEMBERS,
          payload: payload
        });
      });
};
