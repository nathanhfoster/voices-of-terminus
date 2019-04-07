import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Redirect } from "react-router-dom";
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
  changeGroups,
  changePermissions,
  getUsers,
  createUser,
  deleteUser,
  updateUserProfile,
  clearUser
} from "../../actions/Admin";
import { getTickets } from "../../actions/Tickets";
import { defaultProfileImages } from "../../helpers/defaultProfileImages";
import PermissionsTable from "./PermissionsTable";
import OverviewTable from "./OverviewTable";
import TicketTable from "./TicketsTable";
import { UserHasPermissions } from "../../helpers/userPermissions";

const mapStateToProps = ({
  AuthenticationAndAuthorization,
  Admin,
  User,
  Window
}) => ({
  AuthenticationAndAuthorization,
  Admin,
  User,
  Window
});

const mapDispatchToProps = {
  changeGroups,
  changePermissions,
  getUsers,
  createUser,
  deleteUser,
  updateUserProfile,
  clearUser,
  getTickets
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

  /*shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    const { Admin } = this.state;
    const { Tickets } = nextProps.Admin;
    const currentTickets = Admin.Tickets;
    const sameTickets = deepEqual(
      Tickets.map(t => t.id),
      currentTickets.map(t => t.id)
    );
    if (sameTickets) shouldUpdate = false;
    return shouldUpdate;
  }*/

  componentDidMount() {
    const { getUsers, clearUser, getTickets } = this.props;
    getUsers();
    clearUser();
    getTickets();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const {
      AuthenticationAndAuthorization,
      Admin,
      User,
      Window,
      history
    } = props;
    const { pathname } = history.location;
    this.setState({
      AuthenticationAndAuthorization,
      Admin,
      User,
      Window,
      eventKey: pathname,
      history
    });
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
    const { updateUserProfile } = this.props;
    const {
      AuthenticationAndAuthorization,
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
      match,
      eventKey,
      show
    } = this.state;
    const { Users, Tickets } = Admin;
    const canViewTickets =
      User.is_leader ||
      User.is_advisor ||
      User.is_council ||
      User.is_general_officer ||
      User.is_officer;

    return eventKey.includes("admin") &&
      !(
        eventKey.includes("overview") ||
        eventKey.includes("permissions") ||
        eventKey.includes("tickets") ||
        eventKey.includes("edit")
      ) ? (
      <Redirect to="/admin/overview" />
    ) : User.is_superuser || User.is_staff ? (
      <Grid className="Admin Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">ADMIN</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_user"
            ) && (
              <Button onClick={this.handleShow}>
                <i className="fas fa-plus" /> User
              </Button>
            )}
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_article"
            ) && (
              <Button onClick={() => history.push("/article/new")}>
                <i className="fas fa-plus" /> Article
              </Button>
            )}
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_newsletter"
            ) && (
              <Button onClick={() => history.push("/newsletter/new")}>
                <i className="fas fa-plus" /> Newsletter
              </Button>
            )}
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_event"
            ) && (
              <Button onClick={() => history.push("/calendar/new/event")}>
                <i className="far fa-calendar-plus" /> Event
              </Button>
            )}
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_poll"
            ) && (
              <Button onClick={() => history.push("/poll/new")}>
                <i className="fas fa-plus" /> Poll
              </Button>
            )}
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_ticket"
            ) && (
              <Button onClick={() => history.push("/ticket/new")}>
                <i className="fas fa-plus" /> Ticket
              </Button>
            )}
            <Button
              disabled={!User.is_superuser}
              onClick={() => history.push("/polls")}
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
          >
            <Tab
              eventKey={`/admin/overview`}
              title={"Overview"}
              unmountOnExit={true}
            >
              {OverviewTable(AuthenticationAndAuthorization, Users, User)}
            </Tab>
            <Tab
              eventKey={`/admin/permissions`}
              title={"Permissions"}
              unmountOnExit={true}
            >
              {PermissionsTable(Users, User, updateUserProfile)}
            </Tab>
            {canViewTickets && (
              <Tab
                eventKey={`/admin/tickets`}
                title={"Tickets"}
                unmountOnExit={true}
              >
                {TicketTable(Tickets, history, eventKey)}
              </Tab>
            )}
          </Tabs>
        </Row>
        {show ? (
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={show}
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
                      <FormGroup
                        validationState={this.validateReEnterPassword()}
                      >
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
        ) : null}
      </Grid>
    ) : User.token ? (
      <Redirect to={history.goBack()} />
    ) : (
      <Redirect to="/login" />
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Admin);
