import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

export const getUserSettings = (token, UserId) => dispatch =>
  Axios(token)
    .get(`user/settings/${UserId}/view/`)
    .then(res => {
      dispatch({
        type: C.SET_USER_SETTINGS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

export const postSettings = (token, payload) => dispatch =>
  Axios(token)
    .post(`user/settings/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: C.SET_USER_SETTINGS,
        payload: res.data
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

export const setSettings = (token, id, payload) => dispatch =>
  Axios(token)
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: C.SET_USER_SETTINGS,
        payload: res.data
      });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
