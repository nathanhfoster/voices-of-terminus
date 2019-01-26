import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Checkbox } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import {
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  GetPolls,
  PostResponse,
  EditResponse
} from "../../../actions/Polls";
import Moment from "react-moment";
import { switchPollTypeIcon } from "../../../helpers";

const mapStateToProps = ({ User, Polls }) => ({ User, Polls });

const mapDispatchToProps = {
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  GetPolls,
  PostResponse,
  EditResponse
};

class PollSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  componentDidMount() {
    const {
      User,
      GetPoll,
      GetPollQuestions,
      GetPollRecipients,
      GetPolls
    } = this.props;
    const { token } = User;
    const { pollId } = this.state;
    if (pollId) {
      GetPoll(token, pollId);
      GetPollQuestions(token, pollId);
      GetPollRecipients(token, pollId);
    } else {
      GetPolls(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Polls, match } = props;
    const pollId = match.params.id;
    const { Poll, Questions, Choices, Responses, Recipients } = Polls;
    this.setState({
      User,
      Polls,
      Poll,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId
    });
  };

  componentWillUpdate(nextProps, nextState) {
    const { User, GetPollQuestions } = nextProps;
    const currentPollId = this.state.pollId;
    const nextPollId = nextState.pollId;
    const { token } = User;

    if (currentPollId != nextPollId) {
      GetPoll(token, nextPollId);
      GetPollQuestions(token, nextPollId);
      GetPollRecipients(token, nextPollId);
    }
  }

  renderPolls = Polls =>
    Polls.map(p => {
      const { id, title, author_username, date_created, last_modified } = p;
      return (
        <Row
          className="borderedRow"
          key={id}
          onClick={() => this.props.history.push(`/polls/${id}`)}
        >
          <Col>
            <h1>
              <i className="fas fa-heading" /> {title}
            </h1>
          </Col>
          <Col>
            <h3>
              <i className="fas fa-user" /> {author_username}
            </h3>
          </Col>
          <Col>
            <h3>
              <i className="far fa-clock" />{" "}
              <Moment fromNow>{date_created}</Moment>
            </h3>
          </Col>
          <Col>
            <h3>
              <i className="fa fa-pencil-alt" />{" "}
              <Moment fromNow>{last_modified}</Moment>
            </h3>
          </Col>
        </Row>
      );
    });

  renderQuestions = (User, Questions, Choices, Responses, Recipients) => {
    const isRecipient = Recipients.findIndex(e => User.id == e.recipient) != -1;
    // console.log("Questions: ", Questions);
    // console.log("Choices: ", Choices);
    // console.log("Responses: ", Choices);
    // console.log("Recipients: ", Recipients);
    return isRecipient ? (
      Questions.map((q, i) => {
        const { question, question_type } = q;
        return (
          <Row>
            <h3>
              <i className="far fa-question-circle" /> {question}
            </h3>
            {Choices.length > 0 && Choices[i]
              ? Choices[i].map(c => {
                  const { id, title, response } = c;
                  return (
                    <Col xs={12}>
                      {this.switchQuestionChoices(
                        id,
                        question_type,
                        title,
                        User,
                        Responses
                      )}
                    </Col>
                  );
                })
              : null}
          </Row>
        );
      })
    ) : (
      <h1>Sorry you are not a recipient to this poll</h1>
    );
  };

  switchQuestionChoices = (choiceId, question_type, title, User, Responses) => {
    const { PostResponse, EditResponse } = this.props;
    const usersResponses = Responses.flat(2).filter(r => r.author == User.id);
    const responseIndex = usersResponses.findIndex(
      response => response.choice_id == choiceId
    );
    const usersResponse =
      responseIndex != -1 ? usersResponses[responseIndex] : {};
    const { id, response } = usersResponse;
    const checked = response === "true";
    const payload = {
      author: User.id,
      response: !checked,
      choice_id: choiceId
    };
    switch (question_type) {
      default:
        return (
          <Checkbox
            key={choiceId}
            checked={checked}
            onClick={() =>
              !response
                ? PostResponse(User.token, payload)
                : EditResponse(User.token, id, payload)
            }
          >
            <span className="checkBoxText">{title}</span>
          </Checkbox>
        );
    }
  };

  render() {
    const {
      User,
      Polls,
      Poll,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId
    } = this.state;
    return (
      <Grid className="PollSystem Container">
        <Row>
          <PageHeader className="pageHeader">
            {pollId ? `${Poll.title}` : `POLLS`}
          </PageHeader>
        </Row>
        {pollId
          ? this.renderQuestions(
              User,
              Questions,
              Choices,
              Responses,
              Recipients
            )
          : this.renderPolls(Polls.results)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PollSystem);
