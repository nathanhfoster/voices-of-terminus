import C from '../constants'
import {Axios} from './Axios'
import qs from 'qs'

export const getNewsletters = () => {
  return async (dispatch) => await Axios().get("newsletters/")
     .then(newsletters => {
       Axios().get('newsletter/likes/').then(likes => {
         let likeMap = new Map()
         for(let i = 0; i < likes.data.length; i++) {
           const like = likes.data[i]
           const {document_id, count} = like
           likeMap.has(document_id) ? likeMap.set(document_id, likeMap.get(document_id) + count) : likeMap.set(document_id, count)
         }
         Axios().get('newsletter/comments/').then(comments => {
          let commentMap = new Map()
          for(let i = 0; i < comments.data.length; i++) {
            const comment = comments.data[i]
            const {document_id} = comment
            commentMap.has(document_id) ? commentMap.set(document_id, commentMap.get(document_id) + 1) : commentMap.set(document_id, 1)
          }
          for(let i = 0; i < newsletters.data.length; i++) {
            newsletters.data[i].likeCount = likeMap.has(newsletters.data[i].id) ? likeMap.get(newsletters.data[i].id) : 0
            newsletters.data[i].commentCount = commentMap.has(newsletters.data[i].id) ? commentMap.get(newsletters.data[i].id) : 0
            newsletters.data[i].popularity = newsletters.data[i].views + newsletters.data[i].likeCount + newsletters.data[i].commentCount 
          }
          dispatch({
            type: C.GET_NEWSLETTERS,
            payload: newsletters.data
          })
         })
         
       })
     }).catch((e) => console.log(e))
}

export const getNewsletter = id => {
    return async (dispatch) => await Axios().get(`newsletters/${id}/`)
       .then(res => {
           dispatch ({
             type: C.GET_HTML_DOCUMENT,
             payload: res.data
            })
       }).catch((e) => console.log(e))
}

export const viewNewsletter = id => {
    return async (dispatch) => await Axios().get(`newsletters/${id}/view/`)
       .then(res => {
          Axios().get(`newsletter/likes/${id}/view/`).then(likes => {
            res.data.likes = likes.data
          Axios().get(`newsletter/comments/${id}/view/`).then(comments => {
            res.data.comments = comments.data
            dispatch ({
              type: C.GET_HTML_DOCUMENT,
              payload: res.data
            })
          })})
       }).catch((e) => console.log(e))
}

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

export const postNewsletterLike = (token, payload) => {
    return async (dispatch, getState) => await Axios(token).post(`newsletter/likes/`, qs.stringify(payload))
       .then(res => {
          let {HtmlDocument} = getState()
          HtmlDocument.likes.push(res.data)
          dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: HtmlDocument
          })
          dispatch({
            type: C.SET_API_RESPONSE,
            payload: res
          })
        }).catch((e) => console.log(e))
  }
  
  export const updateNewsletterLike = (id, token, payload) => {
    return async (dispatch, getState) => await Axios(token).patch(`newsletter/likes/${id}/`, qs.stringify(payload))
       .then(res => {
          let {HtmlDocument} = getState()
          const updatedIndex = HtmlDocument.likes.findIndex(like => like.author === res.data.author)
          HtmlDocument.likes[updatedIndex] = res.data
          dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: HtmlDocument
          })
        }).catch((e) => console.log(e))
  }

export const postNewsletterComment = (token, payload) => {
    return async (dispatch, getState) => await Axios(token).post(`newsletter/comments/`, qs.stringify(payload))
       .then(res => {
          let {HtmlDocument} = getState()
          HtmlDocument.comments.unshift(res.data)
          dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: HtmlDocument
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

export const deleteNewsletterComment = (id, token) => {
    return async (dispatch, getState) => await Axios(token).delete(`newsletter/comments/${id}/`)
    .then(res => {
        let {HtmlDocument} = getState()
        HtmlDocument.comments = HtmlDocument.comments.filter(com => com.id !== id)
        dispatch ({
          type: C.GET_HTML_DOCUMENT,
          payload: HtmlDocument
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
            type: C.GET_NEWSLETTERS,
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