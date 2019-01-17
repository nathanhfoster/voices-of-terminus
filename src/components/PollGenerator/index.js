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
  InputGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import ConfirmAction from "../ConfirmAction";
import Select from "react-select";
import { PollChoices, switchPollTypeIcon } from "../../helpers";
import { selectStyles } from "../../helpers/styles";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class PollGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NewChoice: ""
    };
  }

  static propTypes = {};

  static defaultProps = {
    Polls: [
      { postion: 0, type: PollChoices[0].value, Question: "", Choices: [] }
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

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Polls, Choices } = props;
    this.setState({ Polls, Choices });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  onQuestionChange = e => {
    const { id, value } = e.target;
    let { Polls } = this.state;

    Polls[id].Question = value;
    this.setState({ Polls });
  };

  onChoiceChange = (choiceIndex, e) => {
    const { id, value } = e.target;
    let { Polls } = this.state;

    Polls[id].Choices[choiceIndex].value = value;
    this.setState({ Polls });
  };

  addChoice = e => {
    const { id, value } = e.target;
    let { Polls } = this.state;
    const { length } = Polls[id].Choices;
    Polls[id].Choices.push({ postion: length, value: value });
    this.setState({ Polls });
  };

  selectOnChange = (e, a, i) => {
    const { value } = e;
    let { Polls } = this.state;
    switch (a.action) {
      case "clear":
        Polls[i].type = "";
        return this.setState({ Polls });

      case "select-option":
        if (Polls[i].Choices.length > 0 && value == "Text")
          Polls[i].Choices.length = 0;
        Polls[i].type = value;
        return this.setState({ Polls });
    }
  };

  renderPolls = Polls =>
    Polls.map((p, i) => {
      const { NewChoice } = this.state;
      const { type, Question, Choices } = p;
      return (
        <Row className="Polls Center borderedRow">
          <Col xs={12}>
            <ControlLabel>Question</ControlLabel>
          </Col>
          <Col md={9} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="far fa-question-circle" />
              </InputGroup.Addon>
              <FormControl
                id={i}
                value={Question}
                type="text"
                placeholder="Enter question..."
                onChange={this.onQuestionChange}
                autoFocus={true}
              />
            </InputGroup>
          </Col>
          <Col md={3} xs={12}>
            <InputGroup>
              <InputGroup.Addon>{switchPollTypeIcon(type)}</InputGroup.Addon>
              <Select
                value={type ? { value: type, label: type } : null}
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
            {this.switchPoll(Question, type, Choices, NewChoice, i)}
          </Col>
        </Row>
      );
    });

  switchPoll = (Question, type, Choices, NewChoice, i) => {
    switch (type) {
      case "Text":
        return (
          <FormGroup>
            <ControlLabel>Response</ControlLabel>
            <FormControl type="text" placeholder="Text..." disabled />
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
            {this.renderChoices(Question, Choices, i, type)}
            <InputGroup className="AddChoice">
              <InputGroup.Addon>{switchPollTypeIcon(type)}</InputGroup.Addon>
              <FormControl
                id={i}
                value={NewChoice}
                type="text"
                placeholder="Add a choice..."
                onChange={this.addChoice}
              />
            </InputGroup>
          </FormGroup>
        );
    }
  };

  renderChoices = (Question, Choices, pollIndex, type) =>
    Choices.map((c, i) => {
      const { postion, value } = c;
      return (
        <InputGroup key={i}>
          <InputGroup.Addon>{switchPollTypeIcon(type)}</InputGroup.Addon>
          <FormControl
            id={pollIndex}
            key={i}
            value={value}
            type="text"
            placeholder={value}
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
              Title={value}
            />
          </InputGroup.Addon>
        </InputGroup>
      );
    });

  deleteChoice = (pollIndex, i) => {
    let { Choices } = this.state.Polls[pollIndex];
    delete Choices[i];
    this.setState({ Choices });
  };

  render() {
    const { User } = this.props;
    const { Polls, Choices, NewChoice } = this.state;
    return User.is_superuser || User.is_staff ? (
      <Grid className="PollGenerator Container">
        <Row className="ActionToolbarRow">
          <Col xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button
              onClick={e =>
                this.setState({
                  Polls: [
                    ...Polls,
                    {
                      postion: 0,
                      type: PollChoices[0].value,
                      Question: "",
                      Choices: []
                    }
                  ]
                })
              }
            >
              <i className="fas fa-plus" /> Question
            </Button>
          </Col>
        </Row>
        {this.renderPolls(Polls)}
      </Grid>
    ) : null;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PollGenerator);
