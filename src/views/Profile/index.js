import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  InputGroup,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ButtonToolbar,
  Image,
  Checkbox
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { Redirect } from "react-router-dom";
import Moment from "react-moment";
import {
  updateProfile,
  getCharacters,
  postCharacter,
  editCharacter,
  deleteCharacter,
  clearUserApi
} from "../../actions/User";
import Select from "react-select";
import "./styles.css";
import "./stylesM.css";
import {
  raceRoleClassOptions,
  raceOptions,
  roleOptions,
  classOptions,
  professionOptions,
  professionSpecializationOptions
} from "../../helpers";
import { selectStyles } from "../../helpers/styles";
import FormData from "form-data";
import { withAlert } from "react-alert";
import { ExperienceBar } from "../../components/ExperienceBar";
import ConfirmAction from "../../components/ConfirmAction";

const mapStateToProps = ({ User }) => ({
  User
});

const mapDispatchToProps = {
  updateProfile,
  getCharacters,
  postCharacter,
  editCharacter,
  deleteCharacter,
  clearUserApi
};

class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      id: "",
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      profile_image: null,
      is_staff: false,
      is_superuser: false,
      date_joined: "",
      last_login: "",
      bio: "",
      primary_role: "",
      primary_class: "",
      secondary_role: "",
      secondary_class: "",
      profession: "",
      profession_specialization: "",
      discord_url: "",
      twitter_url: "",
      twitch_url: "",
      youtube_url: ""
    };
  }

  static propTypes = {
    User: PropTypes.object,
    token: PropTypes.number,
    id: PropTypes.number,
    username: PropTypes.string,
    profile_image: PropTypes.object,
    is_superuser: PropTypes.bool,
    is_staff: PropTypes.bool,
    bio: PropTypes.string,
    primary_role: PropTypes.string,
    primary_class: PropTypes.string,
    secondary_role: PropTypes.string,
    secondary_class: PropTypes.string,
    date_joined: PropTypes.string,
    discord_url: PropTypes.string,
    twitter_url: PropTypes.string,
    twitch_url: PropTypes.string,
    youtube_url: PropTypes.string
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { User, getCharacters, clearUserApi } = this.props;
    const { id, token } = User;
    getCharacters(id, token);
    clearUserApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const {
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error,
      Characters
    } = props.User;
    const {
      token,
      id,
      profile_image,
      username,
      email,
      first_name,
      last_name,
      opt_in,
      lfg,
      is_superuser,
      is_staff,
      date_joined,
      last_login,
      bio,
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      discord_url,
      twitter_url,
      twitch_url,
      youtube_url,
      experience_points,
      guild_points
    } = this.state.token ? this.state : props.User;
    const { password } = this.state;
    this.setState({
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error,
      token,
      id,
      username,
      password,
      email,
      first_name,
      last_name,
      opt_in,
      lfg,
      profile_image,
      is_superuser,
      is_staff,
      date_joined,
      last_login,
      bio,
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      date_joined,
      discord_url,
      twitter_url,
      twitch_url,
      youtube_url,
      experience_points,
      guild_points,
      Characters
    });
  };

  componentWillUnmount() {
    const { clearUserApi } = this.props;
    clearUserApi();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  selectOnChange = (e, a, name, id) => {
    const { editCharacter, User } = this.props;
    let payload;
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
        else if (name === "race") {
          payload = { [name]: null, role: null, character_class: null };
          editCharacter(id, User.token, payload);
        } else if (name === "role") {
          payload = { [name]: null, character_class: null };
          editCharacter(id, User.token, payload);
        } else if (name === "character_class") {
          payload = { [name]: null };
          editCharacter(id, User.token, payload);
        }
        break;
      case "select-option":
        switch (name) {
          case "primary_race":
            this.setState({
              [name]: e.value,
              primary_role: "",
              primary_class: ""
            });
            break;
          case "primary_role":
            this.setState({ [name]: e.value, primary_class: "" });
            break;
          case "primary_class":
            this.setState({ [name]: e.value });
            break;
          case "secondary_race":
            this.setState({
              [name]: e.value,
              secondary_role: "",
              secondary_class: ""
            });
            break;
          case "secondary_role":
            this.setState({ [name]: e.value, secondary_class: "" });
            break;
          case "secondary_class":
            this.setState({ [name]: e.value });
            break;
          case "profession":
            this.setState({ [name]: e.value, profession_specialization: "" });
            break;
          case "profession_specialization":
            this.setState({ [name]: e.value });
            break;
          default:
            if (name === "race")
              payload = { [name]: e.value, role: null, class: null };
            if (name === "role") payload = { [name]: e.value, class: null };
            if (name === "character_class") payload = { [name]: e.value };
            editCharacter(id, User.token, payload);
        }
    }
  };

  setImage = e => {
    const { alert } = this.props;
    var file = e.target.files[0];
    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => this.setState({ profile_image: reader.result });
    }
  };

  validateUsername() {
    const { username } = this.state;
    if (username) {
      const { length } = username;
      if (length > 4) return "success";
      else if (length > 2) return "warning";
      else if (length > 0) return "error";
    }
    return null;
  }

  validatePassword() {
    const { password } = this.state;
    const { length } = password;
    if (this.hasSpecialChar(password)) return "success";
    else if (length === 0) return null;
    else if (length > 7) return "warning";
    else if (length > 0 && length < 7) return "error";
    return null;
  }

  validateEmail() {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const { email } = this.state;
    const { length } = email;
    if (length === 0) return null;
    else if (validator.test(email)) return "success";
    else if (!validator.test(email)) return "error";
    return null;
  }

  cantSubmit = () => {
    if (
      (this.validateUsername() === "success" ||
        this.validateUsername() === "warning") &&
      (this.validatePassword() === null ||
        this.validatePassword() === "success" ||
        this.validatePassword() === "warning") &&
      (this.validateEmail() === null ||
        this.validateEmail() === "success" ||
        this.validateEmail() === "warning")
    )
      return true;

    return false;
  };

  hasSpecialChar = s => /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s);

  updateProfile = () => {
    const {
      token,
      id,
      username,
      password,
      email,
      first_name,
      last_name,
      opt_in,
      lfg,
      profile_image,
      bio,
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      discord_url,
      twitter_url,
      twitch_url,
      youtube_url
    } = this.state;

    let payload = new FormData();
    // payload.append('profile_image', profile_image, profile_image.fileName)
    payload.append("profile_image", profile_image);
    payload.append("username", username);
    if (password) payload.append("password", password);
    payload.append("email", email);
    payload.append("first_name", first_name);
    payload.append("last_name", last_name);
    payload.append("opt_in", opt_in);
    payload.append("lfg", lfg);
    payload.append("bio", bio);
    payload.append("primary_race", primary_race);
    payload.append("primary_role", primary_role);
    payload.append("primary_class", primary_class);
    payload.append("secondary_race", secondary_race);
    payload.append("secondary_role", secondary_role);
    payload.append("secondary_class", secondary_class);
    payload.append("profession", profession);
    payload.append("profession_specialization", profession_specialization);
    payload.append("discord_url", discord_url);
    payload.append("twitter_url", twitter_url);
    payload.append("twitch_url", twitch_url);
    payload.append("youtube_url", youtube_url);

    this.props.updateProfile(id, token, payload);
  };

  onCharacterChange = e => {
    const { User, editCharacter } = this.props;
    const { id, name, value } = e.target;
    const payload = { [name]: value };
    editCharacter(id, User.token, payload);
  };

  renderCharacters = Characters =>
    Characters.map(c => {
      const { User, deleteCharacter } = this.props;
      let { id, name, level, race, role, character_class } = c;
      return (
        <Row key={id} className="borderedRow CharacterContainer">
          <Col md={3}>
            <FormGroup>
              <ControlLabel>NAME</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <ConfirmAction
                    Action={e => deleteCharacter(User.token, id)}
                    Disabled={false}
                    Icon={<i className="fa fa-trash-alt" />}
                    hasPermission={true}
                    Size="small"
                    Class="pull-right"
                    Title={name}
                  />
                </InputGroup.Addon>
                <FormControl
                  id={id}
                  value={name}
                  name="name"
                  type="text"
                  onChange={this.onCharacterChange}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={1}>
            <FormGroup>
              <ControlLabel>Level</ControlLabel>
              <FormControl
                id={id}
                value={level}
                min={1}
                max={60}
                type="number"
                name="level"
                onChange={this.onCharacterChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <ControlLabel>RACE</ControlLabel>
            <FormGroup>
              <Select
                name="race"
                value={{ value: race, label: race }}
                onChange={(e, a) => this.selectOnChange(e, a, "race", id)}
                options={raceOptions}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <ControlLabel>ROLE</ControlLabel>
            <FormGroup>
              <Select
                name="role"
                value={{ value: role, label: role }}
                onChange={(e, a) => this.selectOnChange(e, a, "role", id)}
                options={race ? raceRoleClassOptions[race].roleOptions : []}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!race}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <ControlLabel>CLASS</ControlLabel>
            <FormGroup>
              <Select
                name="character_class"
                value={{ value: character_class, label: character_class }}
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "character_class", id)
                }
                options={
                  race ? raceRoleClassOptions[race].classOptions[role] : []
                }
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!role}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
        </Row>
      );
    });

  render() {
    const { postCharacter, history } = this.props;
    const canSubmit = !this.cantSubmit();
    const {
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error,
      token,
      id,
      username,
      password,
      email,
      first_name,
      last_name,
      profile_image,
      opt_in,
      lfg,
      is_superuser,
      is_staff,
      date_joined,
      last_login,
      bio,
      primary_race,
      primary_role,
      primary_class,
      secondary_race,
      secondary_role,
      secondary_class,
      profession,
      profession_specialization,
      discord_url,
      twitter_url,
      twitch_url,
      youtube_url,
      experience_points,
      guild_points,
      Characters
    } = this.state;
    return !token ? (
      <Redirect to="/login" />
    ) : (
      <Grid className="Profile Container fadeIn">
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
              onClick={this.updateProfile}
              disabled={canSubmit}
              className="pull-left"
            >
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
            <Button
              onClick={() => history.push(`/profile/${id}`)}
              className="pull-right"
            >
              Public Profile
            </Button>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">ACCOUNT</h2>
        </Row>
        <Row className="Center borderedRow">
          <Col md={3}>
            <Image
              src={profile_image}
              className="ProfileImages"
              responsive
              rounded
            />
            <ControlLabel>Profile Picture</ControlLabel>
            <FormControl
              style={{ margin: "auto" }}
              type="file"
              label="File"
              name="profile_image"
              onChange={this.setImage}
            />
          </Col>
          <Col md={3} xs={12}>
            <h3>
              <i className="fas fa-birthday-cake" />{" "}
              <Moment format="MMM DD, YYYY">{date_joined}</Moment>
            </h3>
          </Col>
          <Col md={3} xs={12}>
            <h3>
              <i className="fas fa-sign-in-alt" />{" "}
              <Moment fromNow>{last_login}</Moment>
            </h3>
          </Col>
          <Col md={3} xs={12}>
            <h3>
              <i className="fas fa-coins" /> {guild_points}
            </h3>
          </Col>
          <Col xs={12}>{ExperienceBar(experience_points)}</Col>
        </Row>
        <Row className="borderedRow">
          <Col md={3}>
            <FormGroup validationState={this.validateUsername()}>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                value={username}
                type="text"
                name="username"
                placeholder="Username"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup validationState={this.validatePassword()}>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={password}
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.onChange}
              />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup validationState={this.validateEmail()}>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                value={email}
                type="email"
                name="email"
                placeholder="Email"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={2} sm={6}>
            <FormGroup>
              <ControlLabel>First Name</ControlLabel>
              <FormControl
                value={first_name}
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <ControlLabel>Last Name</ControlLabel>
              <FormControl
                value={last_name}
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <Checkbox
              checked={opt_in}
              onClick={() => this.setState({ opt_in: !opt_in })}
            >
              <span className="checkBoxText">Opt In</span>
              <span className="help">
                Check if you would like to recieve emails.
              </span>
            </Checkbox>
          </Col>
          <Col md={12}>
            <Checkbox
              checked={lfg}
              onClick={() => this.setState({ lfg: !lfg })}
            >
              <span className="checkBoxText">Lfg</span>
              <span className="help">
                Check if you would like to recieve messages for events that
                match your characters level, role, and class.
              </span>
            </Checkbox>
          </Col>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Biography</ControlLabel>
              <FormControl
                value={bio}
                componentClass="textarea"
                type="textarea"
                name="bio"
                wrap="hard"
                placeholder="Bio"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">CONNECTIONS</h2>
        </Row>
        <Row className="borderedRow">
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Discord</ControlLabel>
              <FormControl
                value={discord_url}
                name="discord_url"
                type="text"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Twitch</ControlLabel>
              <FormControl
                value={twitch_url}
                name="twitch_url"
                type="text"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>Twitter</ControlLabel>
              <FormControl
                value={twitter_url}
                name="twitter_url"
                type="text"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <ControlLabel>YouTube</ControlLabel>
              <FormControl
                value={youtube_url}
                name="youtube_url"
                type="text"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">PRIMARY</h2>
        </Row>
        <Row className="borderedRow">
          <Col md={4}>
            <ControlLabel>RACE</ControlLabel>
            <FormGroup>
              <Select
                value={
                  primary_race
                    ? { value: primary_race, label: primary_race }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "primary_race", id)
                }
                options={raceOptions}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <ControlLabel>ROLE</ControlLabel>
            <FormGroup>
              <Select
                value={
                  primary_role
                    ? { value: primary_role, label: primary_role }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "primary_role", id)
                }
                options={
                  primary_race
                    ? raceRoleClassOptions[primary_race].roleOptions
                    : []
                }
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!primary_race}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <ControlLabel>CLASS</ControlLabel>
            <FormGroup>
              <Select
                value={
                  primary_class
                    ? { value: primary_class, label: primary_class }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "primary_class", id)
                }
                options={
                  primary_race
                    ? raceRoleClassOptions[primary_race].classOptions[
                        primary_role
                      ]
                    : []
                }
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!primary_role}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">SECONDARY</h2>
        </Row>
        <Row className="borderedRow">
          <Col md={4}>
            <ControlLabel>RACE</ControlLabel>
            <FormGroup>
              <Select
                value={
                  secondary_race
                    ? { value: secondary_race, label: secondary_race }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "secondary_race", id)
                }
                options={raceOptions}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <ControlLabel>ROLE</ControlLabel>
            <FormGroup>
              <Select
                value={
                  secondary_role
                    ? { value: secondary_role, label: secondary_role }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "secondary_role", id)
                }
                options={
                  secondary_race
                    ? raceRoleClassOptions[secondary_race].roleOptions
                    : []
                }
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!secondary_race}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <ControlLabel>CLASS</ControlLabel>
            <FormGroup>
              <Select
                value={
                  secondary_class
                    ? { value: secondary_class, label: secondary_class }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "secondary_class", id)
                }
                options={
                  secondary_race
                    ? raceRoleClassOptions[secondary_race].classOptions[
                        secondary_role
                      ]
                    : []
                }
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!secondary_role}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">CRAFTING</h2>
        </Row>
        <Row className="borderedRow">
          <Col md={6}>
            <ControlLabel>Profession</ControlLabel>
            <FormGroup>
              <Select
                value={
                  profession ? { value: profession, label: profession } : null
                }
                onChange={(e, a) => this.selectOnChange(e, a, "profession", id)}
                options={professionOptions}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <ControlLabel>Specialization</ControlLabel>
            <FormGroup>
              <Select
                value={
                  profession_specialization
                    ? {
                        value: profession_specialization,
                        label: profession_specialization
                      }
                    : null
                }
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "profession_specialization", id)
                }
                options={professionSpecializationOptions[profession]}
                isClearable={true}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isDisabled={!profession}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={11} xs={10} style={{ padding: 0 }}>
            <h2 className="headerBanner">CHARACTERS</h2>
          </Col>
          <Col
            md={1}
            xs={2}
            className="AddCharacter"
            componentClass={Button}
            onClick={e => postCharacter(token, { author: id })}
          >
            <i className="fas fa-plus fa-2x" />
          </Col>
        </Row>
        {this.renderCharacters(Characters)}
        <Row>
          <Col md={12} style={{ textAlign: "center", margin: "20px" }}>
            <Button onClick={this.updateProfile} disabled={canSubmit}>
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
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Profile)
);
