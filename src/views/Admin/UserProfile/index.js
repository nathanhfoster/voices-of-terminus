import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Image,
  Button,
  ButtonToolbar,
  Checkbox,
  Well
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  changeGroups,
  changePermissions,
  clearUser,
  updateUserProfile
} from "../../../actions/Admin";
import { getUser } from "../../../actions/App";
import Moment from "react-moment";
import "./styles.css";
import "./stylesM.css";
import {
  isOnline,
  MainAltCharacter,
  renderRoles,
  statusLevelInt,
  statusLevelString,
  roleClassIcon,
  professionIcon
} from "../../../helpers";
import {
  CategorizedPermissions,
  PermissionHeader,
  PermissionTitle
} from "../../../helpers/userPermissions";
import { ExperienceBar } from "../../../components/ExperienceBar";

const mapStateToProps = ({ AuthenticationAndAuthorization, Admin, User }) => ({
  AuthenticationAndAuthorization,
  Admin,
  User
});

const mapDispatchToProps = {
  getUser,
  clearUser,
  updateUserProfile,
  changeGroups,
  changePermissions
};

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      Admin: { User: { groups: [], user_permissions: [] } }
    };
  }

  static propTypes = {
    changeGroups: PropTypes.func.isRequired,
    changePermissions: PropTypes.func.isRequired,
    clearUser: PropTypes.func.isRequired,
    updateUserProfile: PropTypes.func.isRequired
  };

  static defaultProps = {
    User: {
      experience_points: "",
      is_active: "",
      is_staff: "",
      is_superuser: "",
      primary_class: "",
      primary_role: "",
      secondary_class: "",
      secondary_role: "",
      profession: "",
      profession_specialization: "",

      username: "",
      bio: "",
      date_joined: "",
      discord_url: "",
      email: "",
      first_name: "",
      last_name: "",
      id: null,
      last_login: "",
      password: "",
      profile_image: null,
      discord_url: "",
      twitch_url: "",
      twitter_url: "",
      youtube_url: ""
    }
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getUser, clearUser, User, match } = this.props;
    clearUser();
    const { id } = match.params;
    const { token } = User;
    getUser(id, token);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { AuthenticationAndAuthorization, Admin, User } = props;
    const { id } = props.match.params;

    this.setState({ AuthenticationAndAuthorization, Admin, User, id });
  };

  componentWillUnmount() {
    const { clearUser } = this.props;
    clearUser();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  selectOnChange = (e, a, name) => {
    switch (a.action) {
      case "clear":
        if (name.includes("primary"))
          this.setState({
            primary_race: "",
            primary_role: "",
            primary_class: ""
          });
        else if (name.includes("secondary"))
          this.setState({
            secondary_race: "",
            secondary_role: "",
            secondary_class: ""
          });
        else if (name.includes("profession"))
          this.setState({ profession: "", profession_specialization: "" });
        break;
      case "select-option":
        switch (name) {
          case "primary_race":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  primary_race: e.value,
                  primary_role: "",
                  primary_class: ""
                }
              }
            }));
            break;
          case "primary_role":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  primary_role: e.value,
                  primary_class: ""
                }
              }
            }));
            break;
          case "primary_class":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: { ...prevState.Admin.User, primary_class: e.value }
              }
            }));
            break;
          case "secondary_race":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  secondary_race: e.value,
                  secondary_role: "",
                  secondary_class: ""
                }
              }
            }));
            break;
          case "secondary_role":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  secondary_role: e.value,
                  secondary_class: ""
                }
              }
            }));
            break;
          case "secondary_class":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: { ...prevState.Admin.User, secondary_class: e.value }
              }
            }));
            break;
          case "profession":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  profession: e.value,
                  profession_specialization: ""
                }
              }
            }));
            break;
          case "profession_specialization":
            this.setState(prevState => ({
              Admin: {
                ...prevState.Admin,
                User: {
                  ...prevState.Admin.User,
                  profession_specialization: e.value
                }
              }
            }));
            break;
        }
    }
  };

  updateUserProfile = () => {
    const { updateUserProfile, changeGroups, changePermissions } = this.props;
    const { User } = this.state;
    const {
      id,
      groups,
      user_permissions,
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      is_superuser,
      is_staff,
      is_active,
      is_leader,
      is_advisor,
      is_council,
      is_general_officer,
      is_officer,
      is_senior_member,
      is_junior_member,
      is_recruit,
      is_raid_leader,
      is_banker,
      is_recruiter,
      is_class_lead,
      is_crafter_lead,
      is_host,
      is_lore_master
    } = this.state.Admin.User;

    const payload = {
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      is_superuser,
      is_staff,
      is_active,
      is_leader,
      is_advisor,
      is_council,
      is_general_officer,
      is_officer,
      is_senior_member,
      is_junior_member,
      is_recruit,
      is_raid_leader,
      is_banker,
      is_recruiter,
      is_class_lead,
      is_crafter_lead,
      is_host,
      is_lore_master
    };
    updateUserProfile(id, User.token, payload);

    const userGroupsPayload = { groups: JSON.stringify(groups) };
    const userPermissionsPayload = {
      user_permissions: JSON.stringify(user_permissions)
    };
    changeGroups(User.token, id, userGroupsPayload);
    changePermissions(User.token, id, userPermissionsPayload);
  };

  renderDividedText = text =>
    text.map((txt, i) =>
      txt ? txt + " | " : i === 0 ? <i className="fas fa-ban" /> : null
    );

  renderUserGroupPermissions = (AllUserGroups, UserGroups, canEdit) => {
    return (
      <Col xs={12}>
        <h3>GROUPS</h3>
        {AllUserGroups.map(g => {
          const { id, name, permissions } = g;
          const UserHasGroup = UserGroups.some(e => e == id);
          return (
            <Checkbox
              key={id}
              disabled={!canEdit}
              checked={UserHasGroup}
              onClick={e =>
                this.setState(prevState => ({
                  Admin: {
                    ...prevState.Admin,
                    User: {
                      ...prevState.Admin.User,
                      groups: prevState.Admin.User.groups.includes(id)
                        ? prevState.Admin.User.groups.filter(e => e != id)
                        : [...prevState.Admin.User.groups, ...[id]]
                    }
                  }
                }))
              }
            >
              {name}
            </Checkbox>
          );
        })}
      </Col>
    );
  };

  renderUserPermissions = (AllUserPermissions, UserPermissions, canEdit) =>
    CategorizedPermissions(AllUserPermissions).map(columnPermissions => {
      const Header = PermissionHeader(columnPermissions[0].codename);
      const Helper = `Can ${Header} designated content`;
      return (
        <Col md={3} xs={12}>
          <h3>{Header}</h3>
          <span className="help">{Helper}</span>
          {columnPermissions.map(p => {
            const { codename, content_type, id, name } = p;
            const title = PermissionTitle(name);
            const UserHasPermission = UserPermissions.some(e => e == id);
            return (
              <Checkbox
                key={id}
                disabled={!canEdit}
                checked={UserHasPermission}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        user_permissions: prevState.Admin.User.user_permissions.includes(
                          id
                        )
                          ? prevState.Admin.User.user_permissions.filter(
                              e => e != id
                            )
                          : [...prevState.Admin.User.user_permissions, ...[id]]
                      }
                    }
                  }))
                }
              >
                {title}
              </Checkbox>
            );
          })}
        </Col>
      );
    });

  render() {
    const { AuthenticationAndAuthorization, Admin, User } = this.state;
    const { history } = this.props;
    const { updating, updated, error } = Admin;
    const loggedInUserId = User.id;
    const currentUserId = Admin.User ? Admin.User.id : null;
    const loggedInUserStatus = statusLevelInt(User);
    const currentUserStatus = Admin.User ? statusLevelInt(Admin.User) : null;
    const canEdit =
      User.id === 1 ||
      loggedInUserId === currentUserId ||
      loggedInUserStatus > currentUserStatus;
    const MainCharacter = MainAltCharacter(Admin.User, "main");
    const AltCharacter = MainAltCharacter(Admin.User, "alt");
    return User.is_superuser || User.is_staff ? (
      Admin.User ? (
        <Grid className="UserProfile Container">
          <Row>
            <PageHeader className="pageHeader">PROFILE</PageHeader>
          </Row>
          <Row className="ActionToolbarRow">
            <Col
              xs={12}
              className="ActionToolbar cardActions"
              componentClass={ButtonToolbar}
            >
              <Button
                onClick={() => history.push(`/profile/${Admin.User.id}`)}
                className="pull-right"
              >
                Public Profile
              </Button>
            </Col>
          </Row>
          <Row>
            <h2 className="headerBanner">USER INFO</h2>
          </Row>
          <Row className="Center borderedRow">
            <Col md={4} xs={12}>
              <Image
                title="Profile Image"
                src={Admin.User.profile_image}
                className="ProfileImages"
                rounded
              />
            </Col>
            <Col md={5} xs={12}>
              <h1 title="User Name">{Admin.User.username.toUpperCase()}</h1>
              <span title="First and Last Name" className="firstLastName">
                {Admin.User.first_name} {Admin.User.last_name}
              </span>
              <h2 title="Status">
                {statusLevelString(statusLevelInt(Admin.User))}
              </h2>
              <div title="Roles" className="userRoles">
                {renderRoles(Admin.User)}
              </div>
              <h4 title="Primary Class Icon">
                <Image
                  src={roleClassIcon(MainCharacter.character_class)}
                  style={{ height: "24px" }}
                />
                <strong title="Primary | Race | Role | Class |">
                  {" "}
                  Primary:{" "}
                </strong>
                {this.renderDividedText([
                  MainCharacter.race,
                  MainCharacter.role,
                  MainCharacter.character_class
                ])}
              </h4>
              <h4 title="Profession | Profession | Profession Specialization | ">
                {professionIcon(
                  MainCharacter.profession,
                  MainCharacter.profession_specialization
                )}
                <strong> Profession: </strong>
                {this.renderDividedText([
                  MainCharacter.profession,
                  MainCharacter.profession_specialization
                ])}
              </h4>
              <h4 title="Seconday Class Icon">
                <Image
                  src={roleClassIcon(AltCharacter.character_class)}
                  style={{ height: "26px" }}
                />
                <strong title="Secondary | Race | Role | Class |">
                  {" "}
                  Secondary:{" "}
                </strong>
                {this.renderDividedText([
                  AltCharacter.race,
                  AltCharacter.role,
                  AltCharacter.character_class
                ])}
              </h4>
              <h4 title="Profession | Profession | Profession Specialization | ">
                {professionIcon(
                  AltCharacter.profession,
                  AltCharacter.profession_specialization
                )}
                <strong> Profession: </strong>
                {this.renderDividedText([
                  AltCharacter.profession,
                  AltCharacter.profession_specialization
                ])}
              </h4>
            </Col>
            <Col md={3} xs={12} className="Center">
              {isOnline(Admin.User.last_login) ? (
                <div>
                  <span class="dot green" />
                  <span class="dot-text">Online</span>
                </div>
              ) : (
                <div>
                  <span class="dot red" />
                  <span class="dot-text">Offline</span>
                </div>
              )}
              <h3 title="Date Joined">
                <i className="fas fa-birthday-cake" />{" "}
                <Moment format="MMM DD, YYYY">{Admin.User.date_joined}</Moment>
              </h3>
              <h3 title="Last Login">
                <i className="fas fa-sign-in-alt" />{" "}
                <Moment fromNow>{Admin.User.last_login}</Moment>
              </h3>
              <h3 title="Guild Points">
                <i className="fas fa-coins" /> {Admin.User.guild_points}
              </h3>
              <h3 title="Opt In">
                <i className="far fa-envelope-open" />{" "}
                {Admin.User.opt_in ? (
                  <i className="fas fa-check" />
                ) : (
                  <i className="fas fa-times" />
                )}
              </h3>
              <h3 title="Lfg">
                <i className="fas fa-users" />{" "}
                {Admin.User.lfg ? (
                  <i className="fas fa-check" />
                ) : (
                  <i className="fas fa-times" />
                )}
              </h3>
            </Col>
          </Row>
          <Row className="centerOnMobile borderedRow">
            <Col xs={12}>{ExperienceBar(Admin.User.experience_points)}</Col>
            <Col xs={12}>
              <Well className="userBio" bsSize="large">
                {Admin.User.bio ? Admin.User.bio : "No biography given."}
              </Well>
            </Col>
            <Col xs={12}>
              <Well className="userBio" bsSize="large">
                <i className="fas fa-award" /> Achievements
                <i className="fas fa-certificate" />
              </Well>
            </Col>
          </Row>
          <Row className="userConnections borderedRow">
            <Col md={3} xs={3}>
              <a
                href={Admin.User.discord_url}
                class="fab fa-discord fa-2x"
                target="_blank"
              />
            </Col>
            <Col md={3} xs={3}>
              <a
                href={Admin.User.twitch_url}
                class="fab fa-twitch fa-2x"
                target="_blank"
              />
            </Col>
            <Col md={3} xs={3}>
              <a
                href={Admin.User.twitter_url}
                class="fab fa-twitter fa-2x"
                target="_blank"
              />
            </Col>
            <Col md={3} xs={3}>
              <a
                href={Admin.User.youtube_url}
                class="fab fa-youtube fa-2x"
                target="_blank"
              />
            </Col>
          </Row>
          <Row>
            <h2 className="headerBanner">STATUS</h2>
          </Row>
          <Row className="checkBoxTable">
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus >= 7)}
                checked={Admin.User.is_active}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_active: !Admin.User.is_active
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Active</span>
                <span className="help">
                  Unselect this instead of deleting accounts
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus >= 7)}
                checked={Admin.User.is_superuser}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_superuser: !Admin.User.is_superuser
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Admin</span>
                <span className="help">
                  Grants access to admin panel and that this user has all
                  permissions without explicitly assigning them
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus >= 7)}
                checked={Admin.User.is_staff}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_staff: !Admin.User.is_staff
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">
                  Staff <span style={{ fontSize: "16px" }}>(Moderator)</span>
                </span>
                <span className="help">
                  Grants access to admin panel and ability to edit user
                  permissions of a lower status level
                </span>
              </Checkbox>
            </Col>
          </Row>
          <Row className="checkBoxTable">
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus >= 8)}
                checked={Admin.User.is_leader}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_leader: !Admin.User.is_leader
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Leader</span>
                <span className="help">
                  Will show up as a leader in guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus >= 7)}
                checked={Admin.User.is_advisor}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_advisor: !Admin.User.is_advisor
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Advisor</span>
                <span className="help">
                  Will show up as an advisor in guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 6)}
                checked={Admin.User.is_council}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_council: !Admin.User.is_council
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Council</span>
                <span className="help">
                  Will show up on the Council in the guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 5)}
                checked={Admin.User.is_general_officer}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_general_officer: !Admin.User.is_general_officer
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">General Officer</span>
                <span className="help">
                  Will show up as an Genral Officer in the guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 4)}
                checked={Admin.User.is_officer}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_officer: !Admin.User.is_officer
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Officer</span>
                <span className="help">
                  Will show up as an Officer in the guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 3)}
                checked={Admin.User.is_senior_member}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_senior_member: !Admin.User.is_senior_member
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Senior Member</span>
                <span className="help">
                  Will show up as a Member in the guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 2)}
                checked={Admin.User.is_junior_member}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_junior_member: !Admin.User.is_junior_member
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Junior Member</span>
                <span className="help">
                  Will show up as a Member in the guild roster
                </span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!(canEdit && loggedInUserStatus > 1)}
                checked={Admin.User.is_recruit}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_recruit: !Admin.User.is_recruit
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Recruit</span>
                <span className="help">
                  Will show up as a Member in the guild roster
                </span>
              </Checkbox>
            </Col>
          </Row>
          {User.is_leader || User.is_advisor || User.is_council
            ? [
                <Row>
                  <h2 className="headerBanner">PERMISSIONS</h2>
                </Row>,
                <Row className="checkBoxTable">
                  {this.renderUserGroupPermissions(
                    AuthenticationAndAuthorization.AllUserGroups,
                    Admin.User.groups || [],
                    canEdit
                  )}
                  {this.renderUserPermissions(
                    AuthenticationAndAuthorization.AllUserPermissions.sort(
                      (a, b) => a.codename.localeCompare(b.codename)
                    ) || [],
                    Admin.User.user_permissions || [],
                    canEdit
                  )}
                </Row>
              ]
            : null}
          <Row>
            <h2 className="headerBanner">ROLES</h2>
          </Row>
          <Row className="checkBoxTable">
            <Col md={12} xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_raid_leader}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_raid_leader: !Admin.User.is_raid_leader
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Raid Leader</span>
                <span className="help">Raid Leader</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_banker}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_banker: !Admin.User.is_banker
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Banker</span>
                <span className="help">Banker</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_recruiter}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_recruiter: !Admin.User.is_recruiter
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Recruiter</span>
                <span className="help">Recruiter</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_class_lead}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_class_lead: !Admin.User.is_class_lead
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Class Lead</span>
                <span className="help">Class Lead</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_crafter_lead}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_crafter_lead: !Admin.User.is_crafter_lead
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Crafter Lead</span>
                <span className="help">Crafter Lead</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_host}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_host: !Admin.User.is_host
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Host</span>
                <span className="help">Host of the VoT show</span>
              </Checkbox>
            </Col>
            <Col xs={12}>
              <Checkbox
                disabled={!canEdit}
                checked={Admin.User.is_lore_master}
                onClick={e =>
                  this.setState(prevState => ({
                    Admin: {
                      ...prevState.Admin,
                      User: {
                        ...prevState.Admin.User,
                        is_lore_master: !Admin.User.is_lore_master
                      }
                    }
                  }))
                }
              >
                <span className="checkBoxText">Lore Master</span>
                <span className="help">Creates lore books</span>
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center", margin: "20px" }}>
              <Button onClick={this.updateUserProfile}>
                {updating && !updated
                  ? [<i className="fa fa-spinner fa-spin" />, " UPDATE"]
                  : !updating && updated && !error
                  ? [
                      <i
                        className="fas fa-check"
                        style={{ color: "var(--color_emerald)" }}
                      />,
                      " UPDATE"
                    ]
                  : "UPDATE"}
              </Button>
            </Col>
          </Row>
        </Grid>
      ) : null
    ) : history.length > 2 ? (
      <Redirect to={history.goBack()} />
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(UserProfile);
