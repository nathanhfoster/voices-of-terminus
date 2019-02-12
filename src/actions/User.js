import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import Cookies from "js-cookie";
import qs from "qs";

export const createUser = payload => {
  const eightHours = 1 / 3;
  return dispatch =>
    AxiosForm(null, payload)
      .post("users/", payload)
      .then(res => {
        AxiosForm(null, payload)
          .post("login/", payload)
          .then(res => {
            Cookies.set("User_LoginToken", res.data.token, {
              expires: eightHours
            });
            dispatch({
              type: C.SET_LOGIN_TOKEN,
              payload: res.data
            });
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
};

export const updateProfile = (id, token, payload) => {
  return dispatch => {
    dispatch({ type: C.UPDATE_USER_LOADING });
    AxiosForm(token, payload)
      .patch(`users/${id}/`, payload)
      .then(res => {
        res.data.token = Cookies.get("User_LoginToken");
        dispatch({
          type: C.UPDATE_USER_SUCCESS,
          payload: res.data
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

export const getCharacters = (userId, token) => {
  return dispatch => {
    Axios(token)
      .get(`characters/${userId}/view/`)
      .then(res => {
        dispatch({
          type: C.GET_CHARACTERS,
          payload: res.data
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

export const clearUserApi = () => {
  return dispatch =>
    dispatch({
      type: C.CLEAR_USER_API
    });
};
