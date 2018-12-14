import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Redirect, Link } from "react-router-dom";
import Moment from "react-moment";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
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
  Checkbox
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import { getUsers, createUser, deleteUser } from "../../actions/Admin";
import { statusLevelInt, statusLevelString } from "../../helpers";
import { defaultProfileImages } from "../../helpers/defaultProfileImages";

const mapStateToProps = ({ Admin, User, Window }) => ({
  Admin,
  User,
  Window
});

const mapDispatchToProps = {
  createUser,
  getUsers,
  deleteUser
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
    this.props.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, Window } = props;
    this.setState({ Admin, User, Window });
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
    const {
      Admin,
      User,
      Window,
      username,
      password,
      reEnterPassword,
      email,
      profile_image,
      opt_in
    } = this.state;
    const { Users } = Admin;

    return User.is_superuser || User.is_staff ? (
      <Grid className="Admin Container fadeIn-2">
        <PageHeader className="pageHeader">ADMIN</PageHeader>
        <Row className="ActionToolbarRow">
          <Col
            md={12}
            xs={12}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button onClick={this.handleShow}>
              <i className="fas fa-plus" /> User
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_article)}
              onClick={() => this.props.history.push("/articles/new/article")}
            >
              <i className="fas fa-plus" /> Article
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_newsletter)}
              onClick={() =>
                this.props.history.push("/articles/new/newsletter")
              }
            >
              <i className="fas fa-plus" /> Newsletter
            </Button>
            <Button
              onClick={() =>
                this.props.history.push("/articles/new/newsletter")
              }
              disabled
            >
              <i className="fas fa-plus" /> Event
            </Button>
          </Col>
        </Row>
        <Row>
          <ReactTable
            loading={!Users}
            data={Users}
            columns={[
              {
                Header: <i className="fas fa-gavel" />,
                columns: [
                  {
                    Header: <i className="fa fa-trash-alt" />,
                    accessor: "id",
                    filterable: false,
                    maxWidth: 42,
                    Cell: props => (
                      <Button
                        disabled={!(User.is_superuser && User.is_leader)}
                        onClick={() =>
                          this.deleteThisUser(
                            this.props.User.token,
                            props.value
                          )
                        }
                        bsSize="small"
                      >
                        <i className="fa fa-trash-alt" />
                      </Button>
                    )
                  }
                ]
              },
              {
                Header: <i className="fas fa-user-shield"> INFO</i>,
                columns: [
                  {
                    Header: <i className="far fa-envelope-open" />,
                    accessor: "opt_in",
                    filterable: false,
                    maxWidth: 36,
                    Cell: props =>
                      props.value ? (
                        <i className="fas fa-check" />
                      ) : (
                        <i className="fas fa-times" />
                      ),
                    Footer: Users => (
                      <span>
                        <i className="fas fa-check" />{" "}
                        <strong style={{ color: "var(--primaryColor)" }}>
                          {Users.data.reduce(
                            (acc, curr) => acc + curr.opt_in,
                            0
                          )}
                        </strong>
                      </span>
                    )
                  },
                  {
                    Header: "Username",
                    accessor: "username",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 125,
                    Footer: Users => (
                      <span>
                        <i className="fas fa-users" />{" "}
                        <strong style={{ color: "var(--primaryColor)" }}>
                          {Users.data.length}
                        </strong>
                      </span>
                    ),
                    Cell: props => (
                      <Link to={"admin/user/profile/" + props.original.id}>
                        {props.value}
                      </Link>
                    )
                  },
                  {
                    Header: "Email",
                    accessor: "email",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true
                  }
                ]
              },
              {
                Header: <i className="fas fa-id-badge"> PERMISSIONS</i>,
                columns: [
                  {
                    Header: "Admin?",
                    accessor: "is_superuser",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 75,
                    Footer: Users => (
                      <span>
                        <i className="fas fa-unlock-alt" />{" "}
                        <strong style={{ color: "var(--primaryColor)" }}>
                          {Users.data.reduce(
                            (acc, curr) => acc + curr.is_superuser,
                            0
                          )}
                        </strong>
                      </span>
                    ),
                    Cell: props => String(props.value)
                  },
                  {
                    Header: "Mod?",
                    accessor: "is_staff",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 75,
                    Footer: Users => (
                      <span>
                        <i className="fas fa-unlock" />{" "}
                        <strong style={{ color: "var(--primaryColor)" }}>
                          {Users.data.reduce(
                            (acc, curr) => acc + curr.is_staff,
                            0
                          )}
                        </strong>
                      </span>
                    ),
                    Cell: props => String(props.value)
                  },
                  {
                    Header: "Status",
                    id: "status",
                    accessor: User =>
                      statusLevelInt({
                        is_leader: User.is_leader,
                        is_advisor: User.is_advisor,
                        is_council: User.is_council,
                        is_general_officer: User.is_general_officer,
                        is_officer: User.is_officer,
                        is_senior_member: User.is_senior_member,
                        is_junior_member: User.is_junior_member,
                        is_recruit: User.is_recruit
                      }),
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value[1], { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 125,
                    Cell: props => statusLevelString(props.value)
                  }
                ]
              },
              {
                Header: <i className="fas fa-dungeon"> IN GAME</i>,
                columns: [
                  {
                    Header: "Role",
                    accessor: "primary_role",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 120
                  },
                  {
                    Header: "Class",
                    accessor: "primary_class",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 120
                  },
                  {
                    Header: "Profession",
                    accessor: "profession",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 120
                  },
                  {
                    Header: "Specialization",
                    accessor: "profession_specialization",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 120
                  }
                ]
              },
              {
                Header: <i className="fas fa-hiking"> ACTIVITY</i>,
                columns: [
                  {
                    Header: "Last Login",
                    accessor: "last_login",
                    maxWidth: 100,
                    Cell: props => (
                      <Moment format="YYYY-MM-DD">{props.value}</Moment>
                    ),
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true
                  },
                  {
                    Header: "Joined",
                    accessor: "date_joined",
                    maxWidth: 100,
                    Cell: props => (
                      <Moment format="YYYY-MM-DD">{props.value}</Moment>
                    ),
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true
                  },
                  {
                    Header: "XP",
                    accessor: "experience_points",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: [filter.id] }),
                    filterAll: true,
                    maxWidth: 60,
                    Footer: Users => (
                      <span>
                        <i className="fas fa-level-up-alt" />{" "}
                        <strong style={{ color: "var(--primaryColor)" }}>
                          {Math.max(
                            ...Users.data.map(user => user.experience_points)
                          )}
                        </strong>
                      </span>
                    )
                  }
                ]
              }
            ]}
            filterable
            // defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value)}
            showFilters
            showPageSizeOptions
            showPaginationBottom
            showPageJump
            defaultSorted={[{ id: "date_joined", desc: true }]}
            defaultPageSize={Window.isMobile ? 10 : 15}
            pageSizeOptions={[5, 10, 15, 20, 50, 100]}
            multiSort={true}
            previousText={<i className="fas fa-arrow-left" />}
            nextText={<i className="fas fa-arrow-right" />}
          />
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
              <Form className="Container fadeIn-2">
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
    ) : (
      <Redirect to={this.props.history.goBack()} />
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)
);
