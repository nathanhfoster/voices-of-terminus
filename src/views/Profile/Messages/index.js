import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Modal,
  Form,
  FormControl,
  Button,
  ButtonToolbar,
  FormGroup,
  InputGroup,
  ControlLabel
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import {
  getMessages,
  updateMessage,
  createMessageGroup
} from "../../../actions/Messages";
import { getUsers } from "../../../actions/Admin";
import { withRouter, Redirect } from "react-router-dom";
import Moment from "react-moment";
import "./styles.css";
import "./stylesM.css";
import matchSorter from "match-sorter";
import Select from "react-select";
import { selectStyles } from "../../../helpers/styles";

const mapStateToProps = ({ Admin, User, Messages, Settings }) => ({
  Admin,
  User,
  Messages,
  Settings
});

const mapDispatchToProps = {
  getMessages,
  updateMessage,
  createMessageGroup,
  getUsers
};

class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      search: "",
      recipients: [],
      selectOptions: [],
      title: "",
      body: ""
    };
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { User } = this.props;
    const { Users } = this.props.Admin;
    const recipients = Users
      ? Users.filter(i => i.id === User.id).map(
          e => (e = { value: e.id, label: e.username, isFixed: true })
        )
      : [];
    this.setState({ recipients });
    const { pushMessages } = this.props.Settings;
    const { id, token } = this.props.User;
    if (!pushMessages) this.props.getMessages(id, token);
    this.props.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, Messages } = props;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username }))
      : [];
    this.setState({ User, Messages, selectOptions });
  };

  readMessage = messages => {
    const { token } = this.props.User;
    const payload = { is_read: true };
    for (let i = 0; i < messages.length; i++) {
      const { id } = messages[i];
      this.props.updateMessage(id, token, payload);
    }
  };

  hasUnreadMessage = messages => {
    for (let i = 0; i < messages.length; i++) {
      if (!messages[i].is_read) return false;
    }
    return true;
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSelectFilterChange = (recipients, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        recipients = this.state.recipients.filter(v => v.isFixed);
        break;
    }

    this.setState({ recipients });
  };

  renderMessagers = messages =>
    messages.map(group => {
      const {
        author,
        author_username,
        date_created,
        id,
        is_active,
        last_modified,
        title,
        uri
      } = group;
      const is_read = this.hasUnreadMessage(group.messages);
      const recentMessage = group.messages[0];
      const {
        //id: 4
        //is_read: false
        message_body,
        message_id,
        message_last_modified
        //recipient_group_id: 2
      } = recentMessage;
      return (
        <Row
          onClick={e => {
            e.preventDefault();
            this.readMessage(group.messages);
            this.setState({ show: true });
          }}
          className="Message borderedRow"
          style={
            !is_read
              ? {
                  borderLeftWidth: "2px",
                  borderLeftColor: "var(--primaryColor"
                }
              : null
          }
        >
          <Col md={4} xs={6}>
            <i className="fas fa-heading" />{" "}
            <span className="MessageTitle">{title}</span>
          </Col>

          <Col md={4} xs={6}>
            <i className="far fa-user" /> {author_username}
          </Col>
          <Col md={4} xs={6}>
            <i className="far fa-clock" />{" "}
            <Moment fromNow>{message_last_modified}</Moment>
          </Col>
          <Col xs={12} className="MessageBody">
            <i className="far fa-comment" /> {message_body}
          </Col>
        </Row>
      );
    });

  createMessage = (recipients, title, body) => {
    const { User } = this.state;
    const { token } = User;
    const author = User.id;
    const uri = null;
    const recipientList = recipients.map(e => e.value);

    this.props.createMessageGroup(
      token,
      author,
      uri,
      recipientList,
      title,
      body
    );
  };

  render() {
    const {
      User,
      show,
      search,
      recipients,
      selectOptions,
      title,
      body
    } = this.state;
    let { Messages } = this.state;
    let messages = Messages.results ? Messages.results : [];
    messages = search
      ? matchSorter(messages, search, {
          keys: ["author_username", "title", "messages.0.message_body"]
        })
      : messages;
    return !User.token ? (
      <Redirect to="/login" />
    ) : (
      <Grid className="Messages Container">
        <Row>
          <PageHeader className="pageHeader">MESSAGES</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col xs={2} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button
              //disabled={!(User.is_superuser || User.can_create_article)}
              onClick={() => {
                this.setState({ show: true });
              }}
            >
              <i className="fas fa-comment" /> Message
            </Button>
          </Col>
          <Col xs={10}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="fas fa-search" />
              </InputGroup.Addon>
              <FormControl
                style={{ fontSize: "medium" }}
                type="text"
                name="search"
                placeholder="Filter by Title or Author..."
                value={search}
                onChange={filter => this.onChange(filter, Messages)}
              />
            </InputGroup>
          </Col>
        </Row>
        {this.renderMessagers(messages)}
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
                Create Message
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="Container fadeIn-2">
                <Row>
                  <Col xs={12}>
                    <InputGroup>
                      <InputGroup.Addon>
                        <i className="fas fa-user-plus" />
                      </InputGroup.Addon>
                      <Select
                        //https://react-select.com/props
                        value={recipients}
                        isMulti
                        styles={selectStyles}
                        onBlur={e => e.preventDefault()}
                        blurInputOnSelect={false}
                        //isClearable={this.state.recipients.some(v => !v.isFixed)}
                        isSearchable={true}
                        name="colors"
                        placeholder="Username..."
                        className="FilterMultiSelect"
                        classNamePrefix="select"
                        onChange={this.onSelectFilterChange}
                        options={selectOptions}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup>
                        <InputGroup.Addon>
                          <i className="fas fa-heading" />
                        </InputGroup.Addon>
                        <FormControl
                          value={title}
                          type="text"
                          placeholder="Title..."
                          name="title"
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <InputGroup>
                        <InputGroup.Addon>
                          <i className="fas fa-comment" />
                        </InputGroup.Addon>
                        <FormControl
                          value={body}
                          componentClass="textarea"
                          placeholder="Body..."
                          name="body"
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={recipients.length < 1}
                onClick={() => this.createMessage(recipients, title, body)}
              >
                Create
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Messages)
);
