import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Image, Modal } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import {
  getEvent,
  editEventGroupMember,
  clearEventsApi
} from "../../../actions/Events";
import { getCharacters } from "../../../actions/User";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { roleClassIcon, classOptions } from "../../../helpers";

const mapStateToProps = ({ User, Events }) => ({ User, Events });

const mapDispatchToProps = {
  getEvent,
  getCharacters,
  editEventGroupMember,
  clearEventsApi
};

class EventDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { show: false };
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
    if (User.id) getCharacters(User.id, User.token);
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
      const {
        id,
        event_group_id,
        position,
        role_class_preferences,
        filled,
        Response
      } = m;
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
              id,
              rolePreference,
              noClassPreferences,
              classPreferences,
              filled,
              Response
            )}
          </div>
        </div>
      );
    });
  };

  renderCharacterMatch = (
    Characters,
    memberId,
    rolePreference,
    noClassPreferences,
    classPreferences,
    filled,
    Response
  ) => {
    // console.log(filled, Response);
    const { User, editEventGroupMember } = this.props;
    const {
      id,
      author,
      author_username,
      name,
      level,
      race,
      role,
      character_class
    } = Response ? Response : {};
    let Preferences = [];
    const imageDimensions = 20;

    if (!filled && rolePreference === "Any")
      return (
        <span
          key={memberId}
          onClick={e =>
            this.setState({
              show: true,
              memberId,
              MatchedCharacters: Characters,
              rolePreference
            })
          }
          className="Preferences Match Clickable help"
        >
          Any
        </span>
      );
    // if (filled)
    //   return (
    //     <span key={memberId} className="Preferences help">
    //       {name}
    //     </span>
    //   );

    for (let i = 0; i < classPreferences.length; i++) {
      const classPreference = classPreferences[i];
      // const classIndex = Characters.map(c =>
      //   classPreferences.findIndex(e => e == c.character_class)
      // ).filter(e => !e)[0];

      const MatchedCharacters = Characters.filter(
        c =>
          (noClassPreferences && c.role == rolePreference.includes(c.role)) ||
          c.character_class == classPreference
      );

      const matched = MatchedCharacters.length > 0;
      if (!filled && matched)
        Preferences.push(
          <div className="Preferences">
            <Image
              height={imageDimensions}
              width={imageDimensions}
              src={roleClassIcon(classPreference)}
            />
            <span
              key={memberId}
              onClick={e =>
                this.setState({
                  show: true,
                  memberId,
                  MatchedCharacters,
                  rolePreference
                })
              }
              className="Preferences Match Clickable help"
            >
              {classPreference}
            </span>
          </div>
        );
      // else if (filled)
      //   Preferences.push(
      //     <div className="Preferences">
      //       <Image
      //         height={imageDimensions}
      //         width={imageDimensions}
      //         src={roleClassIcon(classPreference)}
      //       />
      //       <span key={memberId} className="Preferences help">
      //         {name}
      //       </span>
      //     </div>
      //   );
      else
        Preferences.push(
          <div className="Preferences">
            <Image
              height={imageDimensions}
              width={imageDimensions}
              src={roleClassIcon(classPreference)}
            />
            <span key={memberId} className="Preferences help">
              {classPreference}
            </span>
          </div>
        );
    }
    return Preferences;
  };

  renderCharacters = (memberId, MatchedCharacters) => {
    const { User, editEventGroupMember } = this.props;
    return MatchedCharacters.map(c => {
      const {
        id,
        author,
        author_username,
        name,
        level,
        race,
        role,
        character_class
      } = c;
      const payload = { filled: id };
      return (
        <Row
          key={id}
          onClick={e => {
            editEventGroupMember(memberId, User.token, payload);
            this.setState({ show: false });
          }}
          className="MatchedCharactersContainer Clickable Hover"
        >
          <Col>{`(${level}) ${name}`}</Col>
          <Col>{race}</Col>
          <Col>{role}</Col>
          <Col>{character_class}</Col>
        </Row>
      );
    });
  };

  render() {
    const {
      Event,
      Groups,
      GroupMembers,
      show,
      memberId,
      MatchedCharacters,
      rolePreference
    } = this.state;
    const GroupsWithMembers = Groups.map(g => {
      g.GroupMembers = GroupMembers.filter(m => m.event_group_id === g.id);
      return g;
    });
    //console.log(GroupsWithMembers)
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
        <Row>{this.renderGroups(GroupsWithMembers)}</Row>
        {show ? (
          <Modal
            bsSize="large"
            show={show}
            onHide={() => this.setState({ show: false })}
            dialogClassName="eventModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                {`Sign up for "${rolePreference}" role`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PageHeader className="pageHeader">CHARACTERS</PageHeader>
              {this.renderCharacters(
                memberId,
                MatchedCharacters,
                rolePreference
              )}
              <Row>
                <Col xs={12} />
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Col md={12} className="Center">
                  {/*<ButtonGroup>
                    <Button
                      onClick={this.handleDelete}
                      className="ConfirmActionButton"
                    >
                      Yes
                    </Button>
                    <Button onClick={this.handleHide}>No</Button>
                  </ButtonGroup>*/}
                </Col>
              </Row>
            </Modal.Footer>
          </Modal>
        ) : null}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EventDetails);
