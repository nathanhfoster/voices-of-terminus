import C from "../constants";
import { Axios } from "./Axios";
import qs from "qs";

const getUserMessages = (userId, token) => dispatch =>
  getMessages(userId, token, dispatch);

const getMessages = (userId, token, dispatch) => {
  let groupMap = {};
  return Axios(token)
    .get(`/message/recipients/${userId}/view/`)
    .then(res => {
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
            //mapCounter[dayOfTheYear] + 1 || 1
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
              groupMap[recipient_group_id].messages = [
                ...groupMap[recipient_group_id].messages,
                recipient
              ];
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
    .then(res => {
      const { id, author, group_message_id } = res.data;
      for (let i = 0; i < recipients.length; i++) {
        const messageRecipientPayload = {
          recipient: recipients[i],
          recipient_group_id,
          message_id: id,
          is_read: author === recipients[i] ? true : false
        };

        Axios(token)
          .post("/message/recipients/", qs.stringify(messageRecipientPayload))
          .then(replyMessage => {
            const { recipient } = replyMessage.data;
            if (author === recipient) {
              finalPayload.results.push(res.data);
              dispatch({
                type: C.GET_MESSAGE_DETAILS,
                payload: finalPayload
              });
            }
          })
          .catch(e => console.log(e));
      }
    })
    .catch(e =>
      dispatch({
        type: C.SET_API_RESPONSE,
        payload: e.response
      })
    );
};

const updateMessage = (id, token, payload) => (dispatch, getState) =>
  Axios(token)
    .patch(`/message/recipients/${id}/`, qs.stringify(payload))
    .then(res => {
      const { Messages } = getState();
      let payload = { ...Messages };
      const updatedIndex = [];
      for (let i = 0; i < payload.results.length; i++) {
        const group = payload.results[i];
        for (let j = 0; j < group.messages.length; j++) {
          const message = group.messages[j];
          if (message.id === res.data.id) {
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

      Axios(token)
        .post("/messages/", qs.stringify(messagePayload))
        .then(message => {
          const message_id = message.data.id;
          //console.log("message.data: ", message.data);

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
                //console.log("messageGroup.data: ", messageGroup.data);
                dispatch({
                  type: C.GET_MESSAGES,
                  payload: payload
                });
              });
          }
        })
        .catch(e => console.log(e));
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
    .then(res => getMessages(userId, token, dispatch))
    .catch(e => console.log(e));

export {
  getUserMessages,
  getMessages,
  postMessage,
  updateMessage,
  createMessageGroup,
  getMessageDetails,
  getGroupMessageRecipients,
  deleteMessageRecipient
};
