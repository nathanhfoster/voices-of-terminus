import C from '../constants'
import axios from 'axios'
import YTube from 'ytube'
const youTubeKey = "AIzaSyC6MMK9-cwILUqSJBDomKobEE30q_77CZ4"
const ytube = new YTube(youTubeKey)
const votYouTubeChanneID = "UCQ0BiIpfN9b5kUP8TA9eG1A"
const vrYouTubeChanneID = "UC4MbaiykerIrjKWRA6407tQ"
const DISCORD_URL = "https://discordapp.com/api/guilds/161500442088439808/widget.json"

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