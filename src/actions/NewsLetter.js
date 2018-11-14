import C from '../constants'
import {Axios} from './Axios'
import qs from 'qs'

export const postNewsletter = (token, payload) => {
    return async (dispatch, getState) => { await  Axios(token).post('newsletters/', qs.stringify(payload))
      .then(res => {
          let {Newsletters} = getState()
          Newsletters.push(res.data)
          dispatch({
            type: C.GET_NEWSLETTERS,
            payload: Newsletters
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
}

export const getNewsletters = () => {
    return async (dispatch) => await Axios().get("newsletters/")
       .then(res => {
           dispatch ({
             type: C.GET_NEWSLETTERS,
             payload: res.data
            })
       }).catch((e) => console.log(e))
}

export const getNewsLetter = id => {
    return async (dispatch) => await Axios().get(`newsletters/${id}/`)
       .then(res => {
           dispatch ({
             type: C.GET_HTML_DOCUMENT,
             payload: res.data
            })
       }).catch((e) => console.log(e))
}

export const updateNewsLetter = (id, token, payload) => {
    return  async (dispatch, getState) => await Axios(token).patch(`newsletters/${id}/`, qs.stringify(payload))
    .then(res => {
        let {Newsletters} = getState()
        const updatedIndex = Newsletters.findIndex(i => i.id === res.data.id)
        Newsletters[updatedIndex] = res.data
        dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: res.data
        })
        dispatch({
            type: C.GET_ARTICLES,
            payload: Newsletters
          })
        dispatch ({
            type: C.SET_API_RESPONSE,
            payload: res
        })
    }).catch((e) => dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
    }))
}

export const deleteNewsLetter = (id, token) => {
    return async (dispatch, getState) => await Axios(token).delete(`newsletters/${id}/`)
    .then(res => {
        let {Newsletters} = getState()
        const payload = Newsletters.filter(newsletter => newsletter.id !== id)
        dispatch ({
            type: C.GET_NEWSLETTERS,
            payload: payload
        })
    }).catch((e) => console.log(e))
}