import C from "../constants";
import { Axios, AxiosForm } from "./Axios";
import qs from "qs";
/*
results: [
      {
        Questions: [
          { question: "", question_type: "", Responses: [{ response: "" }] }
        ],
        Recipients: []
      }
    ]
*/

export const PostPoll = (token, author, title, Questions, Recipients) => {
  const pollPayload = { author, title };
  return async dispatch => {
    return await Axios(token)
      .post("/polls/", qs.stringify(pollPayload))
      .then(poll => {
        poll.data.Questions = [];
        poll.data.Questions.Responses = [];
        poll.data.Recipients = [];
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
          Axios(token)
            .post("poll/questions/", qs.stringify(pollQuestionPayload))
            .then(question => {
              const question_id = question.data.id;
              for (let i = 0; i < Responses.length; i++) {
                const { response } = Responses[i];
                const responsePayload = { author, response, question_id };
                Axios(token)
                  .post("poll/responses/", qs.stringify(responsePayload))
                  .then(response => {
                    poll.data.Questions.Responses.push(response.data);
                  });
              }
              poll.data.Questions.push(question.data);
            })
            .catch(e => console.log(e));
        }

        for (let i = 0; i < Recipients.length; i++) {
          const { recipient } = Recipients[i];
          const recipientPayload = { recipient, recipient_poll_id };
          Axios(token)
            .post("poll/recipients/", qs.stringify(recipientPayload))
            .then(res => {
              poll.data.Recipients.push(res.data);
            })
            .catch(e => console.log(e));
        }
        dispatch({
          type: C.GET_POLLS_SUCCESS,
          payload: poll.data
        });
      })
      .catch(e => console.log(e));
  };
};
