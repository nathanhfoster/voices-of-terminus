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
import ConfirmAction from "../../../components/ConfirmAction";

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

  static defaultProps = {
    User: {
      Characters: []
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

  renderGroups = (User, Groups) =>
    Groups.map((g, i) => {
      const { id, event_id, position, GroupMembers } = g;
      const header = Groups.length > 1 ? `Group: ${position + 1}` : `Group`;
      return (
        <Col className="Group" md={12 / Groups.length} xs={12}>
          <h2 className="headerBanner">{header}</h2>
          {this.renderGroupMembers(User, GroupMembers)}
        </Col>
      );
    });

  renderGroupMembers = (User, GroupMembers) => {
    const { Characters } = User;
    return GroupMembers.map(member => {
      const {
        id,
        event_group_id,
        position,
        role_class_preferences,
        filled,
        Response
      } = member;
      const roleClassPreferences = role_class_preferences.split("|");

      const rolePreference = roleClassPreferences[0];
      let classPreferences = roleClassPreferences.slice(1);
      const hasClassPreferences = classPreferences.length > 0;
      if (!hasClassPreferences)
        classPreferences = classOptions[rolePreference].map(e => e.value);
      return (
        <div
          key={id}
          className="MembersContainer"
          style={{ backgroundColor: filled ? "var(--slate_grey" : "inherit" }}
        >
          <Image height={26} width={26} src={roleClassIcon(rolePreference)} />{" "}
          {rolePreference}
          <div className="Member">
            {this.renderCharacterMatch(
              GroupMembers,
              id,
              User,
              Characters,
              Response,
              rolePreference,
              hasClassPreferences,
              classPreferences
            )}
          </div>
        </div>
      );
    });
  };

  renderCharacterMatch = (
    GroupMembers,
    memberId,
    User,
    Characters,
    Response,
    rolePreference,
    hasClassPreferences,
    classPreferences
  ) => {
    let Elements = [];
    let UserAlreadySignedUp = GroupMembers.some(m =>
      Characters.some(c => c.id == m.filled)
    );
    let CharacterSignedUpWith;
    const imageDimensions = 20;
    const canSignUpForAnyClass =
      rolePreference == "Any" && !hasClassPreferences;

    // for (let i = 0; i < classPreferences.length; i++) {
    //   const classPreference = classPreferences[i];
    //   Elements.push(<span>{classPreference}</span>);
    // }
    // return Elements;
    // console.log("GroupMembers: ", GroupMembers);
    // console.log("memberId: ", memberId);
    // console.log("Characters: ", Characters);
    // console.log("Response: ", Response);
    // console.log("UserAlreadySignedUp: ", UserAlreadySignedUp);
    // console.log("rolePreference: ", rolePreference);
    // console.log("hasClassPreferences: ", hasClassPreferences);
    // console.log("classPreferences: ", classPreferences);
    // console.log("-------------------------------------------");
    if (Characters && Response) {
      CharacterSignedUpWith = UserAlreadySignedUp
        ? Characters.filter(c => c.id == Response.id)[0]
        : Response
        ? Response
        : { author: null };

      return this.renderCharacterInfo(CharacterSignedUpWith, memberId);
    }
    if (!Response && canSignUpForAnyClass) {
      return (
        <div>
          <span
            key={memberId}
            onClick={e =>
              !UserAlreadySignedUp && User.id
                ? this.setState({
                    show: true,
                    memberId,
                    MatchedCharacters: Characters,
                    rolePreference
                  })
                : editEventGroupMember(memberId, User.token, { filled: null })
            }
            className={
              !UserAlreadySignedUp && User.id
                ? "Preferences Match Clickable help"
                : "Preferences help"
            }
          >
            <div className="editResponseContainer">
              {!UserAlreadySignedUp && User.id && <i className="fas fa-plus" />}{" "}
              Any
            </div>
          </span>
        </div>
      );
    } else if (!Response) {
      for (let i = 0; i < classPreferences.length; i++) {
        const classPreference = classPreferences[i];
        const UserCharacterCandidates = Characters.filter(
          c => c.role == rolePreference && c.character_class == classPreference
        );
        const roleMatch = UserCharacterCandidates.length > 0;
        if (roleMatch) {
          Elements.push(
            <div className="Preferences">
              <Image
                height={imageDimensions}
                width={imageDimensions}
                src={roleClassIcon(classPreference)}
              />
              <span
                key={memberId}
                onClick={e =>
                  !UserAlreadySignedUp
                    ? this.setState({
                        show: true,
                        memberId,
                        MatchedCharacters: UserCharacterCandidates,
                        rolePreference
                      })
                    : editEventGroupMember(memberId, User.token, {
                        filled: null
                      })
                }
                className={
                  !UserAlreadySignedUp
                    ? "Preferences Match Clickable help"
                    : "Preferences help"
                }
              >
                <div className="editResponseContainer">
                  {!UserAlreadySignedUp && <i className="fas fa-plus" />}{" "}
                  {classPreference}
                </div>
              </span>
            </div>
          );
        } else
          Elements.push(
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
    }
    return Elements;
  };

  renderCharacterInfo = (CharacterSignedUpWith, memberId) => {
    const { User, editEventGroupMember } = this.props;
    const isUsersCharacter = User.id == CharacterSignedUpWith.author;
    const {
      id,
      author,
      author_username,
      name,
      level,
      race,
      role,
      character_class
    } = CharacterSignedUpWith;
    const iconDimensions = 24;
    return (
      <Row className="CharacterSignedUpWith">
        <Col xs={3}>
          {`(${level}) `}
          <Image
            height={iconDimensions}
            width={iconDimensions}
            src={roleClassIcon(character_class)}
          />
          {` ${name}`}
        </Col>
        <Col xs={2}>{race}</Col>
        <Col xs={3}>{role}</Col>
        <Col xs={3}>{character_class}</Col>
        <Col xs={1}>
          <ConfirmAction
            Action={e =>
              editEventGroupMember(memberId, User.token, { filled: null })
            }
            Disabled={false}
            Icon={<i className="fas fa-trash" />}
            hasPermission={isUsersCharacter}
            Size="small"
            Class="pull-right"
            Title={name}
          />
        </Col>
      </Row>
    );
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
      User,
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
        <Row>{this.renderGroups(User, GroupsWithMembers)}</Row>
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
