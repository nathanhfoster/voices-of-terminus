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
import { PostPoll } from "../../actions/Polls";

const mapStateToProps = ({ User, Admin }) => ({ User, Admin });

const mapDispatchToProps = { PostPoll };

class PollGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NewChoice: "",
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
    const { User } = this.props;
    const { Users } = this.props.Admin;
    const Recipients = Users
      ? Users.filter(i => i.id === User.id).map(
          e => (e = { value: e.id, label: e.username, isFixed: true })
        )
      : [];
    this.setState({ Recipients });
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Questions, User, Admin, title } = props;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];
    this.setState({ Questions, selectOptions, title });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

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
        if (value == "Text") {
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
      const { question_type, Question, Choices } = q;
      return (
        <Row className="Questions Center borderedRow" key={i}>
          <Col xs={12}>
            <ControlLabel>Question</ControlLabel>
          </Col>
          <Col md={9} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="far fa-question-circle" />
              </InputGroup.Addon>
              <FormControl
                id={`${i}`}
                key={i}
                value={Question}
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
            <FormControl question_type="text" placeholder="Text..." disabled />
          </FormGroup>
        );
      case "Image":
        return (
          <FormGroup>
            <ControlLabel>Image</ControlLabel>
            <FormControl
              disabled
              style={{ margin: "auto" }}
              question_type="file"
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

  deleteChoice = (pollIndex, i) => {
    let { Choices } = this.state.Questions[pollIndex];
    delete Choices[i];
    Choices.length -= 1;
    this.setState({ Choices });
  };

  selectGuildRecipients = (User, Users) =>
    Users.filter(
      user =>
        statusLevelInt({
          is_leader: user.is_leader,
          is_advisor: user.is_advisor,
          is_council: user.is_council,
          is_general_officer: user.is_general_officer,
          is_officer: user.is_officer,
          is_senior_member: user.is_senior_member,
          is_junior_member: user.is_junior_member,
          is_recruit: user.is_recruit
        }) != 0
    )
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
    const { User, Admin, PostPoll } = this.props;
    const { Questions, Recipients, selectOptions, title } = this.state;

    return User.is_superuser || User.is_staff ? (
      <Grid className="PollGenerator Container">
        <Row className="ActionToolbarRow">
          <Col md={4}>
            <Button
              onClick={e =>
                PostPoll(
                  User.token,
                  User.id,
                  title,
                  Questions,
                  Recipients.map(r => (r = { recipient: r.value }))
                )
              }
            >
              Post
            </Button>
          </Col>
          <Col md={4} className="ActionToolbar" componentClass={ButtonToolbar}>
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
          <Col md={4}>
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
      <Redirect to={this.props.history.goBack()} />
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PollGenerator);
