import C from '../constants'
import axios from 'axios'
import YTube from 'ytube'
const youTubeKey = process.env.REACT_APP_YOUTUBE_API_KEY
const ytube = new YTube(youTubeKey)
const votYouTubeChanneID = process.env.REACT_APP_VOT_YOUTUBE_CHANNEL_ID
const vrYouTubeChanneID = process.env.REACT_APP_VR_YOUTUBE_CHANNEL_ID
const DISCORD_URL = process.env.REACT_APP_DISCORD_API_URL

export function setVoTYouTubeChannelData() {
    return (dispatch) => ytube.getChannelsLatestVideos(votYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.SET_VOT_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e)=>console.log(e))
}

export function setAllVRYouTube() {
    return (dispatch) => ytube.fetchAllYouTube("Voices of Terminus").then(res => {
        dispatch({
            type: C.SET_ALL_VR_YOUTUBE_CHANNEL_DATA,
            payload:res
        })
    }).catch((e)=>console.log(e))
}

export function setVRYouTubeChannelData() {
    return (dispatch) => ytube.getChannelsLatestVideos(vrYouTubeChanneID, 50)
        .then(res => {
            dispatch ({
                type: C.SET_VR_YOUTUBE_CHANNEL_DATA,
                payload: res.latest
            })
        }).catch((e)=>console.log(e))
}

export const setWindow = (Window) => ({
    type: C.SET_WINDOW,
    payload: Window
 })

 export function setGuildMembers() {
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
                type: C.SET_GUILD_MEMBERS,
                payload: payload
            })
        })
}