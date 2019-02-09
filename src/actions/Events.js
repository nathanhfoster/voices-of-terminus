import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { deepCopy } from "../helpers";

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

export const getEvent = eventId => {
  return (dispatch, getState) => {
    Axios()
      .get(`calendar/events/${eventId}/`)
      .then(res => {
        const { id } = res.data;
        dispatch({ type: C.GET_EVENT, payload: res.data });
        getEventGroups(id, dispatch);
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
  };
};

const getEventGroups = (eventId, dispatch) => {
  let Groups = [];
  Axios()
    .get(`calendar/event/groups/${eventId}/view/`)
    .then(res => {
      dispatch({ type: C.GET_EVENT_GROUPS, payload: res.data });
      for (let i = 0; i < res.data.length; i++) {
        const { id } = res.data[i];
        Groups = [...Groups, id];
      }
      getEventGroupMembers(Groups, dispatch);
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const getEventGroupMembers = (Groups, dispatch) => {
  let payload = [];

  for (let i = 0; i < Groups.length; i++) {
    const eventGroupId = Groups[i];
    
    Axios()
      .get(`calendar/event/group/members/${eventGroupId}/view/`)
      .then(res => {
        payload = [...payload, ...res.data];
        dispatch({
          type: C.GET_EVENT_GROUP_MEMBERS,
          payload: payload
        });
      })
      .catch(e => console.log(e));
  }
};

export const postEvent = (token, payload, groups) => {
  return dispatch => {
    dispatch({ type: C.POST_EVENTS_LOADING });
    Axios(token)
      .post(`calendar/events/`, qs.stringify(payload))
      .then(res => {
        const { id } = res.data;
        postEventGroups(token, id, groups, dispatch);
        dispatch({ type: C.POST_EVENTS_SUCCESS });
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
  };
};

const postEventGroups = (token, event_id, groups, dispatch) => {
  for (let i = 0; i < groups.length; i++) {
    const groupMembers = groups[i];
    const payload = { event_id, position: i };
    Axios(token)
      .post(`calendar/event/groups/`, qs.stringify(payload))
      .then(res => {
        const { id } = res.data;
        postEventGroupMembers(token, id, groupMembers, dispatch);
      })
      .catch(e => console.log(e, "postEventGroups: ", payload));
  }
};

const postEventGroupMembers = (
  token,
  event_group_id,
  groupMembers,
  dispatch
) => {
  for (let i = 0; i < groupMembers.length; i++) {
    const { role_preferences, class_preferences } = groupMembers[i];
    const payload = {
      event_group_id,
      position: i,
      role_preferences: role_preferences.map(i => i.value).join("|"),
      class_preferences: class_preferences.map(i => i.value).join("|")
    };
    Axios(token)
      .post(`calendar/event/group/members/`, qs.stringify(payload))
      .then(res => {})
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
    // .catch(e => console.log(e, "postEventGroupMembers: ", payload));
  }
};

export const clearEventsApi = () => dispatch =>
  dispatch({ type: C.CLEAR_EVENTS_API });
