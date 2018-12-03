import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class Template extends Component {
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

  /* render() */

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return <Grid className="Template Container">Template</Grid>;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Template);
