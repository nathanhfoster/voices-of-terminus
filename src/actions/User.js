import C from '../constants'
import {Axios} from './Axios'
import Cookies from 'js-cookie'
const qs = require('qs')

 export const createUser = (username, password, email, bio, primary_role, primary_class) => {
    return async (dispatch) => await Axios.post('users/', qs.stringify({username, password, email, bio, primary_role, primary_class}))
    .then(res => {
        dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
        })
        Axios.post('login/', qs.stringify({username, password}))
        .then(res => {
            dispatch({
                type: C.SET_LOGIN_TOKEN,
                payload: res.data
             })
            //  dispatch({
            //     type: C.SET_API_RESPONSE,
            //     payload: res
            // })
        }).catch((e) => dispatch({
            type: C.SET_API_RESPONSE,
            payload: e.response
        }))
    })
    .catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const updateProfile = (id, payload) => {
    return async (dispatch) => await Axios.patch('users/' + id + '/', qs.stringify(payload))
    .then(res => {
        const {data} = res
        const dispatchPayload = {
            bio: data.bio,
            dateJoined: data.date_join,
            discordUrl: data.discord_url,
            email: data.email,
            firstName: data.first_name,
            id: data.id,
            isActive: data.is_active,
            isStaff: data.is_staff,
            isSuperUser: data.is_superuser,
            dateJoined: data.date_joined,
            lastLogin: data.last_login,
            lastName: data.last_name,
            primaryClass: data.primary_class,
            primaryRole: data.primary_role,
            profession: data.profession,
            professionSpecialization: data.profession_specialization,
            profileImage: data.profile_image,
            secondaryClass: data.secondary_class,
            secondaryRole: data.secondary_role,
            token: Cookies.get('User_LoginToken'),
            twitchUrl: data.twitch_url,
            twitterUrl: data.twitter_url,
            username: data.username,
            youtubeUrl: data.youtube_url,
            experiencePoints: data.experience_points
        }
        dispatch({
            type: C.SET_LOGIN_TOKEN,
            payload: dispatchPayload
         })
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: res
        })
    }).catch((e) => dispatch({
      type: C.SET_API_RESPONSE,
      payload: e.response
      }))
  }