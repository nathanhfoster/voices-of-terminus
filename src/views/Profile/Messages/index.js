import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { getMessages } from "../../../actions/Messages";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User }) => ({
  User
});

const mapDispatchToProps = {
  getMessages
};

class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { id, token } = this.props.User;
    this.props.getMessages(id, token);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return <Grid className="Messages Container">Messages</Grid>;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Messages);
