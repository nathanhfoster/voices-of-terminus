import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import "./styles.css";
import {
  Form,
  FormGroup,
  Grid,
  Row,
  Col,
  FormControl,
  ControlLabel,
  Checkbox,
  Button,
  PageHeader,
  ButtonGroup,
  Modal,
  Image
} from "react-bootstrap";
import { login, refreshPatchUser } from "../../actions/App";
import { createUser } from "../../actions/User";
import FormData from "form-data";
import { Redirect } from "react-router-dom";
import { withAlert } from "react-alert";
import { defaultProfileImages } from "../../helpers/defaultProfileImages";

const mapStateToProps = ({ User }) => ({
  User
});

const mapDispatchToProps = {
  login,
  createUser,
  refreshPatchUser
};

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = {
      username: "",
      password: "",
      reEnterPassword: "",
      email: "",
      opt_in: false,
      bio: "",
      primary_role: "",
      primary_class: "",
      primary_role: "",
      primary_class: "",
      show: false,
      rememberMe: false,
      profile_image: defaultProfileImages[0]
    };
  }

  static propTypes = {
    User: PropTypes.object,
    token: PropTypes.number,
    id: PropTypes.number,
    profile_image: PropTypes.string,
    is_superuser: PropTypes.bool,
    is_staff: PropTypes.bool,
    bio: PropTypes.string,
    primary_role: PropTypes.string,
    primary_class: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    createUser: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  };

  static defaultProps = {
    username: "",
    password: "",
    reEnterPassword: "",
    email: "",
    opt_in: false,
    bio: "",
    primary_role: "",
    primary_class: "",
    primary_role: "",
    primary_class: "",
    show: false,
    rememberMe: false
  };

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

  login = e => {
    const { login } = this.props;
    e.preventDefault();
    const { username, password, rememberMe } = this.state;
    login(username, password, rememberMe);
  };

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
      <div className="defaultImageContainer">
        <Image
          src={v}
          className="ProfileImages"
          onClick={() =>
            this.setState({ profile_image: defaultProfileImages[i] })
          }
        />
      </div>
    ));

  Redirect = () => {
    const { User, history, refreshPatchUser } = this.props;
    refreshPatchUser(User.token, User.id);
    return <Redirect to={history.goBack()} />;
  };

  render() {
    const canSubmit = !this.cantSubmit();
    const { User, history } = this.props;
    const {
      username,
      password,
      reEnterPassword,
      email,
      profile_image,
      opt_in,
      show
    } = this.state;

    return User.token ? (
      history.length > 2 ? (
        this.Redirect()
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Grid className="Login Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">LOGIN</PageHeader>
        </Row>
        <Row>
          <Form className="LoginForm" onSubmit={this.login} method="post">
            <Row>
              <Col md={6} smOffset={3} xs={12}>
                <FormGroup controlId="formHorizontalUsername">
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
            </Row>
            <Row>
              <Col md={6} smOffset={3} xs={12}>
                <FormGroup controlId="formHorizontalPassword">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.onChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <FormGroup>
                <Col smOffset={3} xs={12}>
                  <Checkbox
                    onClick={e =>
                      this.setState({ rememberMe: e.target.checked })
                    }
                  >
                    Remember me
                  </Checkbox>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col md={12} className="Center">
                <ButtonGroup>
                  <Button type="submit">Sign in</Button>
                  <Button onClick={() => this.setState({ show: true })}>
                    Create Account
                  </Button>
                  <Button onClick={() => this.setState({ show: true })}>
                    Forgot Password
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Form>
          {show ? (
            <Row>
              <Modal
                backdrop={false}
                {...this.props}
                show={show}
                onHide={() => this.setState({ show: false })}
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
                            Check if you would like to recieve emails
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
                  <Button onClick={this.createUserAccount} disabled={canSubmit}>
                    Create
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          ) : null}
        </Row>
      </Grid>
    );
  }
}

export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
);
