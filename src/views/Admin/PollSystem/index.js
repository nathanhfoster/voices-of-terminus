import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { GetPolls } from "../../../actions/Polls";
import Moment from "react-moment";

const mapStateToProps = ({ User, Polls }) => ({ User, Polls });

const mapDispatchToProps = { GetPolls };

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
    const { User, GetPolls } = this.props;
    GetPolls(User.token);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Polls } = props;
    this.setState({ User, Polls });
  };

  renderPolls = Polls =>
    Polls.map(p => {
      const { title, author_username, date_created, last_modified } = p;
      return (
        <Row className="borderedRow">
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

  render() {
    const { User, Polls } = this.state;
    return (
      <Grid className="PollSystem Container">
        {this.renderPolls(Polls.results)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PollSystem);
