import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import Cookies from "js-cookie";
import qs from "qs";

export const createUser = payload => dispatch => {
  const eightHours = 1 / 3;
  return AxiosForm(null, payload)
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

export const updateProfile = (id, token, payload) => dispatch => {
  dispatch({ type: C.UPDATE_USER_LOADING });
  return AxiosForm(token, payload)
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

export const getCharacters = (userId, token) => dispatch =>
  Axios(token)
    .get(`user/characters/${userId}/view/`)
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

export const postCharacter = (token, payload) => (dispatch, getState) => {
  Axios(token)
    .post(`user/characters/`, qs.stringify(payload))
    .then(res => {
      const { Characters } = getState().User;
      const characterPayload = [...[res.data], ...Characters];
      dispatch({
        type: C.GET_CHARACTERS,
        payload: characterPayload
      });
    })
    .catch(e => console.log(e, "postCharacter: ", payload));
};

export const editCharacter = (id, token, payload) => (dispatch, getState) => {
  Axios(token)
    .patch(`user/characters/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Characters } = getState().User;
      let characterPayload = [...Characters];
      const updateIndex = characterPayload.findIndex(e => e.id === res.data.id);
      characterPayload[updateIndex] = res.data;
      dispatch({
        type: C.GET_CHARACTERS,
        payload: characterPayload
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

export const deleteCharacter = (token, id) => (dispatch, getState) =>
  Axios(token)
    .delete(`user/characters/${id}/`)
    .then(res => {
      const { Characters } = getState().User;
      const payload = [...Characters].filter(c => c.id !== id);
      dispatch({
        type: C.GET_CHARACTERS,
        payload: payload
      });
    })
    .catch(e => console.log(e));

export const clearUserApi = () => ({
  type: C.CLEAR_USER_API
});
