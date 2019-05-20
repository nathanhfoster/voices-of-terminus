import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

const getUserMessages = (userId, token) => dispatch => {
  let groupMap = {};
  return Axios(token)
    .get(`/message/recipients/${userId}/view/`)
    .then(res => {
      if (res.data.results <= 1)
        return dispatch({
          type: C.GET_MESSAGES,
          payload: res.data
        });
      for (let i = 0; i < res.data.results.length; i++) {
        const recipient = res.data.results[i];
        const { recipient_group_id } = recipient;
        Axios(token)
          .get(`user/groups/${recipient_group_id}/`)
          .then(group => {
            const {
              author,
              author_username,
              date_created,
              id,
              is_active,
              last_modified,
              title,
              uri
            } = group.data;
            if (!groupMap.hasOwnProperty(recipient_group_id)) {
              groupMap[recipient_group_id] = {
                author,
                author_username,
                date_created,
                id,
                is_active,
                last_modified,
                title,
                uri,
                messages: [recipient]
              };
            } else {
              groupMap[recipient_group_id].messages.push(recipient);
            }
            res.data.results = Object.values(groupMap).sort(
              (a, b) => new Date(b.date_created) - new Date(a.date_created)
            );
            const payload = { ...res.data };
            dispatch({
              type: C.GET_MESSAGES,
              payload: payload
            });
          })
          .catch(e => console.log(e));
      }
    })
    .catch(e => console.log(e));
};

const postMessage = (token, recipient_group_id, recipients, payload) => (
  dispatch,
  getState
) => {
  const { messageDetails } = getState().Messages;
  let finalPayload = { ...messageDetails };
  return Axios(token)
    .post("/messages/", qs.stringify(payload))
    .then(messageResponse => {
      const { id, author, group_message_id } = messageResponse.data;
      for (let i = 0; i < recipients.length; i++) {
        const messageRecipientPayload = {
          recipient: recipients[i],
          recipient_group_id,
          message_id: id,
          is_read: author == recipients[i] ? true : false
        };
        dispatch(
          postMessageRecipients(
            token,
            messageRecipientPayload,
            author,
            messageResponse,
            finalPayload
          )
        );
      }
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const postMessageRecipients = (
  token,
  payload,
  author,
  messageResponse,
  finalPayload
) => dispatch =>
  Axios(token)
    .post("/message/recipients/", qs.stringify(payload))
    .then(replyMessage => {
      const { recipient } = replyMessage.data;
      if (author == recipient) {
        finalPayload.results.unshift(messageResponse.data);
        dispatch({
          type: C.GET_MESSAGE_DETAILS,
          payload: finalPayload
        });
      }
    })
    .catch(e => {
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      });
      console.log("postMessageRecipients: ", payload);
    });

const updateMessage = (id, token, payload) => async (dispatch, getState) =>
  await Axios(token)
    .patch(`/message/recipients/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Messages } = getState();
      let payload = { ...Messages };
      const updatedIndex = [];
      for (let i = 0; i < payload.results.length; i++) {
        const group = payload.results[i];
        for (let j = 0; j < group.messages.length; j++) {
          const message = group.messages[j];
          if (message.id == res.data.id) {
            payload.results[i].messages[j] = res.data;
          }
        }
      }
      dispatch({
        type: C.GET_MESSAGES,
        payload: payload
      });
    })
    .catch(e => console.log(e));

const createMessageGroup = (
  token,
  author,
  uri,
  recipients,
  title,
  body
) => async (dispatch, getState) => {
  if (recipients.length < 1) return;
  const groupPayload = { title, author, is_active: true, uri };
  const { Messages } = getState();
  let payload = { ...Messages };
  return await Axios(token)
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

      dispatch(
        postMessage(token, recipient_group_id, recipients, messagePayload)
      );
    })
    .catch(e => console.log(e));
};

const getMessageDetails = (token, recipient_group_id) => dispatch => {
  Axios(token)
    .get(`/messages/${recipient_group_id}/view/`)
    .then(res => {
      dispatch({
        type: C.GET_MESSAGE_DETAILS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));
};

const getGroupMessageRecipients = (token, recipient_group_id) => dispatch =>
  Axios(token)
    .get(`/message/recipients/${recipient_group_id}/group/`)
    .then(res => {
      dispatch({
        type: C.GET_MESSAGE_RECIPIENTS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const deleteMessageRecipient = (token, userId, id) => dispatch =>
  Axios(token)
    .delete(`/message/recipients/${id}/`)
    .then(res => dispatch(getUserMessages(userId, token)))
    .catch(e => console.log(e));

export {
  getUserMessages,
  postMessage,
  updateMessage,
  createMessageGroup,
  getMessageDetails,
  getGroupMessageRecipients,
  deleteMessageRecipient
};
