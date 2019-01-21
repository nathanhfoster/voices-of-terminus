import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";

export const PostPoll = (token, author, title, Questions, Recipients) => {
  const pollPayload = { author, title };
  return async (dispatch, getState) => {
    const { Polls } = getState();
    let payload = { ...Polls };
    return await Axios(token)
      .post("/polls/", qs.stringify(pollPayload))
      .then(poll => {
        console.log("poll: ", poll.data);
        const poll_id = poll.data.id;
        const recipient_poll_id = poll.data.id;

        for (let i = 0; i < Questions.length; i++) {
          const { question, question_type, Responses } = Questions[i];
          const pollQuestionPayload = {
            author,
            question,
            question_type,
            poll_id
          };
          console.log("pollQuestionPayload: ", pollQuestionPayload);
          Axios(token)
            .post("poll/Questions/", qs.stringify(pollQuestionPayload))
            .then(question => {
              console.log("question: ", question.data);
              const question_id = question.data.id;
              for (let i = 0; i < Responses.length; i++) {
                const { response } = Responses[i];
                const responsePayload = { author, response, question_id };
                console.log("responsePayload: ", responsePayload);
                Axios(token)
                  .post("poll/responses/", qs.stringify(responsePayload))
                  .then(response => {
                    console.log("response: ", response);
                    payload.Questions.Responses.unshift(response.data);
                  });
              }
              payload.Questions.unshift(question.data);
            })
            .catch(e => console.log(e));
        }

        for (let i = 0; i < Recipients.length; i++) {
          const { recipient } = Recipients[i];
          const recipientPayload = { recipient, recipient_poll_id };
          console.log("recipientPayload: ", recipientPayload);
          Axios(token)
            .post("poll/recipients/", qs.stringify(recipientPayload))
            .then(res => {
              console.log("response: ", res.data);
              payload.Recipients.push(res.data);
            })
            .catch(e => console.log(e));
        }
        dispatch({
          type: C.GET_MESSAGES,
          payload: payload
        });
      })
      .catch(e => console.log(e));
  };
};
