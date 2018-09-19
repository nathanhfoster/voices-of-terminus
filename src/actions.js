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