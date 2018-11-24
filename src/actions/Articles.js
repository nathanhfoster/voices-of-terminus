import C from '../constants'
import {Axios} from './Axios'
import qs from 'qs'

export const getArticles = () => {
  return async (dispatch) => await Axios().get("articles/")
     .then(articles => {
       Axios().get('article/likes/').then(likes => {
         let likeMap = new Map()
         for(let i = 0; i < likes.data.length; i++) {
           const like = likes.data[i]
           const {document_id, count} = like
           likeMap.has(document_id) ? likeMap.set(document_id, likeMap.get(document_id) + count) : likeMap.set(document_id, count)
         }
         Axios().get('article/comments/').then(comments => {
          let commentMap = new Map()
          for(let i = 0; i < comments.data.length; i++) {
            const comment = comments.data[i]
            const {document_id} = comment
            commentMap.has(document_id) ? commentMap.set(document_id, commentMap.get(document_id) + 1) : commentMap.set(document_id, 1)
          }
          for(let i = 0; i < articles.data.length; i++) {
            articles.data[i].likeCount = likeMap.has(articles.data[i].id) ? likeMap.get(articles.data[i].id) : 0
            articles.data[i].commentCount = commentMap.has(articles.data[i].id) ? commentMap.get(articles.data[i].id) : 0
            articles.data[i].popularity =  articles.data[i].views + articles.data[i].likeCount +  articles.data[i].commentCount 
          }
          dispatch({
            type: C.GET_ARTICLES,
            payload: articles.data
          })
         })
         
       })
     }).catch((e) => console.log(e))
}

export const getArticle = id => {
  return async (dispatch) => await Axios().get(`articles/${id}/`)
     .then(res => {
         dispatch ({
           type: C.GET_HTML_DOCUMENT,
           payload: res.data
       })
     }).catch((e) => console.log(e))
}

export const viewArticle = id => {
  return async (dispatch) => await Axios().get(`articles/${id}/view/`)
     .then(res => {
        Axios().get(`article/likes/${id}/view/`).then(likes => {
          res.data.likes = likes.data
        Axios().get(`article/comments/${id}/view/`).then(comments => {
          res.data.comments = comments.data
          dispatch ({
            type: C.GET_HTML_DOCUMENT,
            payload: res.data
          })
        })})
     }).catch((e) => console.log(e))
}

export const postArticle = (token, payload) => {
  return async (dispatch, getState) => { await Axios(token).post('articles/', qs.stringify(payload))
    .then(res => {
      let {Articles} = getState()
      Articles.push(res.data)
      dispatch({
        type: C.GET_ARTICLES,
        payload: Articles
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

export const postArticleLike = (token, payload) => {
  return async (dispatch, getState) => await Axios(token).post(`article/likes/`, qs.stringify(payload))
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

export const updateArticleLike = (id, token, payload) => {
  return async (dispatch, getState) => await Axios(token).patch(`article/likes/${id}/`, qs.stringify(payload))
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

export const postArticleComment = (token, payload) => {
  return async (dispatch, getState) => await Axios(token).post(`article/comments/`, qs.stringify(payload))
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

export const deleteArticleComment = (id, token) => {
  return async (dispatch, getState) => await Axios(token).delete(`article/comments/${id}/`)
  .then(res => {
      let {HtmlDocument} = getState()
      HtmlDocument.comments = HtmlDocument.comments.filter(com => com.id !== id)
      dispatch ({
        type: C.GET_HTML_DOCUMENT,
        payload: HtmlDocument
      })
  }).catch((e) => console.log(e))
}

export const updateArticle = (id, token, payload) => {
  return async (dispatch, getState) => await Axios(token).patch(`articles/${id}/`, qs.stringify(payload))
  .then(res => {
    let {Articles} = getState()
    const updatedIndex = Articles.findIndex(i => i.id === res.data.id)
    Articles[updatedIndex] = res.data
    dispatch ({
      type: C.GET_HTML_DOCUMENT,
      payload: res.data
      })
      dispatch({
        type: C.GET_ARTICLES,
        payload: Articles
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

export const deleteArticle = (id, token) => {
  return async (dispatch, getState) => await Axios(token).delete(`articles/${id}/`)
  .then(res => {
      let {Articles} = getState()
      const reducedArticles = Articles.filter(article => article.id !== id)
      dispatch ({
        type: C.GET_ARTICLES,
        payload: reducedArticles
      })
  }).catch((e) => console.log(e))
}
