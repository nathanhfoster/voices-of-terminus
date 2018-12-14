import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

const groupMessages = data => {
  let groupMap = new Map();
  for (let i = 0; i < data.results.length; i++) {
    const recipient = data.results[i];
    const { recipient_group_id, count } = recipient;
    groupMap.has(recipient_group_id)
      ? groupMap.set(
          recipient_group_id,
          new Array(...groupMap.get(recipient_group_id), recipient)
        )
      : groupMap.set(recipient_group_id, new Array(recipient));
  }
  return groupMap;
};

export const getMessages = (userId, token) => {
  return dispatch =>
    Axios(token)
      .get(`/message/recipients/${userId}/view/`)
      .then(res => {
        const groupMap = groupMessages(res.data);
        //console.log(groupMap, res.data);
        //res.data.results =
        //console.log([...groupMap.values()])
        //res.data.results = [...groupMap.values()]
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
