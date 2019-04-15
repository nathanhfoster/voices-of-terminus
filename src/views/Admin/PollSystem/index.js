import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  FormGroup,
  InputGroup,
  FormControl,
  Button,
  ButtonToolbar,
  Checkbox,
  Radio,
  Image,
  Tabs,
  Tab
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import {
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  GetPolls,
  PostResponse,
  clearResponses,
  EditResponse,
  DeletePoll,
  clearPollsApi
} from "../../../actions/Polls";
import Moment from "react-moment";
import { withAlert } from "react-alert";
import { Redirect } from "react-router-dom";
import ConfirmAction from "../../../components/ConfirmAction";
import { UserHasPermissions } from "../../../helpers/userPermissions";

const mapStateToProps = ({ AuthenticationAndAuthorization, User, Polls }) => ({
  AuthenticationAndAuthorization,
  User,
  Polls
});

const mapDispatchToProps = {
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  GetPolls,
  PostResponse,
  clearResponses,
  EditResponse,
  DeletePoll,
  clearPollsApi
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
      GetPolls,
      clearPollsApi,
      match
    } = this.props;
    const { token } = User;
    const pollId = match.params.id;
    clearPollsApi();
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
    const {
      AuthenticationAndAuthorization,
      User,
      Polls,
      match,
      history
    } = props;
    const pollId = match.params.id;
    const { Poll, Questions, Choices, Responses, Recipients } = Polls;
    const { pathname } = history.location;
    const { expiration_date } = Poll;
    const expired = new Date(expiration_date) - new Date() < 0 ? true : false;
    this.setState({
      AuthenticationAndAuthorization,
      User,
      Polls,
      Poll,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId,
      eventKey: pathname,
      history,
      expired
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

  componentWillUnmount() {
    const { clearPollsApi, clearResponses } = this.props;
    clearPollsApi();
    clearResponses();
  }

  renderPolls = Polls => {
    const { User, DeletePoll } = this.props;
    const { AuthenticationAndAuthorization, history } = this.state;
    return Polls.map(p => {
      const {
        id,
        title,
        author_username,
        date_created,
        last_modified,
        expiration_date
      } = p;
      return (
        <Row
          className="borderedRow"
          key={id}
          onClick={() => history.push(`/polls/${id}`)}
        >
          <Col xs={8}>
            <h3>
              <i className="fas fa-heading" /> {title}
            </h3>
          </Col>
          <Col
            xs={4}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <ConfirmAction
              Action={e => DeletePoll(User.token, id)}
              Disabled={false}
              Icon={<i className="fas fa-trash" />}
              hasPermission={UserHasPermissions(
                AuthenticationAndAuthorization,
                User,
                "delete_poll"
              )}
              Class="pull-right"
              Title={title}
            />
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "change_poll"
            ) && (
              <Button
                onClick={e => {
                  e.stopPropagation();
                  history.push(`/poll/edit/${id}`);
                }}
                className="pull-right"
              >
                <i className="fa fa-pencil-alt" />
              </Button>
            )}
          </Col>
          <Col xs={12}>
            <h4>
              <i className="fas fa-user" /> {author_username}
            </h4>
          </Col>
          <Col xs={12}>
            <h4>
              <i className="far fa-clock" />{" "}
              <Moment fromNow>{date_created}</Moment>
            </h4>
          </Col>
          <Col xs={12}>
            <h4>
              <i className="fa fa-pencil-alt" />{" "}
              <Moment fromNow>{last_modified}</Moment>
            </h4>
          </Col>
          <Col xs={12}>
            <h4>
              <i className="fas fa-lock" />{" "}
              <Moment fromNow>{expiration_date}</Moment>
            </h4>
          </Col>
        </Row>
      );
    });
  };

  renderQuestions = (User, Questions, Choices, Responses, Recipients) => {
    const { eventKey, pollId, history, expired } = this.state;
    const isRecipient =
      Recipients.findIndex(e => User.id === e.recipient) != -1;
    return User.is_superuser || isRecipient ? (
      <Tabs
        defaultActiveKey={eventKey}
        activeKey={eventKey}
        className="Tabs"
        onSelect={eventKey => {
          this.setState({ eventKey });
          history.push(eventKey);
        }}
      >
        <Tab
          eventKey={`/polls/${pollId}/respond`}
          title={"Respond"}
          unmountOnExit={true}
        >
          {Questions.map((q, i) => {
            const { question, question_type, image } = q;
            return [
              <Row style={{ marginTop: 8 }}>
                <Col xs={12}>
                  <h4>
                    <i className="far fa-question-circle" /> {question}
                  </h4>
                </Col>
                {image && (
                  <Col xs={12}>
                    <Image src={image} height={250} />
                  </Col>
                )}
              </Row>,
              Choices.length > 0 && Choices[i]
                ? Choices[i].map(c => {
                    const { id, title, question_id } = c;
                    return (
                      <Row className="borderedRow noHover">
                        <Col xs={12}>
                          <FormGroup key={i}>
                            {this.switchQuestionChoices(
                              question_type,
                              id,
                              title,
                              User,
                              Choices[i],
                              Responses,
                              expired
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    );
                  })
                : null
            ];
          })}
        </Tab>
        <Tab
          eventKey={`/polls/${pollId}/results`}
          title={"Results"}
          unmountOnExit={true}
        >
          {Questions.map((q, i) => {
            const { question, question_type } = q;
            return [
              <h4>
                <i className="far fa-question-circle" /> {question}
              </h4>,
              Choices.length > 0 && Choices[i]
                ? Choices[i].map(c => {
                    const { id, title, question_id } = c;
                    return (
                      <Row className="borderedRow noHover">
                        <Col xs={12}>
                          <FormGroup key={i}>
                            {this.switchQuestionChoicesResponses(
                              question_type,
                              id,
                              title,
                              Responses
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    );
                  })
                : null
            ];
          })}
        </Tab>
      </Tabs>
    ) : (
      <h1>Sorry you are not a recipient to this poll</h1>
    );
  };

  switchQuestionChoices = (
    question_type,
    choiceId,
    title,
    User,
    Choices,
    Responses,
    expired
  ) => {
    const { PostResponse, EditResponse } = this.props;
    const usersResponses = Responses.results
      .flat(2)
      .filter(
        r => r.author === User.id && Choices.some(c => c.id === r.choice_id)
      );

    const responseIndex = usersResponses.findIndex(
      response => response.choice_id == choiceId
    );

    const usersResponse =
      responseIndex != -1 ? usersResponses[responseIndex] : {};
    let { id, response } = usersResponse;
    const checked = response === "true";

    let payload = {
      author: User.id,
      response: !checked,
      choice_id: choiceId
    };
    switch (question_type) {
      case "Multiple":
        return (
          <Checkbox
            disabled={expired}
            key={choiceId}
            checked={checked}
            onClick={() =>
              !response
                ? PostResponse(User.token, payload, question_type)
                : EditResponse(User.token, id, payload, question_type)
            }
          >
            <span className="checkBoxText">{title}</span>
          </Checkbox>
        );
      case "Select":
        return (
          <Radio
            disabled={
              (!checked && usersResponses.some(e => e.response === "true")) ||
              expired
            }
            name="radioGroup"
            key={choiceId}
            checked={checked}
            onClick={() =>
              !response
                ? PostResponse(User.token, payload)
                : EditResponse(User.token, id, payload)
            }
          >
            <span className="checkBoxText">{title}</span>
          </Radio>
        );
      case "Text":
        const {
          loading,
          loaded,
          posting,
          posted,
          updating,
          updated,
          error
        } = Responses;

        const stateResponse = this.state.response;
        payload.response = stateResponse;
        return (
          <InputGroup>
            <FormControl
              disabled={expired}
              value={
                stateResponse || stateResponse == "" ? stateResponse : response
              }
              componentClass="textarea"
              name="response"
              wrap="hard"
              type="textarea"
              placeholder="Response..."
              onChange={e => this.onChange(e)}
            />
            <InputGroup.Addon>
              <Button
                disabled={expired}
                onClick={() =>
                  !response
                    ? PostResponse(User.token, payload)
                    : EditResponse(User.token, id, payload)
                }
              >
                {posting && !posted
                  ? [<i className="fa fa-spinner fa-spin" />, " POST"]
                  : !posting && posted && !error
                  ? [
                      <i
                        className="fas fa-check"
                        style={{ color: "var(--color_emerald)" }}
                      />,
                      " SUBMIT"
                    ]
                  : error
                  ? [
                      <i
                        className="fas fa-times"
                        style={{ color: "var(--color_alizarin)" }}
                      />,
                      " SUBMIT"
                    ]
                  : "SUBMIT"}
              </Button>
            </InputGroup.Addon>
          </InputGroup>
        );
      case "Image":
        return [
          <Image src={response} className="ProfileImages" responsive rounded />,
          <FormControl
            disabled={expired}
            style={{ margin: "auto" }}
            type="file"
            label="File"
            onChange={e =>
              this.setImage(
                e,
                User.token,
                id,
                payload,
                response,
                PostResponse,
                EditResponse
              )
            }
          />
        ];
      default:
        return null;
    }
  };

  showStats = (userBoolResponsesStats, userResponses) => (
    <div className="responseStats">
      <span>
        {this.responsePercentage(userBoolResponsesStats, userResponses.length)}%
      </span>
      <span>
        {userBoolResponsesStats} / {userResponses.length}
      </span>
    </div>
  );

  responsePercentage = (numerator, denominator) => {
    if (numerator == 0 || denominator == 0) return 0;
    return (numerator / parseInt(denominator)) * 100;
  };

  switchQuestionChoicesResponses = (
    question_type,
    choiceId,
    title,
    Responses
  ) => {
    const userResponses = Responses.results
      .flat(2)
      .filter(r => r.choice_id == choiceId);

    const userBoolResponsesStats = userResponses.reduce(
      (total, r) => (r.response == "true" ? total + 1 : total),
      0
    );

    const userStringResponsesStats = userResponses.reduce(
      (total, r) =>
        r.response && r.response != "true" && r.response != "false"
          ? total + 1
          : total,
      0
    );

    switch (question_type) {
      case "Multiple":
        return (
          <Checkbox disabled={true} key={choiceId}>
            <span className="checkBoxText">{title}</span>
            {this.showStats(userBoolResponsesStats, userResponses)}
          </Checkbox>
        );
      case "Select":
        return (
          <Radio disabled={true} name="radioGroup" key={choiceId}>
            <span className="checkBoxText">{title}</span>
            {this.showStats(userBoolResponsesStats, userResponses)}
          </Radio>
        );
      case "Text":
        return (
          <InputGroup>
            <FormControl
              disabled={true}
              value={null}
              componentClass="textarea"
              name="response"
              wrap="hard"
              type="textarea"
              placeholder="Response..."
            />
            {this.showStats(userStringResponsesStats, userResponses)}
          </InputGroup>
        );
      case "Image":
        return [
          <Image
            src="https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png"
            className="ProfileImages"
            responsive
            rounded
          />,
          <FormControl
            disabled={true}
            style={{ margin: "auto" }}
            type="file"
            label="File"
          />,
          this.showStats(userStringResponsesStats, userResponses)
        ];
      default:
        return null;
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setImage = (e, token, id, payload, response, PostResponse, EditResponse) => {
    const { alert } = this.props;
    var file = e.target.files[0];
    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        payload.response = reader.result;
        !response
          ? PostResponse(token, payload)
          : EditResponse(token, id, payload);
      };
    }
  };

  render() {
    const {
      AuthenticationAndAuthorization,
      User,
      Polls,
      Poll,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId,
      eventKey,
      history
    } = this.state;
    const { title, expiration_date } = Poll;
    const expired = new Date(expiration_date) - new Date() < 0;
    return pollId &&
      !(
        eventKey.includes("respond") ||
        eventKey.includes("results") ||
        eventKey.includes("edit")
      ) ? (
      <Redirect to={`/polls/${pollId}/respond`} />
    ) : (
      <Grid className="PollSystem Container">
        <Row>
          <PageHeader className="pageHeader">POLLS</PageHeader>
        </Row>
        <Row>
          <h1 className="Center">{title}</h1>
        </Row>
        {pollId ? (
          <Row>
            <h3 className="Center">
              {expired
                ? ["Expired ", <Moment fromNow>{expiration_date}</Moment>]
                : ["Expires ", <Moment fromNow>{expiration_date}</Moment>]}
            </h3>
          </Row>
        ) : null}
        <Row className="ActionToolbarRow">
          <Col
            md={4}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_poll"
            ) && (
              <Button onClick={() => history.push("/poll/new/")}>
                <i className="fas fa-plus" /> Poll
              </Button>
            )}
            {pollId &&
              UserHasPermissions(
                AuthenticationAndAuthorization,
                User,
                "change_poll"
              ) && (
                <Button onClick={() => history.push(`/poll/edit/${pollId}`)}>
                  <i className="fa fa-pencil-alt" /> Poll
                </Button>
              )}
          </Col>
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
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(PollSystem)
);
