import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { isEquivalent } from "../helpers";

const getNewsletters = () => (dispatch, getState) => {
  dispatch({ type: C.GET_NEWSLETTERS_LOADING });
  return Axios()
    .get("newsletters/all/")
    .then(newsletters => {
      Axios()
        .get("newsletter/likes/")
        .then(likes => {
          let likeMap = new Map();
          for (let i = 0; i < likes.data.results.length; i++) {
            const like = likes.data.results[i];
            const { document_id, count } = like;
            likeMap.has(document_id)
              ? likeMap.set(document_id, likeMap.get(document_id) + count)
              : likeMap.set(document_id, count);
          }
          Axios()
            .get("newsletter/comments/")
            .then(comments => {
              let commentMap = new Map();
              for (let i = 0; i < comments.data.results.length; i++) {
                const comment = comments.data.results[i];
                const { document_id } = comment;
                commentMap.has(document_id)
                  ? commentMap.set(document_id, commentMap.get(document_id) + 1)
                  : commentMap.set(document_id, 1);
              }
              for (let i = 0; i < newsletters.data.results.length; i++) {
                newsletters.data.results[i].likeCount = likeMap.has(
                  newsletters.data.results[i].id
                )
                  ? likeMap.get(newsletters.data.results[i].id)
                  : 0;
                newsletters.data.results[i].commentCount = commentMap.has(
                  newsletters.data.results[i].id
                )
                  ? commentMap.get(newsletters.data.results[i].id)
                  : 0;
                newsletters.data.results[i].popularity =
                  newsletters.data.results[i].views +
                  newsletters.data.results[i].likeCount +
                  newsletters.data.results[i].commentCount;
              }
              dispatch({
                type: C.GET_NEWSLETTERS_SUCCESS,
                payload: newsletters.data
              });
            });
        });
    })
    .catch(e => dispatch({ type: C.GET_NEWSLETTERS_ERROR, payload: e }));
};

const nextNewsletters = paginator => (dispatch, getState) => {
  dispatch({ type: C.GET_NEWSLETTERS_LOADING });
  return Axios(null, paginator)
    .get()
    .then(res => {
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      payload.results = payload.results.concat(res.data.results);
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};

const getNewslettersAllHtml = () => dispatch => {
  dispatch({ type: C.GET_NEWSLETTERS_LOADING });
  return Axios()
    .get(`newsletters/allhtml/`)
    .then(res => {
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getNewsletterHtml = id => (dispatch, getState) => {
  dispatch({ type: C.GET_NEWSLETTERS_LOADING });
  return Axios()
    .get(`newsletters/${id}/html/`)
    .then(res => {
      const { id, html } = res.data;
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      const updatedIndex = payload.results.findIndex(
        newsletter => newsletter.id == id
      );
      if (updatedIndex != -1) payload.results[updatedIndex].html = html;
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};

const getNewsletter = id => (dispatch, getState) => {
  const { Newsletters } = getState();
  let cachedNewsletters = { ...Newsletters };
  const updatedIndex = cachedNewsletters.results.findIndex(
    newsletter => newsletter.id == id
  );
  dispatch({
    type: C.GET_HTML_DOCUMENT,
    payload: cachedNewsletters.results[updatedIndex]
  });
  return Axios()
    .get(`newsletters/${id}/`)
    .then(res => {
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const viewNewsletter = id => (dispatch, getState) =>
  Axios()
    .get(`newsletters/${id}/view/`)
    .then(res => {
      const { id } = res.data;
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      const NewsletterViewsIndex = payload.results.findIndex(k => k.id == id);
      if (NewsletterViewsIndex != -1) {
        payload.results[NewsletterViewsIndex] = res.data;
        dispatch({
          type: C.GET_NEWSLETTERS_SUCCESS,
          payload: payload
        });
      }
      Axios()
        .get(`newsletter/likes/${id}/view/`)
        .then(likes => {
          res.data.likes = likes.data;
          Axios()
            .get(`newsletter/comments/${id}/view/`)
            .then(comments => {
              res.data.comments = comments.data;
              dispatch({
                type: C.GET_HTML_DOCUMENT,
                payload: res.data
              });
            });
        });
    })
    .catch(e => console.log(e));

const postNewsletter = (token, payload) => (dispatch, getState) => {
  dispatch({ type: C.POST_NEWSLETTERS_LOADING });
  return Axios(token)
    .post("newsletters/", qs.stringify(payload))
    .then(res => {
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      payload.results.push(res.data);
      dispatch({ type: C.POST_NEWSLETTERS_SUCCESS });
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: payload
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const postNewsletterLike = (token, payload) => (dispatch, getState) =>
  Axios(token)
    .post(`newsletter/likes/`, qs.stringify(payload))
    .then(res => {
      const { HtmlDocument } = getState();
      let payload = { ...HtmlDocument };
      payload.likes.results.push(res.data);
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const updateNewsletterLike = (id, token, payload) => (dispatch, getState) =>
  Axios(token)
    .patch(`newsletter/likes/${id}/`, qs.stringify(payload))
    .then(res => {
      const { HtmlDocument } = getState();
      let payload = { ...HtmlDocument };
      const updatedIndex = payload.likes.results.findIndex(
        like => like.author == res.data.author
      );
      if (updatedIndex != -1) payload.likes.results[updatedIndex] = res.data;
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const postNewsletterComment = (token, payload) => (dispatch, getState) =>
  Axios(token)
    .post(`newsletter/comments/`, qs.stringify(payload))
    .then(res => {
      const { HtmlDocument } = getState();
      let payload = { ...HtmlDocument };
      payload.comments.results.unshift(res.data);
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: payload
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

const deleteNewsletterComment = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`newsletter/comments/${id}/`)
    .then(res => {
      const { HtmlDocument } = getState();
      res.data = { ...HtmlDocument };
      res.data.comments.results = res.data.comments.results.filter(
        com => com.id != id
      );
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const updateNewsLetter = (id, token, payload) => (dispatch, getState) => {
  dispatch({ type: C.UPDATE_NEWSLETTERS_LOADING });
  return Axios(token)
    .patch(`newsletters/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      const updatedIndex = payload.results.findIndex(i => i.id == res.data.id);
      if (updatedIndex != -1) payload.results[updatedIndex] = res.data;
      dispatch({ type: C.UPDATE_NEWSLETTERS_SUCCESS });
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: res.data
      });
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: payload
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const deleteNewsLetter = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`newsletters/${id}/`)
    .then(res => {
      const { Newsletters } = getState();
      let payload = { ...Newsletters };
      payload.count--;
      payload.results = payload.results.filter(
        newsletter => newsletter.id != id
      );
      dispatch({
        type: C.GET_NEWSLETTERS_SUCCESS,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const clearNewsletterApi = () => ({ type: C.CLEAR_NEWSLETTERS_API });

export {
  getNewsletters,
  nextNewsletters,
  getNewslettersAllHtml,
  getNewsletterHtml,
  getNewsletter,
  viewNewsletter,
  postNewsletter,
  postNewsletterLike,
  updateNewsletterLike,
  postNewsletterComment,
  deleteNewsletterComment,
  updateNewsLetter,
  deleteNewsLetter,
  clearNewsletterApi
};
