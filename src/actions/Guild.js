import C from '../constants'
import axios from 'axios'
const DISCORD_URL = process.env.REACT_APP_DISCORD_API_URL

export function getGuildMembers() {
    return (dispatch) => axios.get(DISCORD_URL)
        .then(res => res.data)
        .then(payload => {
            const discordMembers = Object.keys(payload.members).map(i => { 
                payload.members[i].guildMember = false
                if(payload.members[i].nick && payload.members[i].nick.includes("VoT")) {
                    payload.members[i].guildMember = true
                }
                // Remove '<VoT>'
                payload.members[i].nick ? payload.members[i].nick = payload.members[i].nick.replace('<VoT>', '').replace(/[^\x00-\x7F]/g, '') : null
                return payload.members[i]
              })
              payload.members = discordMembers.filter(i => i.guildMember)
            dispatch ({
                type: C.GET_GUILD_MEMBERS,
                payload: payload
            })
        })
}