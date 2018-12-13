import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getMessages = (userId, token) => {
  return dispatch =>
    Axios(token)
      .get(`/message/recipients/${userId}/view/`)
      .then(res => {
        dispatch({
          type: C.GET_MESSAGES,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
};

export const updateMessage = (id, token, payload) => {
  return (dispatch, getState) =>
    Axios(token)
      .patch(`/message/recipients/${id}/`, qs.stringify(payload))
      .then(res => {
        const { Messages } = getState();
        let payload = { ...Messages };
        const updatedIndex = payload.results.findIndex(
          message => message.id === res.data.id
        );
        payload.results[updatedIndex] = res.data;
        dispatch({
          type: C.GET_MESSAGES,
          payload: payload
        });
      })
      .catch(e => console.log(e));
};
