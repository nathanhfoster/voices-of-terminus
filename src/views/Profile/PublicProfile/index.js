import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  Well,
  Image,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getUser, setUser } from "../../../actions/App";
import {
  MainAltCharacter,
  isOnline,
  isEmpty,
  statusLevelInt,
  statusLevelString,
  roleClassIcon,
  professionIcon,
  renderRoles
} from "../../../helpers";
import Moment from "react-moment";
import { ExperienceBar } from "../../../components/ExperienceBar";

const mapStateToProps = ({ User, Admin }) => ({
  User,
  Admin
});

const mapDispatchToProps = {
  getUser,
  setUser
};

class PublicProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {
    Admin: {
      User: {
        Characters: []
      }
    }
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { Users } = this.props.Admin;
    const { id } = this.props.match.params;
    const UserIndex = Users && Users.findIndex(user => user.id == id);
    if (UserIndex != -1) this.props.setUser(Users[UserIndex]);
    this.props.getUser(id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { history } = props;
    const { User } = props.Admin;
    this.setState({ User, history });
  };

  renderDividedText = text =>
    text.map((txt, i) =>
      txt ? (
        <span>{`${txt} | `}</span>
      ) : i === 0 ? (
        <i className="fas fa-ban" />
      ) : null
    );

  renderCharacters = Characters =>
    Characters.map((c, i) => {
      let {
        id,
        name,
        level,
        race,
        role,
        character_class,
        profession,
        profession_specialization,
        main,
        alt,
        date_created,
        last_modified
      } = c;
      return (
        <Row className="CharacterCards">
          <Col xs={3}>
            <Image src={roleClassIcon(character_class || role)} />
            <span>{` (${level})`}</span>
          </Col>
          <Col xs={3}>
            <span>{name}</span>
          </Col>
          <Col xs={3}>
            <span>{profession}</span>
          </Col>
          <Col xs={3}>
            <span>{profession_specialization}</span>
          </Col>
          <Col xs={4}>
            <span>{race}</span>
          </Col>
          <Col xs={4}>
            <span>{role}</span>
          </Col>
          <Col xs={4}>
            <span>{character_class}</span>
          </Col>
        </Row>
      );
    });

  render() {
    const CurrentUser = this.props.User;
    const { is_superuser, is_staff } = CurrentUser;
    const { User, history } = this.state;
    const { id } = this.props.match.params;
    const {
      last_login,
      is_raid_leader,
      is_banker,
      is_recruiter,
      is_class_lead,
      is_crafter_lead,
      is_host
    } = User ? User : {};


    const MainCharacter = MainAltCharacter(User, "main");
    const AltCharacter = MainAltCharacter(User, "alt");

    return !isEmpty(User) ? (
      <Grid className="PublicProfile Container fadeIn">
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {is_superuser || is_staff ? (
              <Button
                onClick={() => history.push(`/admin/edit/user/${id}/`)}
                className="pull-right"
              >
                <i className="fas fa-database" />
              </Button>
            ) : null}
            {CurrentUser.id == id ? (
              <Button
                onClick={() => history.push("/profile/")}
                className="pull-right"
              >
                <i className="fa fa-pencil-alt" />
              </Button>
            ) : null}
          </Col>
        </Row>
        <Row className="Center">
          <Col md={4} xs={12} className="Center">
            <Image
              title="Profile Image"
              src={User.profile_image}
              className="ProfileImages"
              responsive
              rounded
            />
          </Col>
          <Col md={5} xs={12}>
            {User.username && (
              <h1 title="User Name">{User.username.toUpperCase()}</h1>
            )}
            {statusLevelInt(CurrentUser) > 0 && (
              <span title="First and Last Name" className="firstLastName">
                {User.first_name} {User.last_name}
              </span>
            )}
            <h2 title="Status">{statusLevelString(statusLevelInt(User))}</h2>
            <div title="Roles" className="userRoles">
              {renderRoles(User)}
            </div>
            <h4 title="Primary Class Icon">
              <Image
                src={roleClassIcon(MainCharacter.character_class)}
                style={{ height: "24px" }}
              />
              <strong title="Primary | Race | Role | Class |"> Primary</strong>
              <span> | </span>
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
              <strong> Profession</strong>
              <span> | </span>
              {this.renderDividedText([
                MainCharacter.profession,
                MainCharacter.profession_specialization
              ])}
            </h4>
            <h4 title="Seconday Class Icon">
              <Image
                src={roleClassIcon(AltCharacter.character_class)}
                style={{ height: "26px" }}
              />{" "}
              <strong title="Secondary | Race | Role | Class |">
                Secondary
              </strong>
              <span> | </span>
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
              <strong> Profession</strong>
              <span> | </span>
              {this.renderDividedText([
                AltCharacter.profession,
                AltCharacter.profession_specialization
              ])}
            </h4>
          </Col>
          <Col md={3} xs={12} className="Center">
            {isOnline(last_login) ? (
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
              <Moment format="MMM DD, YYYY">{User.date_joined}</Moment>
            </h3>
            <h3 title="Last Login">
              <i className="fas fa-sign-in-alt" />{" "}
              <Moment fromNow>{User.last_login}</Moment>
            </h3>
            <h3 title="Guild Points">
              <i className="fas fa-coins" /> {User.guild_points}
            </h3>
            <h3 title="Lfg">
              <i className="fas fa-users" />
              {" Lfg "}
              {User.lfg ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-times" />
              )}
            </h3>
          </Col>
        </Row>
        <Row className="Center">
          <Col xs={12}>{ExperienceBar(User.experience_points)}</Col>
          <Col xs={12}>
            <Well className="userBio" bsSize="large">
              {User.bio ? User.bio : "No biography given."}
            </Well>
          </Col>
          <Col xs={12}>
            <h3>Achievements</h3>
            <Well className="userBio" bsSize="large">
              <i className="fas fa-award" />
              <i className="fas fa-certificate" />
              <i className="fas fa-trophy" />
              <i className="fas fa-star" />
              <i className="fab fa-optin-monster" />
              <i className="fas fa-vihara" />
              <i className="fas fa-pastafarianism" />
              <i className="fas fa-shield-alt" />
              <i className="fas fa-user-shield" />
              <i className="fas fa-bolt" />
              <i className="fas fa-ban" />
              <i className="fas fa-binoculars" />
              <i className="fas fa-bell" />
              <i className="fas fa-book-dead" />
              <i className="fas fa-book" />
              <i className="fas fa-brain" />
              <i className="fas fa-calendar-alt" />
              <i className="fas fa-chalkboard-teacher" />
              <i className="fas fa-edit" />
              <i className="fas fa-dumbbell" />
              <i className="fas fa-dungeon" />
              <i className="fas fa-fist-raised" />
              <i className="fab fa-fort-awesome" />
              <i className="fas fa-gamepad" />
              <i className="fab fa-galactic-senate" />
              <i className="fab fa-galactic-republic" />
              <i className="fas fa-gavel" />
              <i className="fas fa-gem" />
              <i className="fas fa-gopuram" />
              <i className="fas fa-graduation-cap" />
              <i className="fas fa-hammer" />
              <i className="fas fa-hands" />
              <i className="fas fa-hands-helping" />
              <i className="fas fa-hat-wizard" />
              <i className="fab fa-hotjar" />
              <i className="fas fa-jedi" />
              <i className="fab fa-jedi-order" />
              <i className="fab fa-joget" />
              <i className="fab fa-joomla" />
              <i className="fas fa-journal-whills" />
              <i className="fab fa-keycdn" />
              <i className="fas fa-khanda" />
              <i className="fab fa-mandalorian" />
              <i className="fas fa-microphone-alt" />
              <i className="far fa-newspaper" />
              <i className="fab fa-old-republic" />
              <i className="fab fa-phoenix-framework" />
              <i className="fas fa-poop" />
              <i className="fas fa-podcast" />
              <i className="fab fa-rebel" />
              <i className="fab fa-readme" />
              <i className="fas fa-ring" />
              <i className="fas fa-scroll" />
              <i className="fas fa-sign-in-alt" />
              <i className="fas fa-store" />
              <i className="fab fa-studiovinari" />
              <i className="fab fa-wolf-pack-battalion" />
            </Well>
          </Col>
        </Row>
        {this.renderCharacters(User.Characters)}
        <Row className="userConnections">
          <Col md={3} xs={3}>
            <a
              href={User.discord_url}
              class="fab fa-discord fa-2x"
              target="_blank"
            />
          </Col>
          <Col md={3} xs={3}>
            <a
              href={User.twitch_url}
              class="fab fa-twitch fa-2x"
              target="_blank"
            />
          </Col>
          <Col md={3} xs={3}>
            <a
              href={User.twitter_url}
              class="fab fa-twitter fa-2x"
              target="_blank"
            />
          </Col>
          <Col md={3} xs={3}>
            <a
              href={User.youtube_url}
              class="fab fa-youtube fa-2x"
              target="_blank"
            />
          </Col>
        </Row>
      </Grid>
    ) : null;
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PublicProfile);
