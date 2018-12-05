import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

export const getNewsletters = () => {
  return async (dispatch) =>
    await Axios()
      .get("newsletters/")
      .then(newsletters => {
            Axios()
              .get("newsletter/likes/")
              .then(likes => {
                let likeMap = new Map();
                for (let i = 0; i < likes.data.length; i++) {
                  const like = likes.data[i];
                  const { document_id, count } = like;
                  likeMap.has(document_id)
                    ? likeMap.set(document_id, likeMap.get(document_id) + count)
                    : likeMap.set(document_id, count);
                }
                Axios()
                  .get("newsletter/comments/")
                  .then(comments => {
                    let commentMap = new Map();
                    for (let i = 0; i < comments.data.length; i++) {
                      const comment = comments.data[i];
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
                    dispatch({
                      type: C.GET_NEWSLETTERS,
                      payload: newsletters.data
                    });
                  });
              })
      })
      .catch(e => console.log(e));
};

export const nextNewsletters = paginator => {
  return async (dispatch, getState) =>
    await Axios(null, paginator)
      .get()
      .then(res => {
        const { Newsletters } = getState();
        res.data.results = Newsletters.results.concat(res.data.results);
        dispatch({
          type: C.GET_NEWSLETTERS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const getNewsletter = id => {
  return async dispatch =>
    await Axios()
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
  return async dispatch =>
    await Axios()
      .get(`newsletters/${id}/view/`)
      .then(res => {
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
  return async (dispatch, getState) => {
    await Axios(token)
      .post("newsletters/", qs.stringify(payload))
      .then(res => {
        const { Newsletters } = getState();
        let payload = { ...Newsletters };
        payload.results.push(res.data);
        dispatch({
          type: C.GET_NEWSLETTERS,
          payload: payload
        });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: res
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
  return async (dispatch, getState) =>
    await Axios(token)
      .post(`newsletter/likes/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        payload.likes.push(res.data);
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: payload
        });
      })
      .catch(e => console.log(e));
};

export const updateNewsletterLike = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`newsletter/likes/${id}/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        const updatedIndex = payload.likes.findIndex(
          like => like.author === res.data.author
        );
        payload.likes[updatedIndex] = res.data;
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: HtmlDocument
        });
      })
      .catch(e => console.log(e));
};

export const postNewsletterComment = (token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .post(`newsletter/comments/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        payload.comments.unshift(res.data);
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
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`newsletter/comments/${id}/`)
      .then(res => {
        const { HtmlDocument } = getState();
        res.data = { ...HtmlDocument };
        res.data.comments = res.data.comments.filter(com => com.id !== id);
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res
        });
      })
      .catch(e => console.log(e));
};

export const updateNewsLetter = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`newsletters/${id}/`, qs.stringify(payload))
      .then(res => {
        let { Newsletters } = getState();
        const updatedIndex = Newsletters.results.findIndex(
          i => i.id === res.data.id
        );
        Newsletters.results[updatedIndex] = res.data;
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
        dispatch({
          type: C.GET_NEWSLETTERS,
          payload: Newsletters
        });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: res
        });
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
};

export const deleteNewsLetter = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`newsletters/${id}/`)
      .then(res => {
        const { Newsletters } = getState();
        res.data = { ...Newsletters };
        res.data.results = res.data.results.filter(
          article => article.id !== id
        );
        dispatch({
          type: C.GET_NEWSLETTERS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};
