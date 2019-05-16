import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { createMessageGroup } from "./Messages";
import { DeepCopy } from "../helpers";

const getYearMonthEvents = payload => dispatch => {
  dispatch({ type: C.GET_EVENTS_LOADING });
  return Axios()
    .post(`calendar/events/view/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: C.GET_EVENTS_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getEvent = eventId => async dispatch =>
  await Axios()
    .get(`calendar/events/${eventId}/`)
    .then(res => {
      const { id } = res.data;
      dispatch({ type: C.GET_EVENT, payload: res.data });
      dispatch(getEventGroups(id));
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

const getEventGroups = eventId => async dispatch => {
  let Groups = [];
  return await Axios()
    .get(`calendar/event/groups/${eventId}/view/`)
    .then(res => {
      dispatch({ type: C.GET_EVENT_GROUPS, payload: res.data });
      for (let i = 0; i < res.data.length; i++) {
        const { id } = res.data[i];
        Groups = [...Groups, id];
      }
      dispatch(getEventGroupMembers(Groups));
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const getEventGroupMembers = Groups => dispatch => {
  let payload = [];
  for (let i = 0; i < Groups.length; i++) {
    const eventGroupId = Groups[i];
    Axios()
      .get(`calendar/event/group/members/${eventGroupId}/view/`)
      .then(res => {
        payload = [...payload, ...res.data];
        dispatch(getEventGroupMembersCharacters(payload));
      })
      .catch(e => console.log(e));
  }
};

const getEventGroupMembersCharacters = GroupMembers => async dispatch => {
  let payload = DeepCopy(GroupMembers);
  const filledGroupMembers = GroupMembers.filter(m => m.filled);
  const filledMembers = filledGroupMembers.length > 0;
  if (filledMembers) {
    for (let i = 0; i < filledGroupMembers.length; i++) {
      const { filled } = filledGroupMembers[i];
      await Axios()
        .get(`user/characters/${filled}/`)
        .then(res => {
          const updateIndex = GroupMembers.findIndex(
            m => m.filled === res.data.id
          );
          payload[updateIndex].Response = res.data;
          dispatch({
            type: C.GET_EVENT_GROUP_MEMBERS,
            payload: payload
          });
        })
        .catch(e => console.log(e, "getEventGroupMembersCharacters: ", filled));
    }
  } else
    return dispatch({
      type: C.GET_EVENT_GROUP_MEMBERS,
      payload: payload
    });
};

const editEventGroupMember = (id, User, payload) => async dispatch => {
  const { Characters, token } = User;
  const endpoint = `calendar/event/group/members/${id}/`;
  return await Axios(token)
    .get(endpoint)
    .then(res => {
      const { event_group_id, filled } = res.data;
      const UsersCharacter = Characters.some(c => c.id === filled);
      if (UsersCharacter || !filled) {
        Axios(token)
          .patch(endpoint, qs.stringify(payload))
          .then(res => {
            const {
              event_group_id,
              filled,
              id,
              position,
              role_class_preferences
            } = res.data;
            Axios(token)
              .get(`calendar/event/groups/${event_group_id}/`)
              .then(res => {
                const { event_id } = res.data;
                dispatch(getEventGroups(event_id));
              })
              .catch(e =>
                dispatch({
                  type: C.SET_API_RESPONSE,
                  payload: e.response
                })
              );
          })
          .catch(e =>
            dispatch({
              type: C.SET_API_RESPONSE,
              payload: e.response
            })
          );
      } else {
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: { statusText: "Position has been filled" }
        });
        return Axios(token)
          .get(`calendar/event/groups/${event_group_id}/`)
          .then(res => {
            const { event_id } = res.data;
            dispatch(getEventGroups(event_id));
          })
          .catch(e =>
            dispatch({
              type: C.SET_API_RESPONSE,
              payload: e.response
            })
          );
      }
    });
};

const postEvent = (userId, token, payload, groups) => async (
  dispatch,
  getState
) => {
  dispatch({ type: C.POST_EVENTS_LOADING });
  return await Axios(token)
    .post(`calendar/events/`, qs.stringify(payload))
    .then(res => {
      const { Users } = getState().Admin;
      const { id } = res.data;
      dispatch(postEventGroups(token, id, groups));
      const uri = `/calendar/event/${id}`;
      const recipients = Users.filter(u => u.lfg).map(u => u.id);
      const title = "New Event";
      const body =
        "We found an event match for you! Click the link button to view it.";
      dispatch(createMessageGroup(token, userId, uri, recipients, title, body));
      dispatch({ type: C.POST_EVENTS_SUCCESS });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const postEventGroups = (token, event_id, groups) => async dispatch => {
  for (let i = 0; i < groups.length; i++) {
    const groupMembers = groups[i];
    const payload = { event_id, position: i };
    await Axios(token)
      .post(`calendar/event/groups/`, qs.stringify(payload))
      .then(res => {
        const { id } = res.data;
        dispatch(postEventGroupMembers(token, id, groupMembers));
      })
      .catch(e => console.log(e, "postEventGroups: ", payload));
  }
};

const postEventGroupMembers = (
  token,
  event_group_id,
  groupMembers
) => async dispatch => {
  for (let i = 0; i < groupMembers.length; i++) {
    const { role_class_preferences } = groupMembers[i];
    const payload = {
      event_group_id,
      position: i,
      role_class_preferences: role_class_preferences.map(i => i.value).join("|")
    };
    await Axios(token)
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

// TODO
const updateEvent = (userId, token, payload, groups) => async (
  dispatch,
  getState
) => {
  dispatch({ type: C.POST_EVENTS_LOADING });
  return await Axios(token)
    .post(`calendar/events/`, qs.stringify(payload))
    .then(res => {
      const { Users } = getState().Admin;
      const { id } = res.data;
      dispatch(postEventGroups(token, id, groups));
      const uri = `/calendar/event/${id}`;
      const recipients = Users.filter(u => u.lfg).map(u => u.id);
      const title = "New Event";
      const body =
        "We found an event match for you! Click the link button to view it.";
      dispatch(createMessageGroup(token, userId, uri, recipients, title, body));
      dispatch({ type: C.POST_EVENTS_SUCCESS });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

// TODO
const updateEventGroups = (token, event_id, groups) => async dispatch => {
  for (let i = 0; i < groups.length; i++) {
    const groupMembers = groups[i];
    const payload = { event_id, position: i };
    await Axios(token)
      .post(`calendar/event/groups/`, qs.stringify(payload))
      .then(res => {
        const { id } = res.data;
        dispatch(updateEventGroupMembers(token, id, groupMembers));
      })
      .catch(e => console.log(e, "postEventGroups: ", payload));
  }
};

// TODO
const updateEventGroupMembers = (
  token,
  event_group_id,
  groupMembers
) => async dispatch => {
  for (let i = 0; i < groupMembers.length; i++) {
    const { role_class_preferences } = groupMembers[i];
    const payload = {
      event_group_id,
      position: i,
      role_class_preferences: role_class_preferences.map(i => i.value).join("|")
    };
    await Axios(token)
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

const clearEventsApi = () => dispatch => dispatch({ type: C.CLEAR_EVENTS_API });

const deleteEvent = (eventId, token) => (dispatch, getState) =>
  Axios(token)
    .delete(`calendar/events/${eventId}/`)
    .then(res => {
      const { results } = getState().Events;
      let payload = DeepCopy(results);
      payload = payload.filter(e => e.id !== eventId);
      dispatch({ type: C.GET_EVENTS_SUCCESS, payload: payload });
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );

export {
  getYearMonthEvents,
  getEvent,
  getEventGroups,
  getEventGroupMembers,
  getEventGroupMembersCharacters,
  editEventGroupMember,
  postEvent,
  postEventGroups,
  postEventGroupMembers,
  clearEventsApi,
  deleteEvent
};
