import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

export const getArticles = () => {
  return async (dispatch, getState) =>
    await Axios()
      .get("articles/")
      .then(articles => {
        const { Articles } = getState();
        !Articles.count || articles.data.count != Articles.count
          ? Axios()
              .get("article/likes/")
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
                  .get("article/comments/")
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
                    for (let i = 0; i < articles.data.results.length; i++) {
                      articles.data.results[i].likeCount = likeMap.has(
                        articles.data.results[i].id
                      )
                        ? likeMap.get(articles.data.results[i].id)
                        : 0;
                      articles.data.results[i].commentCount = commentMap.has(
                        articles.data.results[i].id
                      )
                        ? commentMap.get(articles.data.results[i].id)
                        : 0;
                      articles.data.results[i].popularity =
                        articles.data.results[i].views +
                        articles.data.results[i].likeCount +
                        articles.data.results[i].commentCount;
                    }
                    dispatch({
                      type: C.GET_ARTICLES,
                      payload: articles.data
                    });
                  });
              })
          : null;
      })
      .catch(e => console.log(e));
};

export const nextArticles = paginator => {
  return async (dispatch, getState) =>
    await Axios(null, paginator)
      .get()
      .then(res => {
        const { Articles } = getState();
        res.data.results = Articles.results.concat(res.data.results);
        dispatch({
          type: C.GET_ARTICLES,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const getArticle = id => {
  return async dispatch =>
    await Axios()
      .get(`articles/${id}/`)
      .then(res => {
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const viewArticle = id => {
  return async dispatch =>
    await Axios()
      .get(`articles/${id}/view/`)
      .then(res => {
        Axios()
          .get(`article/likes/${id}/view/`)
          .then(likes => {
            res.data.likes = likes.data;
            Axios()
              .get(`article/comments/${id}/view/`)
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

export const postArticle = (token, payload) => {
  return async (dispatch, getState) => {
    await Axios(token)
      .post("articles/", qs.stringify(payload))
      .then(res => {
        const { Articles } = getState();
        let payload = { ...Articles };
        payload.results.push(res.data);
        dispatch({
          type: C.GET_ARTICLES,
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

export const postArticleLike = (token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .post(`article/likes/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        payload.likes.push(res.data);
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

export const updateArticleLike = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`article/likes/${id}/`, qs.stringify(payload))
      .then(res => {
        const { HtmlDocument } = getState();
        let payload = { ...HtmlDocument };
        const updatedIndex = payload.likes.findIndex(
          like => like.author === res.data.author
        );
        payload.likes[updatedIndex] = res.data;
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: payload
        });
      })
      .catch(e => console.log(e));
};

export const postArticleComment = (token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .post(`article/comments/`, qs.stringify(payload))
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

export const deleteArticleComment = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`article/comments/${id}/`)
      .then(res => {
        const { HtmlDocument } = getState();
        res.data = { ...HtmlDocument };
        res.data.comments = res.data.comments.filter(com => com.id !== id);
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const updateArticle = (id, token, payload) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .patch(`articles/${id}/`, qs.stringify(payload))
      .then(res => {
        let { Articles } = getState();
        const updatedIndex = Articles.results.findIndex(
          i => i.id === res.data.id
        );
        Articles.results[updatedIndex] = res.data;
        dispatch({
          type: C.GET_HTML_DOCUMENT,
          payload: res.data
        });
        dispatch({
          type: C.GET_ARTICLES,
          payload: Articles
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

export const deleteArticle = (id, token) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .delete(`articles/${id}/`)
      .then(res => {
        const { Articles } = getState();
        res.data = { ...Articles };
        res.data.results = res.data.results.filter(
          article => article.id !== id
        );
        dispatch({
          type: C.GET_ARTICLES,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};
