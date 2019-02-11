import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getEvent, clearEventsApi } from "../../../actions/Events";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const mapStateToProps = ({ Events }) => ({ Events });

const mapDispatchToProps = { getEvent, clearEventsApi };

class EventDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {
    Events: {
      Event: {},
      Groups: [],
      GroupMembers: []
    }
  };

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

  renderGroups = (Groups, GroupMembers) =>
    Groups.map((g, i) => {
      const { id, event_id, position } = g;
      return (
        <Col md={12 / Groups.length} xs={12}>
          {`Group: ${position + 1}`}
          {this.renderGroupMembers(GroupMembers)}
        </Col>
      );
    });

  renderGroupMembers = GroupMembers =>
    GroupMembers.map((m, i) => {
      const { id, event_group_id, position, role_class_preferences } = m;
      return <Col>{role_class_preferences}</Col>;
    });

  render() {
    const { Event, Groups, GroupMembers } = this.state;

    const {
      id,
      author,
      author_username,
      date_created,
      description,
      start_date,
      end_date,
      group_size,
      last_modified,
      last_modified_by,
      last_modified_by_username,
      location,
      max_level,
      min_level,
      tags,
      title
    } = Event;
    return (
      <Grid className="EventDetails Container">
        <Row>
          <PageHeader className="pageHeader">{title}</PageHeader>
        </Row>
        <Row>
          <Col xs={12}>
            <i className="fas fa-user" />{" "}
            <Link to={`/profile/${author}`} onClick={e => e.stopPropagation()}>
              {author_username}
            </Link>{" "}
            <i className="far fa-clock" />{" "}
            <Moment fromNow>{date_created}</Moment>
          </Col>
          <Col xs={12}>
            <i className="fas fa-pencil-alt" />{" "}
            <Link
              to={`/profile/${last_modified_by}`}
              onClick={e => e.stopPropagation()}
            >
              {last_modified_by_username}
            </Link>{" "}
            <i className="far fa-clock" />{" "}
            <Moment fromNow>{last_modified}</Moment>
          </Col>
          <Col xs={12}>
            <i className="far fa-calendar-check" />{" "}
            <Moment fromNow>{start_date}</Moment>
          </Col>
          <Col xs={12}>
            <i className="far fa-calendar-times" />{" "}
            <Moment fromNow>{end_date}</Moment>
          </Col>
          <Col xs={12}>
            <i className="fas fa-users" /> {group_size}
          </Col>
          <Col xs={12}>
            <i className="fas fa-tags" /> [{tags}]
          </Col>
          <Col xs={12} className="blockLineBreak">
            <i className="fas fa-clipboard" /> {description}
          </Col>
          <Col xs={12}>
            <i className="fas fa-globe-americas" />{" "}
            {location ? location : "No location provided."}
          </Col>
          <Col xs={12}>
            <i class="fas fa-exchange-alt" />{" "}
            {`Level range: (${min_level} - ${max_level})`}
          </Col>
        </Row>
        <hr />
        <Row>{this.renderGroups(Groups, GroupMembers)}</Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventDetails);
