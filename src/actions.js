import C from './constants'

export const setGuildMembers = (guildMembers) => ({
    type: C.SET_GUILD_MEMBERS,
    payload: guildMembers
 })

export const getGuildMembers = () => (dispatch, getState) => 
    dispatch({ 
        type: C.GET_GUILD_MEMBERS, 
        payload: getState().guildMembers,
})