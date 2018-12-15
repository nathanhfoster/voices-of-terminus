import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const getMessages = (userId, token) => {
  let groupMap = {};
  return dispatch =>
    Axios(token)
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

export const postMessage = (token, recipient_group_id, recipients, payload) => (
  dispatch,
  getState
) => {
  const { messageDetails } = getState().Messages;
  let finalPayload = [...messageDetails];
  return Axios(token)
    .post("/messages/", qs.stringify(payload))
    .then(res => {
      const { id, author, parent_message_id } = res.data;
      for (let i = 0; i < recipients.length; i++) {
        const messageRecipientPayload = {
          recipient: recipients[i],
          recipient_group_id,
          message_id: id
        };

        Axios(token)
          .post("/message/recipients/", qs.stringify(messageRecipientPayload))
          .then(replyMessage => {
            const { recipient } = replyMessage.data;
            if (author === recipient) {
              finalPayload.push(res.data);
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

export const updateMessage = (id, token, payload) => {
  return (dispatch, getState) =>
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
};

export const createMessageGroup = (
  token,
  author,
  uri,
  recipients,
  title,
  body
) => {
  const groupPayload = { title, author, is_active: true, uri };
  const messagePayload = { author, body };
  return async (dispatch, getState) => {
    const { Messages } = getState();
    let payload = { ...Messages };
    return await Axios(token)
      .post("/user/groups/", qs.stringify(groupPayload))
      .then(group => {
        const recipient_group_id = group.data.id;
        //console.log("res.data: ", group.data);
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
};

export const getMessageDetails = (
  token,
  groupMessages,
  recipient_group_id
) => dispatch => {
  let payload = [];
  for (let i = 0; i < groupMessages.length; i++) {
    const { message_id } = groupMessages[i];
    Axios(token)
      .get(`/messages/${message_id}/`)
      .then(res => {
        res.data.recipient_group_id = recipient_group_id;
        payload.push(res.data);
        dispatch({
          type: C.GET_MESSAGE_DETAILS,
          payload: payload
        });
      })
      .catch(e => console.log(e));
  }
};

export const getGroupMessageRecipients = (
  token,
  recipient_group_id
) => dispatch => {
  Axios(token)
    .get(`/message/recipients/${recipient_group_id}/group/`)
    .then(res => {
      let payload = res.data.map(e => e.recipient_id);
      dispatch({
        type: C.GET_MESSAGE_RECIPIENTS,
        payload: payload
      });
    })
    .catch(e => console.log(e));
};
