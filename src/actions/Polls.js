import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const GetPoll = (token, id) => {
  return dispatch => {
    Axios(token)
      .get(`/polls/${id}/`)
      .then(poll => {
        dispatch({ type: C.GET_POLL, payload: poll.data });
      })
      .catch(e => console.log(e, "token and id: ", token, id));
  };
};

export const GetPollQuestions = (token, pollId) => {
  return (dispatch, getState) =>
    Axios(token)
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
      .catch(e => console.log(e, "GetQuestionChoices: ", Questions));
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
      .catch(e => console.log(e, "GetChoiceResponses: ", Choices));
  }
};

export const GetPollRecipients = (token, pollId) => {
  return dispatch =>
    Axios(token)
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

        const uri = `/polls/${id}/respond`;
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
    const { question, question_type, Choices, position } = Questions[i];
    const pollQuestionPayload = {
      author,
      question,
      question_type,
      poll_id,
      position
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
    const { title, position } = Choices[i];
    const choicePayload = { author, title, question_id, position };
    Axios(token)
      .post("poll/choices/", qs.stringify(choicePayload))
      .then(response => {
        // payload.push(response.data);
        // dispatch({ type: C.GET_CHOICES, payload: payload });
      })
      .catch(e => console.log(e, "choicePayload: ", choicePayload));
  }
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

export const DeletePoll = (token, id) => {
  return (dispatch, getState) => {
    const { Polls } = getState();
    let payload = { ...Polls };
    dispatch({ type: C.GET_POLLS_LOADING });
    Axios(token)
      .delete(`/polls/${id}/`)
      .then(res => {
        payload.results = payload.results.filter(r => r.id != id);
        dispatch({ type: C.GET_POLLS_SUCCESS, payload: payload });
      })
      .catch(e => console.log(e));
  };
};

export const UpdatePoll = (
  pollId,
  token,
  author,
  username,
  title,
  body,
  Questions,
  Recipients
) => {
  const pollPayload = { author, title, last_modified_by: author };
  return (dispatch, getState) => {
    dispatch({ type: C.UPDATE_POLLS_LOADING });
    const { Polls } = getState();
    let payload = { ...Polls };
    const currentQuestions = Polls.Questions;
    const questionsToPost = Questions.filter(q => !q.id);
    const questionsToUpdate = Questions.filter(q => q.id);
    // currentQuestions
    //   .filter(q => Questions.some(e => e.id === q.id))
    //   .map(q => {
    //     q.Choices = currentChoices.flat(2).filter(c => c.question_id === q.id);
    //     return q;
    //   });
    const questionsToDelete = currentQuestions.filter(
      q => !Questions.some(e => e.id === q.id)
    );
    //console.log("choicesToUpdate: ", choicesToUpdate);
    // console.log("Questions: ", Questions);
    //console.log("currentQuestions: ", currentQuestions);
    //console.log("questionsToPost: ", questionsToPost);
    //console.log("questionsToUpdate: ", questionsToUpdate);
    // console.log("questionsToDelete: ", questionsToDelete);
    Axios(token)
      .patch(`/polls/${pollId}/`, qs.stringify(pollPayload))
      .then(poll => {
        const indexToUpdate = payload.results.findIndex(p => p.id === pollId);
        payload.Poll = poll.data;
        payload.results[indexToUpdate] = poll.data;

        PostQuestions(
          author,
          pollId,
          token,
          questionsToPost,
          dispatch,
          getState
        );

        UpdateQuestions(
          author,
          pollId,
          token,
          questionsToUpdate,
          dispatch,
          getState
        );

        DeleteQuestions(token, questionsToDelete, dispatch, getState);

        UpdateRecipients(pollId, token, Recipients, dispatch, getState);

        dispatch({ type: C.UPDATE_POLLS_SUCCESS, payload: payload });
      })
      .catch(e => console.log(e));
  };
};

const UpdateQuestions = (
  author,
  poll_id,
  token,
  Questions,
  dispatch,
  getState
) => {
  const { Polls } = getState();
  const currentChoices = Polls.Choices;
  let payload = Polls.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { id, question, question_type, Choices, position } = Questions[i];
    const pollQuestionPayload = {
      author,
      question,
      question_type,
      poll_id,
      last_modified_by: author,
      position
    };

    Axios(token)
      .patch(`poll/questions/${id}/`, qs.stringify(pollQuestionPayload))
      .then(question => {
        const question_id = question.data.id;
        const updateIndex = payload.findIndex(q => q.id === question.id);
        payload[updateIndex] = question.data;
        dispatch({ type: C.GET_QUESTIONS, payload: payload });
        UpdateChoices(
          author,
          question_id,
          token,
          Choices,
          Questions,
          dispatch,
          getState
        );
      })
      .catch(e => console.log(e, "UpdateQuestions: ", pollQuestionPayload));
  }
};

const DeleteQuestions = (token, Questions, dispatch, getState) => {
  let payload = getState().Polls.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { id } = Questions[i];
    Axios(token)
      .delete(`poll/questions/${id}/`)
      .then(res => {
        payload = payload.filter(q => q.id != id);
        dispatch({ type: C.GET_QUESTIONS, payload: payload });
      })
      .catch(e => console.log("DeleteQuestions: ", e));
  }
};

const UpdateChoices = (
  author,
  question_id,
  token,
  Choices,
  Questions,
  dispatch,
  getState
) => {
  const currentChoices = getState()
    .Polls.Choices.flat(2)
    .filter(c => c.question_id === question_id);
  const choicesToPost = Choices.filter(c => !c.id);
  const choicesToUpdate = Choices.filter(q => q.id);
  const choicesToDelete = currentChoices.filter(
    c => !Choices.some(e => e.id === c.id)
  );
  // console.log("Choices: ", Choices);
  // console.log("currentChoices: ", currentChoices);
  // console.log("choicesToPost: ", choicesToPost);
  // console.log("choicesToUpdate: ", choicesToUpdate);
  // console.log("choicesToDelete: ", choicesToDelete);
  PostChoices(author, question_id, token, choicesToPost);
  DeleteChoices(token, choicesToDelete, dispatch, getState);
  let payload = [...getState().Polls.Choices];

  for (let i = 0; i < choicesToUpdate.length; i++) {
    const { id, title, position } = choicesToUpdate[i];
    const choicePayload = {
      author,
      title,
      question_id,
      last_modified_by: author,
      position
    };
    Axios(token)
      .patch(`poll/choices/${id}/`, qs.stringify(choicePayload))
      .then(choice => {
        // const updateIndex = payload.findIndex(c => c[0].id === choice.data.id);
        // if (updateIndex != -1) payload[updateIndex] = choice.data;
        // dispatch({ type: C.GET_CHOICES, payload: payload });
      })
      .catch(e => console.log(e, "choicePayload: ", choicePayload));
  }
  GetQuestionChoices(token, Questions, dispatch, getState);
};

const DeleteChoices = (token, Choices, dispatch, getState) => {
  let payload = [...getState().Polls.Choices];
  for (let i = 0; i < Choices.length; i++) {
    const { id, title } = Choices[i];

    Axios(token)
      .delete(`poll/choices/${id}/`)
      .then(choice => {
        payload = payload.filter(c => c.id != choice.data.id);
        dispatch({ type: C.GET_CHOICES, payload: payload });
      })
      .catch(e => console.log("choicePayload: ", e));
  }
};

const UpdateRecipients = (
  recipient_poll_id,
  token,
  Recipients,
  dispatch,
  getState
) => {
  const currentRecipients = getState().Polls.Recipients;

  const recipientsToPost = Recipients.filter(
    r => !currentRecipients.some(e => e.recipient === r.recipient)
  );

  const recipientsToDelete = currentRecipients.filter(
    c => !Recipients.some(e => e.recipient === c.recipient)
  );

  // console.log("Recipients: ", Recipients);
  // console.log("currentRecipients: ", currentRecipients);
  // console.log("recipientsToPost: ", recipientsToPost);
  // console.log("recipientsToDelete: ", recipientsToDelete);

  PostRecipients(recipient_poll_id, token, recipientsToPost, getState);
  deleteRecipients(token, recipientsToDelete, dispatch, getState);
};

const deleteRecipients = (token, Recipients, dispatch, getState) => {
  const currentRecipients = getState().Polls.Recipients;
  let payload = [...currentRecipients];
  for (let i = 0; i < Recipients.length; i++) {
    const { id, recipient } = Recipients[i];
    Axios(token)
      .delete(`poll/recipients/${id}/`)
      .then(res => {
        payload = payload.filter(r => r.recipient != recipient);
        dispatch({ type: C.GET_RECIPIENTS, payload: payload });
      })
      .catch(e => console.log("deleteRecipients: ", e));
  }
};

export const clearPollsApi = () => dispatch =>
  dispatch({ type: C.CLEAR_POLLS_API });

export const clearResponses = () => dispatch =>
  dispatch({ type: C.CLEAR_RESPONSES });
