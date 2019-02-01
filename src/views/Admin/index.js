import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import "react-table/react-table.css";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button,
  Image,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Tabs,
  Tab
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUserProfile,
  clearUser
} from "../../actions/Admin";
import { defaultProfileImages } from "../../helpers/defaultProfileImages";
import PermissionsTable from "./PermissionsTable";
import OverviewTable from "./OverviewTable";

const mapStateToProps = ({ Admin, User, Window }) => ({
  Admin,
  User,
  Window
});

const mapDispatchToProps = {
  createUser,
  getUsers,
  deleteUser,
  updateUserProfile,
  clearUser
};

class Admin extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.state = {
      username: "",
      password: "",
      reEnterPassword: "",
      email: "",
      opt_in: false,
      selected: null,
      show: false,
      profile_image: defaultProfileImages[0]
    };
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getUsers, clearUser } = this.props;
    getUsers();
    clearUser();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, Window, history } = props;
    const { pathname } = history.location;
    this.setState({ Admin, User, Window, eventKey: pathname, history });
  };

  componentWillUnmount() {
    const { clearUser } = this.props;
    clearUser();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

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

  handleShow = () => this.setState({ show: true });

  handleHide = () => this.setState({ show: false });

  createUserAccount = e => {
    e.preventDefault();
    const {
      username,
      password,
      email,
      bio,
      primary_role,
      primary_class,
      profile_image,
      opt_in
    } = this.state;
    let payload = new FormData();
    payload.append("profile_image", profile_image);
    payload.append("username", username);
    payload.append("password", password);
    payload.append("email", email);
    payload.append("opt_in", opt_in);

    this.props.createUser(payload);
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
    else if (length > 7) return "warning";
    else if (length > 0) return "error";
    return null;
  }

  validateReEnterPassword() {
    const { password, reEnterPassword } = this.state;
    const { length } = reEnterPassword;
    if (password === reEnterPassword && length > 0) return "success";
    else if (length > 0) return "error";
    return null;
  }

  validateEmail() {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const { email } = this.state;
    if (validator.test(email)) return "success";
    return null;
  }

  cantSubmit = () => {
    if (
      (this.validateUsername() === "success" ||
        this.validateUsername() === "warning") &&
      (this.validatePassword() === "success" ||
        this.validatePassword() === "warning") &&
      this.validateReEnterPassword() === "success" &&
      (this.validateEmail() === "success" || this.validateEmail() === "warning")
    )
      return true;

    return false;
  };

  hasSpecialChar = s => /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s);

  renderDefaultImages = images =>
    images.map((v, i) => (
      <Col xs={4}>
        <Image
          src={v}
          className="ProfileImages"
          onClick={() =>
            this.setState({ profile_image: defaultProfileImages[i] })
          }
        />
      </Col>
    ));

  deleteThisUser = (token, id) => this.props.deleteUser(token, id);

  render() {
    const canSubmit = !this.cantSubmit();
    const { token } = this.props.User;
    const { updateUserProfile } = this.props;
    const {
      Admin,
      User,
      Window,
      username,
      password,
      reEnterPassword,
      email,
      profile_image,
      opt_in,
      history,
      eventKey
    } = this.state;
    const { Users } = Admin;

    return eventKey.includes("admin") &&
      !(
        eventKey.includes("overview") ||
        eventKey.includes("permissions") ||
        eventKey.includes("edit")
      ) ? (
      <Redirect to="/admin/overview" />
    ) : User.is_superuser || User.is_staff ? (
      <Grid className="Admin Container fadeIn">
        <PageHeader className="pageHeader">ADMIN</PageHeader>
        <Row className="ActionToolbarRow">
          <Col
            md={8}
            xs={12}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button onClick={this.handleShow}>
              <i className="fas fa-plus" /> User
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_article)}
              onClick={() => history.push("/article/new/")}
            >
              <i className="fas fa-plus" /> Article
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_newsletter)}
              onClick={() => history.push("/newsletter/new")}
            >
              <i className="fas fa-plus" /> Newsletter
            </Button>
            <Button onClick={() => history.push("/newsletter/new")} disabled>
              <i className="fas fa-plus" /> Event
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={() => history.push("/poll/new/")}
            >
              <i className="fas fa-plus" /> Poll
            </Button>
          </Col>
          <Col md={4} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button
              disabled={!User.is_superuser}
              onClick={() => history.push("/polls/")}
            >
              <i className="fas fa-eye" /> Poll
            </Button>
          </Col>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey={eventKey}
            activeKey={eventKey}
            className="Tabs"
            onSelect={eventKey => {
              this.setState({ eventKey });
              history.push(eventKey);
            }}
            animation={false}
          >
            <Tab
              eventKey={`/admin/overview`}
              title={"Overview"}
              className="fadeIn"
              unmountOnExit={true}
            >
              {OverviewTable(Admin, User)}
            </Tab>
            <Tab
              eventKey={`/admin/permissions`}
              title={"Permissions"}
              className="fadeIn"
              unmountOnExit={true}
            >
              {PermissionsTable(Admin, User, updateUserProfile)}
            </Tab>
          </Tabs>
        </Row>
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={this.state.show}
            onHide={this.handleHide}
            dialogClassName="loginModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                Account Creation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="Container fadeIn">
                <Row>
                  <Col md={12}>
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
                  <Col md={12}>
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
                  <Col md={12}>
                    <FormGroup validationState={this.validateReEnterPassword()}>
                      <ControlLabel>Re-Enter Password</ControlLabel>
                      <FormControl
                        value={reEnterPassword}
                        type="password"
                        name="reEnterPassword"
                        placeholder="Re-Enter Password"
                        onChange={this.onChange}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
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
                </Row>
                <Row className="Center">
                  <Col md={12}>
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
                </Row>
                <Row className="Center">
                  <Col md={12}>
                    {this.renderDefaultImages(defaultProfileImages)}
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.createUserAccount}>Create</Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    ) : User.token ? (
      <Redirect to={this.props.history.goBack()} />
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)
);
