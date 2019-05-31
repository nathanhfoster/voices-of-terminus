import C from "../constants";
import { Axios } from ".";
import Cookies from "js-cookie";
import qs from "qs";
import { GetUserPermissions } from "../helpers";

const setWindow = Window => ({
  type: C.SET_WINDOW,
  payload: Window
});

const login = (username, password, rememberMe) => dispatch =>
  Axios()
    .post("login/", qs.stringify({ username, password }))
    .then(res => {
      const { id, token } = res.data;
      const eightHours = 1 / 3;
      rememberMe
        ? Cookies.set("User_LoginToken", res.data.token)
        : Cookies.set("User_LoginToken", res.data.token, {
            expires: eightHours
          });
      dispatch({
        type: C.SET_LOGIN_TOKEN,
        payload: res.data
      });
      dispatch(refreshPatchUser(token, id));
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

const Logout = () => dispatch => {
  Cookies.remove("User_LoginToken");
  return dispatch({
    type: C.SET_LOGOUT,
    payload: null
  });
};

const ResetRedux = () => dispatch => dispatch({ type: C.RESET_REDUX });

const setApiResponse = response => ({
  type: C.SET_API_RESPONSE,
  payload: response
});

const clearApiResponse = () => ({
  type: C.SET_API_RESPONSE,
  payload: null
});

const setUser = User => ({
  type: C.GET_USER,
  payload: User
});

const getUser = id => dispatch =>
  Axios()
    .get(`users/${id}/`)
    .then(res => dispatch(getUserCharactersAndPermissions(res.data)))
    .catch(e => console.log(e));

const getUserCharactersAndPermissions = User => dispatch =>
  Axios()
    .get(`user/characters/${User.id}/view/`)
    .then(res => {
      User.Characters = res.data;
      User.permissions = GetUserPermissions(User.user_permissions);
      dispatch({
        type: C.GET_USER,
        payload: User
      });
    })
    .catch(e => console.log(e));

const refreshPatchUser = (token, id) => dispatch =>
  Axios(token)
    .get(`users/${id}/refresh/`)
    .then(res => {
      res.data.permissions = GetUserPermissions(res.data.user_permissions);
      Cookies.set("User_LastLogin", new Date());
      dispatch({
        type: C.SET_LOGIN_TOKEN,
        payload: res.data
      });
    })
    .catch(e =>
      e.response && e.response.status == 401
        ? dispatch({
            type: C.SET_LOGOUT,
            payload: null
          })
        : console.log(e)
    );

const setHtmlDocument = Document => ({
  type: C.GET_HTML_DOCUMENT,
  payload: Document
});

const clearHtmlDocument = () => ({ type: C.CLEAR_HTML_DOCUMENT });

export {
  setWindow,
  login,
  Logout,
  ResetRedux,
  setApiResponse,
  clearApiResponse,
  setUser,
  getUser,
  getUserCharactersAndPermissions,
  refreshPatchUser,
  setHtmlDocument,
  clearHtmlDocument
};
