import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { isSubset } from "../helpers";

export const getNewsletters = () => {
  return (dispatch, getState) => {
    dispatch({ type: C.GET_NEWSLETTERS_LOADING });
    Axios()
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
                    ? commentMap.set(
                        document_id,
                        commentMap.get(document_id) + 1
                      )
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
                const { Newsletters } = getState();
                const hasHtml = Newsletters.results.every(
                  newsletter => newsletter.html
                );
                if (
                  !hasHtml ||
                  !isSubset(
                    Newsletters.results.map(k => k.id),
                    newsletters.data.results.map(k => k.id)
                  ) ||
                  !isSubset(
                    Newsletters.results.map(k => k.last_modified),
                    newsletters.data.results.map(k => k.last_modified)
                  )
                ) {
                  dispatch({
                    type: C.GET_NEWSLETTERS_SUCCESS,
                    payload: newsletters.data
                  });
                }
              });
          });
      })
      .catch(e => dispatch({ type: C.GET_NEWSLETTERS_ERROR, payload: e }));
  };
};

export const nextNewsletters = paginator => {
  return (dispatch, getState) => {
    dispatch({ type: C.GET_NEWSLETTERS_LOADING });
    Axios(null, paginator)
      .get()
      .then(res => {
        const { Newsletters } = getState();
        res.data.results = Newsletters.results.concat(res.data.results);
        dispatch({
          type: C.GET_NEWSLETTERS_SUCCESS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const getNewslettersAllHtml = () => {
  console.log("getNewslettersAllHtml");
  return dispatch => {
    dispatch({ type: C.GET_NEWSLETTERS_LOADING });
    Axios()
      .get(`newsletters/allhtml/`)
      .then(res => {
        console.log("getNewslettersAllHtml done");
        dispatch({
          type: C.GET_NEWSLETTERS_SUCCESS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const getNewsletterHtml = id => {
  return (dispatch, getState) => {
    dispatch({ type: C.GET_NEWSLETTERS_LOADING });
    Axios()
      .get(`newsletters/${id}/html/`)
      .then(res => {
        const { id, html } = res.data;
        const { Newsletters } = getState();
        let payload = { ...Newsletters };
        const updatedIndex = payload.results.findIndex(
          newsletter => newsletter.id === id
        );
        payload.results[updatedIndex].html = html;
        dispatch({
          type: C.GET_NEWSLETTERS_SUCCESS,
          payload: payload
        });
      })
      .catch(e => console.log(e));
  };
};

export const getNewsletter = id => {
  return dispatch =>
    Axios()
      .get(`newsletters/${id}/`)
      .then(res => {
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const viewNewsletter = id => {
  return (dispatch, getState) =>
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
};

export const postNewsletter = (token, payload) => {
  return (dispatch, getState) => {
    dispatch({ type: C.POST_NEWSLETTERS_LOADING });
    Axios(token)
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
};

export const postNewsletterLike = (token, payload) => {
  return (dispatch, getState) =>
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
};

export const updateNewsletterLike = (id, token, payload) => {
  return (dispatch, getState) =>
    Axios(token)
      .patch(`newsletter/likes/${id}/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        const updatedIndex = payload.likes.results.findIndex(
          like => like.author === res.data.author
        );
        payload.likes.results[updatedIndex] = res.data;
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: payload
        });
      })
      .catch(e => console.log(e));
};

export const postNewsletterComment = (token, payload) => {
  return (dispatch, getState) =>
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
};

export const deleteNewsletterComment = (id, token) => {
  return (dispatch, getState) =>
    Axios(token)
      .delete(`newsletter/comments/${id}/`)
      .then(res => {
        const { HtmlDocument } = getState();
        res.data = { ...HtmlDocument };
        res.data.comments.results = res.data.comments.results.filter(
          com => com.id !== id
        );
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const updateNewsLetter = (id, token, payload) => {
  return (dispatch, getState) => {
    dispatch({ type: C.UPDATE_NEWSLETTERS_LOADING });
    Axios(token)
      .patch(`newsletters/${id}/`, qs.stringify(payload))
      .then(res => {
        const { Newsletters } = getState();
        let payload = { ...Newsletters };
        const updatedIndex = payload.results.findIndex(
          i => i.id === res.data.id
        );
        payload.results[updatedIndex] = res.data;
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
};

export const deleteNewsLetter = (id, token) => {
  return (dispatch, getState) =>
    Axios(token)
      .delete(`newsletters/${id}/`)
      .then(res => {
        const { Newsletters } = getState();
        res.data = { ...Newsletters };
        res.data.results = res.data.results.filter(
          article => article.id !== id
        );
        dispatch({
          type: C.GET_NEWSLETTERS_SUCCESS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const clearNewsletterApi = () => dispatch =>
  dispatch({ type: C.CLEAR_NEWSLETTERS_API });