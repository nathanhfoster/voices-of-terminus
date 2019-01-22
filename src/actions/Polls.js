import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

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

export const PostPoll = (token, author, title, Questions, Recipients) => {
  const pollPayload = { author, title };
  return async (dispatch, getState) => {
    dispatch({ type: C.GET_POLLS_LOADING });
    const { Polls } = getState();
    let payload = { ...Polls };
    await Axios(token)
      .post("/polls/", qs.stringify(pollPayload))
      .then(poll => {
        const { id } = poll.data;

        payload.results.unshift(poll.data);

        dispatch({
          type: C.GET_POLLS_SUCCESS,
          payload: payload
        });

        PostQuestions(author, id, token, Questions, dispatch, getState);
        PostRecipients(id, token, Recipients, dispatch, getState);
      })
      .catch(e => console.log(e));
  };
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
    const { question, question_type, Responses } = Questions[i];
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
        payload.results.push(question.data);

        PostResponses(
          author,
          question_id,
          token,
          Responses,
          dispatch,
          getState
        );
      })
      .catch(e => console.log(e));
  }
  dispatch({
    type: C.GET_QUESTIONS,
    payload: payload
  });
};

const PostResponses = (
  author,
  question_id,
  token,
  Responses,
  dispatch,
  getState
) => {
  let payload = getState().Polls.Responses;
  for (let i = 0; i < Responses.length; i++) {
    const { response } = Responses[i];
    const responsePayload = { author, response, question_id };
    Axios(token)
      .post("poll/responses/", qs.stringify(responsePayload))
      .then(response => {
        payload.results.push(response.data);
      });
  }
  dispatch({ type: C.GET_RESPONSES, payload: payload });
};
const PostRecipients = (
  recipient_poll_id,
  token,
  Recipients,
  dispatch,
  getState
) => {
  const payload = getState().Polls.Recipients;
  for (let i = 0; i < Recipients.length; i++) {
    const { recipient } = Recipients[i];
    const recipientPayload = { recipient, recipient_poll_id };
    Axios(token)
      .post("poll/recipients/", qs.stringify(recipientPayload))
      .then(res => {
        payload.results.push(res.data);
      })
      .catch(e => console.log(e));
  }
  dispatch({ type: C.GET_RECIPIENTS, payload: payload });
};
