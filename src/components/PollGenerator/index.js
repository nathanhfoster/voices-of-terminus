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
    Polls: [{ postion: 0, type: "Multiple", Question: "", Choices: [] }],
    PollTypes: ["Multiple"],
    Choices: []
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

  switchPoll = type => {
    switch (type) {
      case "Multiple":
        return "MULTIPLE";
      default:
        null;
    }
  };

  renderPolls = Polls =>
    Polls.map((p, i) => {
      const { NewChoice } = this.state;
      const { Question, Choices } = p;
      return [
        <Col xs={12}>
          <ControlLabel>Question</ControlLabel>
          <FormControl
            id={i}
            value={Question}
            type="text"
            placeholder="Enter question..."
            onChange={this.onQuestionChange}
            autoFocus={Choices.length < 1}
          />
          <i className="fas fa-poll-h" /> {this.switchPoll(p.type)}
        </Col>,
        <Col xs={12}>
          <FormGroup key={i}>
            <ControlLabel>Choices</ControlLabel>
            {this.renderChoices(Choices, i)}
            <FormControl
              className="AddChoice"
              id={i}
              value={NewChoice}
              type="text"
              placeholder="Enter choice..."
              onChange={this.addChoice}
              autoFocus={Choices.length < 1}
            />
          </FormGroup>
        </Col>
      ];
    });

  renderChoices = (Choices, pollIndex) =>
    Choices.map((c, i) => {
      const { postion, value } = c;
      console.log(Choices, value);
      return (
        <InputGroup key={i}>
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
                    { postion: 0, type: "Multiple", Question: "", Choices: [] }
                  ]
                })
              }
            >
              <i className="fas fa-plus" /> Question
            </Button>
          </Col>
        </Row>
        <Row>{this.renderPolls(Polls)}</Row>
      </Grid>
    ) : null;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PollGenerator);
