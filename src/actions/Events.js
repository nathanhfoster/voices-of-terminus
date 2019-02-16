import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";
import { DeepCopy } from "../helpers";

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
        getEventGroupMembersCharacters(payload, dispatch);
      })
      .catch(e => console.log(e));
  }
};

const getEventGroupMembersCharacters = (GroupMembers, dispatch) => {
  let payload = DeepCopy(GroupMembers);
  const filledGroupMembers = GroupMembers.filter(m => m.filled);
  const filledMembers = filledGroupMembers.length > 0;
  if (filledMembers)
    for (let i = 0; i < filledGroupMembers.length; i++) {
      const { filled } = filledGroupMembers[i];
      Axios()
        .get(`characters/${filled}/`)
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
  else
    dispatch({
      type: C.GET_EVENT_GROUP_MEMBERS,
      payload: payload
    });
};

export const editEventGroupMember = (id, token, payload) => {
  return dispatch => {
    Axios(token)
      .patch(`calendar/event/group/members/${id}/`, qs.stringify(payload))
      .then(res => {
        const {
          event_group_id,
          filled,
          id,
          position,
          role_class_preferences
        } = res.data;
        Axios()
          .get(`calendar/event/groups/${event_group_id}/`)
          .then(res => {
            const { event_id } = res.data;
            getEventGroups(event_id, dispatch);
          })
          .catch(e =>
            dispatch({
              type: C.SET_API_RESPONSE,
              payload: e.response
            })
          );
        // const { GroupMembers } = getState().Events;
        // let groupMembersPayload = DeepCopy(GroupMembers);
        // const updateIndex = groupMembersPayload.findIndex(
        //   e => e.id === res.data.id
        // );
        // groupMembersPayload[updateIndex] = res.data;
      })
      .catch(e =>
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        })
      );
  };
};

export const postEvent = (userId, token, payload, groups) => {
  return (dispatch, getState) => {
    dispatch({ type: C.POST_EVENTS_LOADING });
    Axios(token)
      .post(`calendar/events/`, qs.stringify(payload))
      .then(res => {
        const { Users } = getState().Admin;
        const { id } = res.data;
        postEventGroups(token, id, groups, dispatch);
        const uri = `/calendar/event/${id}`;
        const recipients = Users.filter(u => u.lfg).map(u => u.id);
        const title = "New Event";
        const body =
          "We found an event match for you! Click the link button to view it.";
        createMessageGroup(
          token,
          userId,
          uri,
          recipients,
          title,
          body,
          dispatch,
          getState
        );
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
    const { role_class_preferences } = groupMembers[i];
    const payload = {
      event_group_id,
      position: i,
      role_class_preferences: role_class_preferences.map(i => i.value).join("|")
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

const createMessageGroup = (
  token,
  author,
  uri,
  recipients,
  title,
  body,
  dispatch,
  getState
) => {
  const groupPayload = { title, author, is_active: true, uri };
  const { Messages } = getState();
  let payload = { ...Messages };
  Axios(token)
    .post("/user/groups/", qs.stringify(groupPayload))
    .then(group => {
      const recipient_group_id = group.data.id;
      const messagePayload = {
        author,
        body,
        group_message_id: recipient_group_id
      };
      payload.results.unshift(group.data);
      payload.results[0].messages = new Array();

      Axios(token)
        .post("/messages/", qs.stringify(messagePayload))
        .then(message => {
          const message_id = message.data.id;

          for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i];
            const messagePayload = {
              recipient,
              recipient_group_id,
              message_id
            };
            Axios(token)
              .post("/message/recipients/", qs.stringify(messagePayload))
              .then(messageGroup => {
                payload.results[0].messages.unshift(messageGroup.data);
                dispatch({
                  type: C.GET_MESSAGES,
                  payload: payload
                });
              });
          }
        })
        .catch(e => console.log(e, "messagePayload: ", messagePayload));
    })
    .catch(e => console.log(e, "groupPayload: ", groupPayload));
};
