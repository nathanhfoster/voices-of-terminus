import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

export const getYearMonthEvents = payload => {
  return dispatch => {
    dispatch({ type: C.GET_EVENTS_LOADING });
    Axios()
      .post(`calendar/events/view/`, qs.stringify(payload))
      .then(res => {
        dispatch({
          type: C.GET_EVENTS_SUCCESS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const postEvent = (token, payload) => {
  return (dispatch, getState) => {
    dispatch({ type: C.POST_EVENTS_LOADING });
    const { Events } = getState();
    let eventPayload = { ...Events };
    Axios(token)
      .post(`calendar/events/`, qs.stringify(payload))
      .then(res => {
        eventPayload.results.push(res.data);
        dispatch({
          type: C.POST_EVENTS_SUCCESS,
          payload: eventPayload
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

export const clearEventssApi = () => dispatch =>
  dispatch({ type: C.CLEAR_EVENTS_API });
