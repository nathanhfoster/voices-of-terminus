import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getEvent, clearEventsApi } from "../../../actions/Events";

const mapStateToProps = ({ Events }) => ({ Events });

const mapDispatchToProps = { getEvent, clearEventsApi };

class EventDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    const { clearEventsApi } = this.props;
    clearEventsApi();
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const { getEvent, match } = this.props;
    const { id } = match.params;
    getEvent(id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Events } = props;
    const { Event, Groups, GroupMembers } = Events;
    this.setState({ Event, Groups, GroupMembers });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { Event, Groups, GroupMembers } = this.state;
    const { title } = Event;
    return (
      <Grid className="EventDetails Container">
        <Row>
          <PageHeader className="pageHeader">{title}</PageHeader>
        </Row>
        <Row>
          <Col>fsd</Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventDetails);
