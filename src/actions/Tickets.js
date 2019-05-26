import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

const getTickets = () => dispatch => {
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

const getTicket = (UserId, token, id) => dispatch => {
  Axios(token)
    .get(`tickets/${id}/`)
    .then(res => {
      const ticketId = res.data.id;
      const payload = { person_who_viewed: UserId };
      Axios(token)
        .patch(`tickets/${ticketId}/`, qs.stringify(payload))
        .then(ticket => {
          dispatch({
            type: C.GET_TICKET,
            payload: ticket.data
          });
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};

const getUserTickets = (token, userId) => dispatch => {
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

const postTicket = (token, payload) => dispatch => {
  dispatch({ type: C.POST_TICKETS_LOADING });
  return AxiosForm(token, payload)
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

const editTicket = (token, id, payload) => dispatch => {
  dispatch({ type: C.POST_TICKETS_LOADING });
  Axios(token)
    .patch(`tickets/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({ type: C.POST_TICKETS_SUCCESS });
      dispatch({
        type: C.GET_TICKET,
        payload: res.data
      });
    })
    .catch(e => {
      dispatch({ type: C.POST_TICKETS_ERROR });
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      });
    });
};

const getTicketNotes = (token, ticketId) => dispatch => {
  Axios(token)
    .get(`ticket/notes/${ticketId}/view/`)
    .then(res => {
      dispatch({
        type: C.GET_TICKET_NOTES,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const postTicketNote = (token, payload) => (dispatch, geState) =>
  Axios(token)
    .post(`ticket/notes/`, qs.stringify(payload))
    .then(res => {
      const { Notes } = geState().Admin.Ticket;
      const payload = [...Notes, { ...res.data }];
      dispatch({
        type: C.GET_TICKET_NOTES,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const getTicketStatusChanges = (token, ticketId) => dispatch => {
  Axios(token)
    .get(`ticket/statusChanges/${ticketId}/view/`)
    .then(res => {
      dispatch({
        type: C.GET_TICKET_STATUS_CHANGES,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const postTicketStatusChange = (token, payload) => (dispatch, geState) =>
  Axios(token)
    .post(`ticket/statusChanges/`, qs.stringify(payload))
    .then(res => {
      const { StatusChanges } = geState().Admin.Ticket;
      const payload = [...StatusChanges, { ...res.data }];
      dispatch({
        type: C.GET_TICKET_STATUS_CHANGES,
        payload: payload
      });
    })
    .catch(e => console.log(e));

export {
  getTickets,
  getTicket,
  getUserTickets,
  postTicket,
  editTicket,
  getTicketNotes,
  postTicketNote,
  getTicketStatusChanges,
  postTicketStatusChange
};
