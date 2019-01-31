import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  InputGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import ConfirmAction from "../ConfirmAction";
import Select from "react-select";
import { PollChoices, switchPollTypeIcon, statusLevelInt } from "../../helpers";
import { selectStyles } from "../../helpers/styles";
import { withRouter, Redirect } from "react-router-dom";
import { getUsers } from "../../actions/Admin";
import {
  PostPoll,
  clearPollsApi,
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  UpdatePoll
} from "../../actions/Polls";

const mapStateToProps = ({ User, Polls, Admin }) => ({ User, Polls, Admin });

const mapDispatchToProps = {
  getUsers,
  PostPoll,
  clearPollsApi,
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  UpdatePoll
};

class PollGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NewChoice: "",
      Polls: [],
      Questions: [
        {
          postion: 0,
          question: "",
          question_type: PollChoices[0].value,
          Choices: []
        }
      ],
      Recipients: [],
      selectOptions: []
    };
  }

  static propTypes = {};

  static defaultProps = {
    title: "",
    Questions: [
      {
        postion: 0,
        question: "",
        question_type: PollChoices[0].value,
        Choices: []
      }
    ]
  };

  focusInput = component => {
    if (component) {
      component.focus();
    }
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  componentDidMount() {
    const {
      getUsers,
      User,
      GetPoll,
      GetPollQuestions,
      GetPollRecipients,
      clearPollsApi,
      Polls,
      match
    } = this.props;
    const { token } = User;
    const pollId = match.params.id;
    const { Users } = this.props.Admin;
    let Recipients = [];
    getUsers();
    clearPollsApi();
    if (pollId) {
      GetPoll(token, pollId);
      GetPollQuestions(token, pollId);
      GetPollRecipients(token, pollId);
    } else {
      Recipients = Users
        ? Users.filter(i => i.id === User.id).map(
            e => (e = { value: e.id, label: e.username, isFixed: true })
          )
        : [];
      this.setState({ Recipients });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Questions, User, Admin, title, match, Polls } = props;
    const { Recipients } = Polls;
    const pollId = match.params.id;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];
    if (pollId) {
      this.pollPropToState(Polls, User.id, selectOptions);
    } else {
      this.setState({ Questions, selectOptions, title, Polls });
    }
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearPollsApi } = this.props;
    clearPollsApi();
  }

  pollPropToState = (Polls, userId, selectOptions) => {
    let { Poll, Questions, Choices, Recipients } = Polls;
    const { title } = Poll;
    Questions = Questions.map(
      (q, i) =>
        (q = {
          id: q.id,
          postion: i,
          question: q.question,
          question_type: q.question_type,
          Choices: Choices[i]
            ? Choices[i].map(
                (c, i) => (c = { id: c.id, postion: i, title: c.title })
              )
            : []
        })
    );

    Recipients = Recipients.map(
      r =>
        (r = {
          id: r.id,
          value: r.recipient,
          label: r.recipient_username,
          isFixed: r.recipient == userId
        })
    );
    this.setState({ Polls, title, Questions, Recipients, selectOptions });
  };

  onQuestionChange = e => {
    const { id, value } = e.target;
    let { Questions } = this.state;
    Questions[parseInt(id)].question = value;
    this.setState({ Questions });
  };

  onChoiceChange = (choiceIndex, e) => {
    const { id, value } = e.target;
    let { Questions } = this.state;

    Questions[parseInt(id)].Choices[choiceIndex].title = value;
    this.setState({ Questions });
  };

  addChoice = e => {
    const { id, value } = e.target;
    let { Questions } = this.state;
    const { length } = Questions[id].Choices;
    Questions[id].Choices.push({ postion: length, title: value });
    this.setState({ Questions });
  };

  onSelectFilterChange = (Recipients, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        Recipients = this.state.Recipients.filter(v => v.isFixed);
        break;
    }

    this.setState({ Recipients });
  };

  selectOnChange = (e, a, i) => {
    const { value } = e;
    let { Questions } = this.state;
    switch (a.action) {
      case "clear":
        Questions[i].question_type = "";
        return this.setState({ Questions });

      case "select-option":
        if (value == "Text" || value == "Image") {
          Questions[i].Choices.length = 0;
          Questions[i].Choices.push({ postion: 0, title: "" });
        }
        Questions[i].question_type = value;
        return this.setState({ Questions });
    }
  };

  renderQuestions = Questions =>
    Questions.map((q, i) => {
      const { NewChoice } = this.state;
      const { question_type, question, Choices } = q;
      return (
        <Row className="Questions Center borderedRow" key={i}>
          <Col xs={12}>
            <ControlLabel style={{ marginLeft: 32 }}>Question</ControlLabel>
            <ConfirmAction
              Action={e => {
                e.stopPropagation();
                this.deleteQuestion(i);
              }}
              Disabled={false}
              Icon={<i className="fa fa-trash-alt" />}
              hasPermission={true}
              Size="small"
              Class="pull-right"
              Title={question}
            />
          </Col>
          <Col md={9} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="far fa-question-circle" />
              </InputGroup.Addon>
              <FormControl
                id={`${i}`}
                key={i}
                value={question}
                question_type="text"
                placeholder="Enter question..."
                onChange={this.onQuestionChange}
                autoFocus={true}
              />
            </InputGroup>
          </Col>
          <Col md={3} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                {switchPollTypeIcon(question_type)}
              </InputGroup.Addon>
              <Select
                value={
                  question_type
                    ? { value: question_type, label: question_type }
                    : null
                }
                onChange={(e, a) => this.selectOnChange(e, a, i)}
                options={PollChoices}
                isClearable={false}
                isSearchable={false}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </InputGroup>
          </Col>
          <Col xs={12}>
            {this.switchPoll(question_type, Choices, NewChoice, i)}
          </Col>
        </Row>
      );
    });

  switchPoll = (question_type, Choices, NewChoice, i) => {
    switch (question_type) {
      case "Text":
        return (
          <FormGroup>
            <ControlLabel>Choice</ControlLabel>
            <FormControl
              question_type="text"
              placeholder="Text..."
              value={Choices[0].title}
              disabled
            />
          </FormGroup>
        );
      case "Image":
        return (
          <FormGroup>
            <ControlLabel>Image</ControlLabel>
            <FormControl
              disabled
              style={{ margin: "auto" }}
              type="file"
              label="File"
            />
          </FormGroup>
        );
      // Default is covers case: "Checkbox" || "Multiple"
      default:
        return (
          <FormGroup key={i}>
            <ControlLabel>Choices</ControlLabel>
            {this.renderChoices(Choices, i, question_type)}
            <InputGroup className="AddChoice">
              <InputGroup.Addon>
                {switchPollTypeIcon(question_type)}
              </InputGroup.Addon>
              <FormControl
                id={`${i}`}
                key={i}
                value={NewChoice}
                question_type="text"
                placeholder="Add a choice..."
                onChange={this.addChoice}
              />
            </InputGroup>
          </FormGroup>
        );
    }
  };

  renderChoices = (Choices, pollIndex, question_type) =>
    Choices.map((c, i) => {
      const { postion, title } = c;
      return (
        <InputGroup key={i}>
          <InputGroup.Addon>
            {switchPollTypeIcon(question_type)}
          </InputGroup.Addon>
          <FormControl
            id={`${pollIndex}`}
            value={title}
            question_type="text"
            placeholder={title}
            onChange={e => this.onChoiceChange(i, e)}
            autoFocus={postion == i}
          />
          <InputGroup.Addon>
            <ConfirmAction
              Action={e => {
                e.stopPropagation();
                this.deleteChoice(pollIndex, i);
              }}
              Disabled={false}
              Icon={<i className="fa fa-trash-alt" />}
              hasPermission={true}
              Size="small"
              Class="pull-right"
              Title={title}
            />
          </InputGroup.Addon>
        </InputGroup>
      );
    });

  deleteQuestion = index => {
    let { Questions } = this.state;
    delete Questions[index];
    this.setState({ Questions });
  };

  deleteChoice = (pollIndex, i) => {
    let { Choices } = this.state.Questions[pollIndex];
    delete Choices[i];
    this.setState({ Choices });
  };

  selectGuildRecipients = (User, Users) =>
    Users.filter(user => statusLevelInt(user) != 0)
      .map(
        i =>
          (i = {
            value: i.id,
            label: i.username,
            isFixed: i.id === User.id
          })
      )
      .sort((a, b) => a.label.localeCompare(b.label));

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { User, Admin, PostPoll, UpdatePoll, match } = this.props;
    const pollId = match.params.id;
    const {
      Polls,
      Questions,
      Recipients,
      selectOptions,
      title,
      body
    } = this.state;
    const {
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error
    } = Polls;
    return User.is_superuser || User.is_staff ? (
      <Grid className="PollGenerator Container">
        <Row className="ActionToolbarRow">
          <Col
            md={4}
            xs={12}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button
              onClick={e =>
                PostPoll(
                  User.token,
                  User.id,
                  User.username,
                  title,
                  body,
                  Questions,
                  Recipients.map(r => (r = { recipient: r.value }))
                )
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
                    " POST"
                  ]
                : "POST"}
            </Button>
            <Button
              onClick={e =>
                UpdatePoll(
                  pollId,
                  User.token,
                  User.id,
                  User.username,
                  title,
                  body,
                  Questions,
                  Recipients.map(r => (r = { recipient: r.value }))
                )
              }
            >
              {updating && !updated
                ? [<i className="fa fa-spinner fa-spin" />, " UPDATE"]
                : !updating && updated && !error
                ? [
                    <i
                      className="fas fa-check"
                      style={{ color: "var(--color_emerald)" }}
                    />,
                    " UPDATE"
                  ]
                : "UPDATE"}
            </Button>
          </Col>
          <Col
            md={4}
            xs={6}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button
              onClick={e =>
                this.setState({
                  Questions: [
                    ...Questions,
                    {
                      postion: Questions.length,
                      question: "",
                      question_type: PollChoices[0].value,
                      Choices: []
                    }
                  ]
                })
              }
            >
              <i className="fas fa-plus" /> Question
            </Button>
          </Col>
          <Col md={4} xs={6}>
            <Button
              onClick={e =>
                this.setState({
                  Recipients: this.selectGuildRecipients(User, Admin.Users)
                })
              }
            >
              <i className="fas fa-user-plus" /> Guild
            </Button>
          </Col>
        </Row>
        <Row>
          <Form className="Container fadeIn">
            <Row>
              <Col xs={12}>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-heading" />
                  </InputGroup.Addon>
                  <FormControl
                    value={title}
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={e => this.onChange(e)}
                  />
                </InputGroup>
              </Col>
              <Col xs={12}>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-comment" />
                  </InputGroup.Addon>
                  <FormControl
                    value={body}
                    type="text"
                    placeholder="Message body"
                    name="body"
                    onChange={e => this.onChange(e)}
                  />
                </InputGroup>
              </Col>
              <Col xs={12}>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-user-plus" />
                  </InputGroup.Addon>
                  <Select
                    //https://react-select.com/props
                    value={Recipients}
                    isMulti
                    styles={selectStyles}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    //isClearable={this.state.Recipients.some(v => !v.isFixed)}
                    isSearchable={true}
                    name="colors"
                    placeholder="Username..."
                    classNamePrefix="select"
                    onChange={this.onSelectFilterChange}
                    options={selectOptions}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </Row>
        {this.renderQuestions(Questions)}
      </Grid>
    ) : User.token ? (
      this.props.history.length > 2 ? (
        <Redirect to={this.props.history.goBack()} />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(PollGenerator)
);
