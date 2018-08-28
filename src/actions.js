import C from './constants'

export const setUserLocation = (accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed, timestamp) => ({
    type: C.SET_USER_LOCATION,
    payload: {accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed, timestamp} 
 })

export const getUserLocation = () => (dispatch, getState) => 
    dispatch({ 
        type: C.GET_USER_LOCATION, 
        payload: getState().userLocation,
})