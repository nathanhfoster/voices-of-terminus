import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getTickets = () => {
  return dispatch => {
    Axios()
      .get(`tickets/`)
      .then(res => {
        dispatch({
          type: C.GET_TICKETS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const getTicket = (token, id) => {
  return dispatch => {
    Axios(token)
      .get(`tickets/${id}/`)
      .then(res => {
        dispatch({
          type: C.GET_TICKET,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const getUserTickets = (token, userId) => {
  return dispatch => {
    Axios(token)
      .get(`tickets/${userId}/view/`)
      .then(res => {
        dispatch({
          type: C.GET_USER_TICKETS,
          payload: res.data
        });
      })
      .catch(e => console.log(e));
  };
};

export const postTicket = (token, payload) => {
  return dispatch => {
    dispatch({ type: C.POST_TICKETS_LOADING });
    AxiosForm(token, payload)
      .post(`tickets/`, payload)
      .then(res => {
        dispatch({ type: C.POST_TICKETS_SUCCESS });
      })
      .catch(e => {
        dispatch({ type: C.POST_TICKETS_ERROR });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        });
      });
  };
};
