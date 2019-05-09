import C from "../constants";
import { Axios } from "./Axios";
import { createMessageGroup } from "./Messages";
import qs from "qs";

const GetForm = (token, id) => dispatch => {
  Axios(token)
    .get(`/forms/${id}/`)
    .then(form => {
      dispatch({ type: C.GET_POLL, payload: form.data });
    })
    .catch(e => console.log(e, "token and id: ", token, id));
};

const GetFormQuestions = (token, pollId) => async dispatch =>
  await Axios(token)
    .get(`/form/questions/${pollId}/view/`)
    .then(questions => {
      dispatch({ type: C.GET_QUESTIONS, payload: questions.data });
      dispatch(GetQuestionChoices(token, questions.data));
    })
    .catch(e => console.log(e));

const GetQuestionChoices = (token, Questions) => async (dispatch, getState) => {
  let payload = [];
  for (let i = 0; i < Questions.length; i++) {
    const questionId = Questions[i].id;
    await Axios(token)
      .get(`/form/choices/${questionId}/view/`)
      .then(responses => {
        payload.push(responses.data);
        dispatch({
          type: C.GET_CHOICES,
          payload: payload.sort((a, b) => a[0].question_id - b[0].question_id)
        });
      })
      .catch(e => console.log(e, "GetQuestionChoices: ", Questions));
  }
  dispatch(GetChoiceResponses(token));
};

const GetChoiceResponses = token => async (dispatch, getState) => {
  const Choices = getState().Forms.Choices.flat(2);
  let payload = { results: [] };
  for (let i = 0; i < Choices.length; i++) {
    const choiceId = Choices[i].id;
    await Axios(token)
      .get(`/form/responses/${choiceId}/view/`)
      .then(responses => {
        payload.results.push(responses.data);
        dispatch({ type: C.GET_RESPONSES, payload: payload });
      })
      .catch(e => console.log(e, "GetChoiceResponses: ", Choices));
  }
};

const GetFormRecipients = (token, pollId) => async dispatch =>
  await Axios(token)
    .get(`/form/recipients/${pollId}/view/`)
    .then(recipients => {
      dispatch({ type: C.GET_RECIPIENTS, payload: recipients.data });
    })
    .catch(e => console.log(e));

const GetForms = token => dispatch => {
  dispatch({ type: C.GET_POLLS_LOADING });
  return Axios(token)
    .get("/forms/")
    .then(forms => {
      dispatch({ type: C.GET_POLLS_SUCCESS, payload: forms.data });
    })
    .catch(e => console.log(e));
};

const PostForm = (
  token,
  author,
  username,
  title,
  body,
  expiration_date,
  tags,
  Questions,
  Recipients
) => (dispatch, getState) => {
  const pollPayload = { author, title, expiration_date, tags };
  dispatch({ type: C.POST_POLLS_LOADING });
  const { Forms } = getState();
  let payload = { ...Forms };
  return Axios(token)
    .post("/forms/", qs.stringify(pollPayload))
    .then(form => {
      const { id } = form.data;

      payload.results.unshift(form.data);

      // dispatch({
      //   type: C.GET_POLLS_SUCCESS,
      //   payload: payload
      // });

      dispatch(PostQuestions(author, id, token, Questions));
      dispatch(PostRecipients(id, token, Recipients));

      const uri = `/forms/${id}/respond`;
      const MessageGroupRecipients = Recipients.map(r => r.recipient);
      dispatch(
        createMessageGroup(
          token,
          author,
          uri,
          MessageGroupRecipients,
          title,
          body
        )
      );
      dispatch({ type: C.POST_POLLS_SUCCESS });
    })
    .catch(e => console.log(e));
};

const PostQuestions = (author, form_id, token, Questions) => async (
  dispatch,
  getState
) => {
  let payload = getState().Forms.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { question, question_type, image, Choices, position } = Questions[i];
    const pollQuestionPayload = {
      author,
      question,
      question_type,
      image,
      form_id,
      position
    };

    await Axios(token)
      .post("form/questions/", qs.stringify(pollQuestionPayload))
      .then(question => {
        const question_id = question.data.id;
        payload.push(question.data);
        dispatch(PostChoices(author, question_id, token, Choices));
      })
      .catch(e => console.log(e, "pollQuestionPayload: ", pollQuestionPayload));
  }
  // dispatch({
  //   type: C.GET_QUESTIONS,
  //   payload: payload
  // });
};

const PostChoices = (author, question_id, token, Choices) => async (
  dispatch,
  getState
) => {
  let payload = [];
  for (let i = 0; i < Choices.length; i++) {
    const { title, position } = Choices[i];
    const choicePayload = { author, title, question_id, position };
    await Axios(token)
      .post("form/choices/", qs.stringify(choicePayload))
      .then(response => {
        // payload.push(response.data);
        // dispatch({ type: C.GET_CHOICES, payload: payload });
      })
      .catch(e => console.log(e, "choicePayload: ", choicePayload));
  }
};
const PostRecipients = (recipient_poll_id, token, Recipients) => async (
  dispatch,
  getState
) => {
  const payload = getState().Forms.Recipients;
  for (let i = 0; i < Recipients.length; i++) {
    const { recipient } = Recipients[i];
    const recipientPayload = { recipient, recipient_poll_id };
    await Axios(token)
      .post("form/recipients/", qs.stringify(recipientPayload))
      .then(res => {
        payload.push(res.data);
      })
      .catch(e => console.log(e, "recipientPayload: ", recipientPayload));
  }
  //dispatch({ type: C.GET_RECIPIENTS, payload: payload });
};

const PostResponse = (token, payload, question_type) => async (
  dispatch,
  getState
) => {
  const isText = question_type === "Text";

  if (isText) dispatch({ type: C.POST_RESPONSE_LOADING });
  return await Axios(token)
    .post("form/responses/", qs.stringify(payload))
    .then(response => {
      if (isText) dispatch({ type: C.POST_RESPONSE_SUCCESS });
      dispatch(GetChoiceResponses(token));
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

const EditResponse = (token, id, payload, question_type) => async (
  dispatch,
  getState
) => {
  dispatch({ type: C.POST_RESPONSE_LOADING });
  return await Axios(token)
    .patch(`form/responses/${id}/`, qs.stringify(payload))
    .then(response => {
      dispatch({ type: C.POST_RESPONSE_SUCCESS });
      dispatch(GetChoiceResponses(token));
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

const DeleteForm = (token, id) => async (dispatch, getState) => {
  const { Forms } = getState();
  let payload = { ...Forms };
  dispatch({ type: C.GET_POLLS_LOADING });
  return await Axios(token)
    .delete(`/forms/${id}/`)
    .then(res => {
      payload.results = payload.results.filter(r => r.id != id);
      dispatch({ type: C.GET_POLLS_SUCCESS, payload: payload });
    })
    .catch(e => console.log(e));
};

const UpdateForm = (
  pollId,
  token,
  author,
  username,
  title,
  body,
  expiration_date,
  tags,
  Questions,
  Recipients
) => async (dispatch, getState) => {
  const pollPayload = {
    author,
    title,
    last_modified_by: author,
    expiration_date,
    tags
  };

  dispatch({ type: C.UPDATE_POLLS_LOADING });
  const { Forms } = getState();
  let payload = { ...Forms };
  const currentQuestions = Forms.Questions;
  const questionsToPost = Questions.filter(q => !q.id);
  const questionsToUpdate = Questions.filter(q => q.id);
  const questionsToDelete = currentQuestions.filter(
    q => !Questions.some(e => e.id === q.id)
  );
  await Axios(token)
    .patch(`/forms/${pollId}/`, qs.stringify(pollPayload))
    .then(form => {
      const indexToUpdate = payload.results.findIndex(p => p.id === pollId);
      payload.Form = form.data;
      payload.results[indexToUpdate] = form.data;

      dispatch(PostQuestions(author, pollId, token, questionsToPost));

      dispatch(UpdateQuestions(author, pollId, token, questionsToUpdate));

      dispatch(DeleteQuestions(token, questionsToDelete));

      UpdateRecipients(pollId, token, Recipients);

      dispatch({ type: C.UPDATE_POLLS_SUCCESS, payload: payload });
    })
    .catch(e => console.log(e));
};

const UpdateQuestions = (author, form_id, token, Questions) => async (
  dispatch,
  getState
) => {
  const { Forms } = getState();
  const currentChoices = Forms.Choices;
  let payload = Forms.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { id, question, question_type, Choices, position } = Questions[i];
    const pollQuestionPayload = {
      author,
      question,
      question_type,
      form_id,
      last_modified_by: author,
      position
    };

    await Axios(token)
      .patch(`form/questions/${id}/`, qs.stringify(pollQuestionPayload))
      .then(question => {
        const question_id = question.data.id;
        const updateIndex = payload.findIndex(q => q.id === question.id);
        payload[updateIndex] = question.data;
        dispatch({ type: C.GET_QUESTIONS, payload: payload });
        dispatch(UpdateChoices(author, question_id, token, Choices, Questions));
      })
      .catch(e => console.log(e, "UpdateQuestions: ", pollQuestionPayload));
  }
};

const DeleteQuestions = (token, Questions) => async (dispatch, getState) => {
  let payload = getState().Forms.Questions;
  for (let i = 0; i < Questions.length; i++) {
    const { id } = Questions[i];
    await Axios(token)
      .delete(`form/questions/${id}/`)
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
  Questions
) => async (dispatch, getState) => {
  const currentChoices = getState()
    .Forms.Choices.flat(2)
    .filter(c => c.question_id === question_id);
  const choicesToPost = Choices.filter(c => !c.id);
  const choicesToUpdate = Choices.filter(q => q.id);
  const choicesToDelete = currentChoices.filter(
    c => !Choices.some(e => e.id === c.id)
  );
  dispatch(PostChoices(author, question_id, token, choicesToPost));
  dispatch(DeleteChoices(token, choicesToDelete));
  let payload = [...getState().Forms.Choices];

  for (let i = 0; i < choicesToUpdate.length; i++) {
    const { id, title, position } = choicesToUpdate[i];
    const choicePayload = {
      author,
      title,
      question_id,
      last_modified_by: author,
      position
    };
    await Axios(token)
      .patch(`form/choices/${id}/`, qs.stringify(choicePayload))
      .then(choice => {})
      .catch(e => console.log(e, "choicePayload: ", choicePayload));
  }
  dispatch(GetQuestionChoices(token, Questions));
};

const DeleteChoices = (token, Choices) => async (dispatch, getState) => {
  let payload = [...getState().Forms.Choices];
  for (let i = 0; i < Choices.length; i++) {
    const { id, title } = Choices[i];

    await Axios(token)
      .delete(`form/choices/${id}/`)
      .then(choice => {
        payload = payload.filter(c => c.id != choice.data.id);
        dispatch({ type: C.GET_CHOICES, payload: payload });
      })
      .catch(e => console.log("choicePayload: ", e));
  }
};

const UpdateRecipients = (recipient_poll_id, token, Recipients) => (
  dispatch,
  getState
) => {
  const currentRecipients = getState().Forms.Recipients;

  const recipientsToPost = Recipients.filter(
    r => !currentRecipients.some(e => e.recipient === r.recipient)
  );

  const recipientsToDelete = currentRecipients.filter(
    c => !Recipients.some(e => e.recipient === c.recipient)
  );

  dispatch(PostRecipients(recipient_poll_id, token, recipientsToPost));
  dispatch(deleteRecipients(token, recipientsToDelete));
};

const deleteRecipients = (token, Recipients) => async (dispatch, getState) => {
  const currentRecipients = getState().Forms.Recipients;
  let payload = [...currentRecipients];
  for (let i = 0; i < Recipients.length; i++) {
    const { id, recipient } = Recipients[i];
    await Axios(token)
      .delete(`form/recipients/${id}/`)
      .then(res => {
        payload = payload.filter(r => r.recipient != recipient);
        dispatch({ type: C.GET_RECIPIENTS, payload: payload });
      })
      .catch(e => console.log("deleteRecipients: ", e));
  }
};

const clearFormApi = () => ({ type: C.CLEAR_POLLS_API });

const clearResponses = () => ({ type: C.CLEAR_RESPONSES });

export {
  GetForm,
  GetFormQuestions,
  GetQuestionChoices,
  GetChoiceResponses,
  GetFormRecipients,
  GetForms,
  PostForm,
  PostQuestions,
  PostChoices,
  PostRecipients,
  PostResponse,
  EditResponse,
  DeleteForm,
  UpdateForm,
  UpdateQuestions,
  DeleteQuestions,
  UpdateChoices,
  DeleteChoices,
  deleteRecipients,
  clearFormApi,
  clearResponses
};
