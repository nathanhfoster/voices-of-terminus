import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const GetPoll = (token, id) => {
  return async dispatch => {
    await Axios(token)
      .get(`/polls/${id}/`)
      .then(poll => {
        dispatch({ type: C.GET_POLL, payload: poll.data });
      })
      .catch(e => console.log(e, "token and id: ", token, id));
  };
};

export const GetPollQuestions = (token, pollId) => {
  return async (dispatch, getState) =>
    await Axios(token)
      .get(`/poll/questions/${pollId}/view/`)
      .then(questions => {
        dispatch({ type: C.GET_QUESTIONS, payload: questions.data });
        GetQuestionChoices(token, questions.data, dispatch, getState);
      })
      .catch(e => console.log(e));
};

const GetQuestionChoices = (token, Questions, dispatch, getState) => {
  let payload = [];
  for (let i = 0; i < Questions.length; i++) {
    const questionId = Questions[i].id;
    Axios(token)
      .get(`/poll/choices/${questionId}/view/`)
      .then(responses => {
        payload.push(responses.data);
        dispatch({
          type: C.GET_CHOICES,
          payload: payload.sort((a, b) => a[0].question_id - b[0].question_id)
        });
      })
      .catch(e => console.log(e));
  }
  GetChoiceResponses(token, dispatch, getState);
};

const GetChoiceResponses = (token, dispatch, getState) => {
  const Choices = getState().Polls.Choices.flat(2);
  let payload = { results: [] };
  for (let i = 0; i < Choices.length; i++) {
    const choiceId = Choices[i].id;
    Axios(token)
      .get(`/poll/responses/${choiceId}/view/`)
      .then(responses => {
        payload.results.push(responses.data);
        dispatch({ type: C.GET_RESPONSES, payload: payload });
      })
      .catch(e => console.log(e));
  }
};

export const GetPollRecipients = (token, pollId) => {
  return async dispatch =>
    await Axios(token)
      .get(`/poll/recipients/${pollId}/view/`)
      .then(recipients => {
        dispatch({ type: C.GET_RECIPIENTS, payload: recipients.data });
      })
      .catch(e => console.log(e));
};

export const GetPolls = token => {
  return dispatch => {
    dispatch({ type: C.GET_POLLS_LOADING });
    Axios(token)
      .get("/polls/")
      .then(polls => {
        dispatch({ type: C.GET_POLLS_SUCCESS, payload: polls.data });
      })
      .catch(e => console.log(e));
  };
};

export const PostPoll = (
  token,
  author,
  username,
  title,
  body,
  Questions,
  Recipients
) => {
  const pollPayload = { author, title };
  return (dispatch, getState) => {
    dispatch({ type: C.POST_POLLS_LOADING });
    const { Polls } = getState();
    let payload = { ...Polls };
    Axios(token)
      .post("/polls/", qs.stringify(pollPayload))
      .then(poll => {
        const { id } = poll.data;

        payload.results.unshift(poll.data);

        // dispatch({
        //   type: C.GET_POLLS_SUCCESS,
        //   payload: payload
        // });

        PostQuestions(author, id, token, Questions, dispatch, getState);
        PostRecipients(id, token, Recipients, getState);

        const uri = `/polls/${id}`;
        const recipients = Recipients.map(r => r.recipient);

        createMessageGroup(
          token,
          author,
          uri,
          recipients,
          title,
          body,
          dispatch,
          getState
        );
        dispatch({ type: C.POST_POLLS_SUCCESS });
      })
      .catch(e => console.log(e));
  };
};

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
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};

const PostQuestions = (
  author,
  poll_id,
  token,
  Questions,
  dispatch,
  getState
) => {
  let payload = getState().Polls.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { question, question_type, Choices } = Questions[i];
    const pollQuestionPayload = {
      author,
      question,
      question_type,
      poll_id
    };

    Axios(token)
      .post("poll/questions/", qs.stringify(pollQuestionPayload))
      .then(question => {
        const question_id = question.data.id;
        payload.push(question.data);

        PostChoices(author, question_id, token, Choices);
      })
      .catch(e => console.log(e, "pollQuestionPayload: ", pollQuestionPayload));
  }
  // dispatch({
  //   type: C.GET_QUESTIONS,
  //   payload: payload
  // });
};

const PostChoices = (author, question_id, token, Choices) => {
  let payload = [];
  for (let i = 0; i < Choices.length; i++) {
    const { title } = Choices[i];
    const responsePayload = { author, title, question_id };
    Axios(token)
      .post("poll/choices/", qs.stringify(responsePayload))
      .then(response => {
        payload.push(response.data);
      })
      .catch(e => console.log(e, "responsePayload: ", responsePayload));
  }
  //dispatch({ type: C.GET_CHOICES, payload: payload });
};
const PostRecipients = (recipient_poll_id, token, Recipients, getState) => {
  const payload = getState().Polls.Recipients;
  for (let i = 0; i < Recipients.length; i++) {
    const { recipient } = Recipients[i];
    const recipientPayload = { recipient, recipient_poll_id };
    Axios(token)
      .post("poll/recipients/", qs.stringify(recipientPayload))
      .then(res => {
        payload.push(res.data);
      })
      .catch(e => console.log(e, "recipientPayload: ", recipientPayload));
  }
  //dispatch({ type: C.GET_RECIPIENTS, payload: payload });
};

export const PostResponse = (token, payload, question_type) => {
  const isText = question_type === "Text";
  return (dispatch, getState) => {
    if (isText) dispatch({ type: C.POST_RESPONSE_LOADING });
    Axios(token)
      .post("poll/responses/", qs.stringify(payload))
      .then(response => {
        if (isText) dispatch({ type: C.POST_RESPONSE_SUCCESS });
        GetChoiceResponses(token, dispatch, getState);
      })
      .catch(e => {
        console.log(e, "PostResponse payload: ", payload);
        dispatch({ type: C.POST_RESPONSE_ERROR });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        });
      });
  };
};

export const EditResponse = (token, id, payload, question_type) => {
  return (dispatch, getState) => {
    dispatch({ type: C.POST_RESPONSE_LOADING });
    Axios(token)
      .patch(`poll/responses/${id}/`, qs.stringify(payload))
      .then(response => {
        dispatch({ type: C.POST_RESPONSE_SUCCESS });
        GetChoiceResponses(token, dispatch, getState);
      })
      .catch(e => {
        console.log(e, "EditResponse payload: ", payload);
        dispatch({ type: C.POST_RESPONSE_ERROR });
        dispatch({
          type: C.SET_API_RESPONSE,
          payload: e.response
        });
      });
  };
};

export const clearPollsApi = () => dispatch =>
  dispatch({ type: C.CLEAR_POLLS_API });

export const clearResponses = () => dispatch =>
  dispatch({ type: C.CLEAR_RESPONSES });
