import C from './constants'

export const setWindow = (Window) => ({
    type: C.SET_WINDOW,
    payload: Window
 })

 export const getWindow = () => (dispatch, getState) => 
    dispatch({ 
        type: C.GET_WINDOW, 
        payload: getState().Window,
})

export const setGuildMembers = (guildMembers) => ({
    type: C.SET_GUILD_MEMBERS,
    payload: guildMembers
 })

export const getGuildMembers = () => (dispatch, getState) => 
    dispatch({ 
        type: C.GET_GUILD_MEMBERS, 
        payload: getState().guildMembers,
})