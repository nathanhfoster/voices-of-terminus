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
  InputGroup,
  Image,
  Checkbox
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import ConfirmAction from "../ConfirmAction";
import Select from "react-select";
import { PollChoices, switchPollTypeIcon, statusLevelInt } from "../../helpers";
import { selectStyles } from "../../helpers/styles";
import { Redirect } from "react-router-dom";
import { getUsers } from "../../actions/Admin";
import { withAlert } from "react-alert";
import {
  PostPoll,
  clearPollsApi,
  GetPoll,
  GetPollQuestions,
  GetPollRecipients,
  UpdatePoll
} from "../../actions/Polls";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserHasPermissions } from "../../helpers/userPermissions";
import { defaultImage } from "../../helpers/defaultProfileImages";

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
      expiration_date: null,
      NewChoice: "",
      Polls: [],
      Questions: [
        {
          position: 0,
          question: "",
          question_type: PollChoices[0].value,
          image: null,
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
        position: 0,
        question: "",
        question_type: PollChoices[0].value,
        image: null,
        Choices: []
      }
    ]
  };

  setExpirationDate = expiration_date =>
    this.setState({
      expiration_date: expiration_date
        ? new Date(expiration_date).toISOString()
        : null
    });

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
      match
    } = this.props;
    const { token } = User;
    const pollId = match.params.id;
    getUsers();
    clearPollsApi();
    if (pollId) {
      GetPoll(token, pollId);
      GetPollQuestions(token, pollId);
      GetPollRecipients(token, pollId);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Questions, User, Admin, title, match, Polls } = props;
    const pollId = match.params.id;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];
    if (pollId) {
      this.pollPropToState(Polls, User.id, selectOptions);
    } else {
      this.setState({
        Questions,
        selectOptions,
        title,
        Polls
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearPollsApi } = this.props;
    clearPollsApi();
  }

  pollPropToState = (Polls, userId, selectOptions) => {
    let { Poll, Questions, Choices, Recipients } = Polls;
    const { title, expiration_date } = Poll;
    Questions = Questions.map(
      (q, i) =>
        (q = {
          id: q.id,
          position: i,
          question: q.question,
          question_type: q.question_type,
          Choices: Choices[i]
            ? Choices[i].map(
                (c, i) => (c = { id: c.id, position: i, title: c.title })
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

    this.setState({
      Polls,
      title,
      Questions,
      Recipients,
      selectOptions,
      expiration_date
    });
  };

  setQuestionProp = (index, prop, value) =>
    this.setState(prevState => {
      let { Questions } = prevState;
      Questions[index][prop] = value;
      return { Questions };
    });

  setChoiceProp = (questionIndex, choiceIndex, choiceProp, value) =>
    this.setState(prevState => {
      let { Questions } = prevState;
      Questions[questionIndex].Choices[choiceIndex][choiceProp] = value;
      return { Questions };
    });

  onQuestionChange = e => {
    const { id, value } = e.target;
    this.setQuestionProp(id, "question", value);
  };

  onChoiceChange = (choiceIndex, e) => {
    const { id, value } = e.target;
    this.setChoiceProp(id, choiceIndex, "title", value);
  };

  addChoice = e => {
    const { id, value } = e.target;
    let { Questions } = this.state;
    const { length } = Questions[id].Choices;
    Questions[id].Choices.push({ position: length, title: value });
    this.setState({ Questions });
  };

  onSelectFilterChange = (Recipients, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
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
        return this.setQuestionProp(i, "question_type", "");
      case "select-option":
        if (value == "Text" || value == "Image") {
          this.setQuestionProp(i, "Choices", []);
          Questions[i].Choices.push({ position: 0, title: "" });
        }
        return this.setQuestionProp(i, "question_type", value);
    }
  };

  setImage = e => {
    const { id } = e.target;
    const { alert } = this.props;
    var file = e.target.files[0];

    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => this.setQuestionProp(id, "image", reader.result);
    }
  };

  renderQuestions = Questions =>
    Questions.map((q, i) => {
      const { NewChoice } = this.state;
      const { question_type, image, question, Choices } = q;
      return (
        <Row className="Questions Center borderedRow">
          <Col xs={12}>
            <Col xs={4}>
              <span className="pull-left questionNumber">{`${i + 1}`}</span>
            </Col>
            <Col xs={4}>
              <ControlLabel>Question Image</ControlLabel>
              <span className="help-inline">(optional)</span>
            </Col>
            <Col xs={4}>
              <ConfirmAction
                key={i}
                Action={e => this.deleteQuestion(i)}
                Disabled={false}
                Icon={<i className="fa fa-trash" />}
                hasPermission={true}
                Size="small"
                Class="pull-right"
                Title={question}
                CloseOnReceiveProps={true}
              />
            </Col>
          </Col>
          <Col xs={12}>
            <Image src={image} width={200} />
            <FormControl
              style={{ margin: "8px auto" }}
              key={i}
              id={i}
              type="file"
              label="File"
              name="image"
              onChange={this.setImage}
            />
          </Col>
          <Col md={9} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="far fa-question-circle" />
              </InputGroup.Addon>
              <FormControl
                id={`${i}`}
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
                styles={selectStyles()}
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
              componentClass="textarea"
              question_type="text"
              placeholder="Text..."
              value={Choices.length > 0 ? Choices[0].title : ""}
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
      const { position, title } = c;
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
            autoFocus={position == i}
          />
          <InputGroup.Addon>
            <ConfirmAction
              Action={e => this.deleteChoice(pollIndex, i)}
              Disabled={false}
              Icon={<i className="fas fa-trash" />}
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
    Questions = Questions.filter(q => q).map(
      (q, i) => (q = { ...q, position: i })
    );
    this.setState({ Questions });
  };

  deleteChoice = (pollIndex, index) => {
    let { Choices } = this.state.Questions[pollIndex];
    delete Choices[index];
    Choices = Choices.filter(c => c).map((c, i) => (c = { ...c, position: i }));
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
    const { User, Admin, PostPoll, UpdatePoll, match, history } = this.props;
    const pollId = match.params.id;
    const {
      Polls,
      Questions,
      Recipients,
      selectOptions,
      title,
      body,
      expiration_date
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
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(title && expiration_date)}
              onClick={e =>
                PostPoll(
                  User.token,
                  User.id,
                  User.username,
                  title,
                  body,
                  expiration_date,
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
            {pollId && UserHasPermissions(User, "change_poll") && (
              <Button
                disabled={!pollId}
                onClick={e =>
                  UpdatePoll(
                    pollId,
                    User.token,
                    User.id,
                    User.username,
                    title,
                    body,
                    expiration_date,
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
            )}
          </Col>
          <Col
            md={4}
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              onClick={e =>
                this.setState({
                  Questions: [
                    ...Questions,
                    {
                      position: Questions.length,
                      question: "",
                      question_type: PollChoices[0].value,
                      image: null,
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
              <Col xs={12} className={!title ? "notValid" : ""}>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-heading" />
                  </InputGroup.Addon>
                  <FormControl
                    value={title}
                    type="text"
                    placeholder="Title..."
                    name="title"
                    onChange={e => this.onChange(e)}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                className={
                  !expiration_date
                    ? "expirationDate notValid"
                    : "expirationDate"
                }
              >
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-lock" />
                  </InputGroup.Addon>
                  <DatePicker
                    //calendarClassName="Calendar"
                    popperClassName="calendarPopper"
                    fixedHeight={true}
                    //startDate={expiration_date}
                    //value={expiration_date.toString()}
                    selected={expiration_date}
                    onChange={date => this.setExpirationDate(date)}
                    showTimeSelect
                    //timeFormat="hh:mm"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                    placeholderText="Expiration date..."
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-user-plus" />
                  </InputGroup.Addon>
                  <Select
                    //https://react-select.com/props
                    value={Recipients}
                    isMulti
                    styles={selectStyles()}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    //isClearable={this.state.Recipients.some(v => !v.isFixed)}
                    isSearchable={true}
                    placeholder="Recipient username..."
                    classNamePrefix="select"
                    onChange={this.onSelectFilterChange}
                    options={selectOptions}
                  />
                </InputGroup>
              </Col>
              {Recipients.length > 0 && (
                <Col xs={12}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <i className="fas fa-comment" />
                    </InputGroup.Addon>
                    <FormControl
                      componentClass="textarea"
                      value={body}
                      type="text"
                      placeholder="Message body"
                      name="body"
                      onChange={e => this.onChange(e)}
                    />
                  </InputGroup>
                </Col>
              )}
            </Row>
          </Form>
        </Row>
        {this.renderQuestions(Questions)}
      </Grid>
    ) : history.length > 2 ? (
      <Redirect to={history.goBack()} />
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(PollGenerator)
);
