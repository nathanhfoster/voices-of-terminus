import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Image, Button } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getEvent, clearEventsApi } from "../../../actions/Events";
import { getCharacters } from "../../../actions/User";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { roleClassIcon, classOptions } from "../../../helpers";

const mapStateToProps = ({ User, Events }) => ({ User, Events });

const mapDispatchToProps = { getEvent, getCharacters, clearEventsApi };

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
    const { User, getEvent, getCharacters, match } = this.props;
    const { id } = match.params;
    if (User) getCharacters(User.id, User.token);
    getEvent(id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events } = props;
    const { Event, Groups, GroupMembers } = Events;
    this.setState({ User, Event, Groups, GroupMembers });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderGroups = Groups =>
    Groups.map((g, i) => {
      const { id, event_id, position, GroupMembers } = g;
      const header = Groups.length > 1 ? `Group: ${position + 1}` : `Group`;
      return (
        <Col className="Group" md={12 / Groups.length} xs={12}>
          <h2 className="headerBanner">{header}</h2>
          {this.renderGroupMembers(GroupMembers)}
        </Col>
      );
    });

  renderGroupMembers = GroupMembers => {
    const { User } = this.state;
    const { Characters } = User;
    return GroupMembers.map(m => {
      const { id, event_group_id, position, role_class_preferences } = m;
      const roleClassPreferences = role_class_preferences.split("|");
      const rolePreference = roleClassPreferences[0];
      let classPreferences = roleClassPreferences.slice(1);
      const noClassPreferences = classPreferences.length === 0;
      if (noClassPreferences)
        classPreferences = classOptions[rolePreference].map(e => e.value);

      // const p = preferences.map(p => this.renderCharacterMatch(p));
      // console.log(p);

      return (
        <div key={id} className="MembersContainer">
          <Image height={30} width={30} src={roleClassIcon(rolePreference)} />{" "}
          {rolePreference}
          <div className="Member">
            {this.renderCharacterMatch(
              Characters,
              rolePreference,
              noClassPreferences,
              classPreferences
            )}
          </div>
        </div>
      );
    });
  };

  renderCharacterMatch = (
    Characters,
    rolePreference,
    noClassPreferences,
    classPreferences
  ) => {
    let Preferences = [];
    const imageDimensions = 20;

    if (rolePreference === "Any")
      return <span className="Preferences Match help">Any</span>;

    for (let i = 0; i < classPreferences.length; i++) {
      const classPreference = classPreferences[i];
      //console.log(classPreference);
      if (
        (noClassPreferences &&
          Characters.some(c => c.role === rolePreference)) ||
        Characters.some(c => c.character_class === classPreference)
      )
        Preferences.push(
          <div className="Preferences">
            <Image
              height={imageDimensions}
              width={imageDimensions}
              src={roleClassIcon(classPreference)}
            />
            <span className="Preferences Match help">{classPreference}</span>
          </div>
        );
      else
        Preferences.push(
          <div className="Preferences">
            <Image
              height={imageDimensions}
              width={imageDimensions}
              src={roleClassIcon(classPreference)}
            />
            <span className="Preferences help">{classPreference}</span>
          </div>
        );
    }

    return Preferences;
  };

  render() {
    const { Event, Groups, GroupMembers } = this.state;
    const GroupsWithMembers = Groups.map(g => {
      g.GroupMembers = GroupMembers.filter(m => m.event_group_id === g.id);
      return g;
    });
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
      locations,
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
            {locations ? `[${locations}]` : "No locations provided."}
          </Col>
          <Col xs={12}>
            <i class="fas fa-exchange-alt" />{" "}
            {`Level range: (${min_level} - ${max_level})`}
          </Col>
        </Row>
        <Row>
          <PageHeader className="Center">Group Composition</PageHeader>
        </Row>
        <Row>{GroupsWithMembers && this.renderGroups(GroupsWithMembers)}</Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventDetails);
