import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { createMessageGroup } from "./Messages";

const getArticles = () => (dispatch, getState) => {
  dispatch({ type: C.GET_ARTICLES_LOADING });
  return Axios()
    .get("articles/all/")
    .then(articles => {
      Axios()
        .get("article/likes/")
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
            .get("article/comments/")
            .then(comments => {
              let commentMap = new Map();
              for (let i = 0; i < comments.data.results.length; i++) {
                const comment = comments.data.results[i];
                const { document_id } = comment;
                commentMap.has(document_id)
                  ? commentMap.set(document_id, commentMap.get(document_id) + 1)
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
                type: C.GET_ARTICLES_SUCCESS,
                payload: articles.data
              });
            });
        });
    })
    .catch(e => dispatch({ type: C.GET_ARTICLES_ERROR, payload: e }));
};

const nextArticles = paginator => (dispatch, getState) => {
  dispatch({ type: C.GET_ARTICLES_LOADING });
  return Axios(null, paginator)
    .get()
    .then(res => {
      const { Articles } = getState();
      res.data.results = Articles.results.concat(res.data.results);
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getArticlesAllHtml = () => dispatch => {
  dispatch({ type: C.GET_ARTICLES_LOADING });
  return Axios()
    .get(`articles/allhtml/`)
    .then(res => {
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getArticleHtml = id => (dispatch, getState) => {
  dispatch({ type: C.GET_ARTICLES_LOADING });
  return Axios()
    .get(`articles/${id}/html/`)
    .then(res => {
      const { id, html } = res.data;
      const { Articles } = getState();
      let payload = { ...Articles };
      const updatedIndex = payload.results.findIndex(
        article => article.id == id
      );
      payload.results[updatedIndex].html = html;
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};

const getArticle = id => dispatch =>
  Axios()
    .get(`articles/${id}/`)
    .then(res => {
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const viewArticle = id => (dispatch, getState) =>
  Axios()
    .get(`articles/${id}/view/`)
    .then(res => {
      const { id } = res.data;
      const { Articles } = getState();
      let payload = { ...Articles };
      const ArticleViewsIndex = payload.results.findIndex(k => k.id == id);
      if (ArticleViewsIndex != -1) {
        payload.results[ArticleViewsIndex] = res.data;
        dispatch({
          type: C.GET_ARTICLES_SUCCESS,
          payload: payload
        });
      }
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

const postArticle = (token, recipients, payload) => (dispatch, getState) => {
  dispatch({ type: C.POST_ARTICLES_LOADING });
  return Axios(token)
    .post("articles/", qs.stringify(payload))
    .then(res => {
      const { Articles } = getState();
      const { id, author, author_username, title } = res.data;
      const linkTitle = "Article Mention";
      const uri = `/view/article/${id}`;
      const body = `You were mentioned in the article "${title}" by ${author_username}.`;
      let payload = { ...Articles };
      payload.results.push(res.data);
      dispatch({ type: C.POST_ARTICLES_SUCCESS });
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
        payload: payload
      });
      dispatch(
        createMessageGroup(token, author, uri, recipients, linkTitle, body)
      );
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const postArticleLike = (token, payload) => (dispatch, getState) =>
  Axios(token)
    .post(`article/likes/`, qs.stringify(payload))
    .then(res => {
      const { HtmlDocument } = getState();
      let payload = { ...HtmlDocument };
      payload.likes.results.push(res.data);
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

const updateArticleLike = (id, User, payload) => (dispatch, getState) =>
  Axios(User.token)
    .patch(`article/likes/${id}/`, qs.stringify(payload))
    .then(res => {
      const { HtmlDocument } = getState();
      let payload = { ...HtmlDocument };
      const updatedIndex = payload.likes.results.findIndex(
        like => like.author == res.data.author
      );
      payload.likes.results[updatedIndex] = res.data;
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const postArticleComment = (token, payload) => (dispatch, getState) =>
  Axios(token)
    .post(`article/comments/`, qs.stringify(payload))
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

const deleteArticleComment = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`article/comments/${id}/`)
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

const updateArticle = (id, token, recipients, payload) => (
  dispatch,
  getState
) => {
  dispatch({ type: C.UPDATE_ARTICLES_LOADING });
  return Axios(token)
    .patch(`articles/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Articles } = getState();
      let payload = { ...Articles };
      const updatedIndex = payload.results.findIndex(i => i.id == res.data.id);
      payload.results[updatedIndex] = res.data;
      dispatch({ type: C.UPDATE_ARTICLES_SUCCESS });
      dispatch({
        type: C.GET_HTML_DOCUMENT,
        payload: res.data
      });
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
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

const deleteArticle = (id, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`articles/${id}/`)
    .then(res => {
      const { Articles } = getState();
      res.data = { ...Articles };
      res.data.results = res.data.results.filter(article => article.id != id);
      dispatch({
        type: C.GET_ARTICLES_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const clearArticlesApi = () => ({ type: C.CLEAR_ARTICLES_API });

export {
  getArticles,
  nextArticles,
  getArticlesAllHtml,
  getArticleHtml,
  getArticle,
  viewArticle,
  postArticle,
  postArticleLike,
  updateArticleLike,
  postArticleComment,
  deleteArticleComment,
  updateArticle,
  deleteArticle,
  clearArticlesApi
};
