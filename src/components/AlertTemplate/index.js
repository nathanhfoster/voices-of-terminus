import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import {
  _extends,
  InfoIcon,
  SuccessIcon,
  ErrorIcon,
  CloseIcon,
  alertStyle,
  buttonStyle
} from "./styles";

class AlertTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  render() {
    const { style, options, message, close } = this.props;

    return (
      <div style={_extends({}, alertStyle, style)}>
        {options.type == "info" && React.createElement(InfoIcon, null)}
        {options.type == "success" && React.createElement(SuccessIcon, null)}
        {options.type == "error" && React.createElement(ErrorIcon, null)}

        {message}
        <button onClick={close} style={buttonStyle}>
          <i className="fas fa-times" />
        </button>
      </div>
    );
  }
}
export default AlertTemplate;
