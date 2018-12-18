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
  createMessageGroup,
  getMessageDetails,
  getGroupMessageRecipients,
  postMessage
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
  getUsers,
  getMessageDetails,
  getGroupMessageRecipients,
  postMessage
};

class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      search: "",
      recipients: [],
      selectOptions: [],
      modalTitle: "Create Message",
      creatingMessage: false,
      title: "",
      body: ""
    };
  }

  static propTypes = {};

  static defaultProps = {
    modalTitle: "Create Message"
  };

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
    const { messageDetails } = Messages;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];
    this.setState({ User, Messages, selectOptions, messageDetails });
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

  renderGroupMessages = messages => {
    return messages.map(group => {
      const {
        author,
        author_username,
        date_created,
        id,
        is_active,
        last_modified,
        title,
        uri,
        messages
      } = group;
      const is_read = this.hasUnreadMessage(messages);
      const recentMessage = messages[messages.length - 1];
      const {
        //id: 4
        //is_read: false
        body,
        message_id,
        message_last_modified,
        recipient_group_id
      } = recentMessage;
      return (
        <Row
          onClick={e => {
            e.preventDefault();
            this.readMessage(messages);
            this.getMessageDetails(recipient_group_id);
            this.getGroupMessageRecipients(recipient_group_id);
            this.setState({
              show: true,
              modalTitle: title,
              recipient_group_id,
              recipients: []
            });
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
          <Col xs={8}>
            <i className="fas fa-heading" />{" "}
            <span className="MessageTitle">{title}</span>
          </Col>
          <Col xs={4}>
            <Moment className="pull-right" fromNow>
              {message_last_modified}
            </Moment>
            <i
              class="fas fa-keyboard pull-right"
              style={{ margin: "2px 4px 0 0" }}
            />
          </Col>
          <Col xs={6}>
            <i className="far fa-user" /> {author_username}
          </Col>
          <Col xs={12} className="MessageBody">
            <i className="far fa-comment" /> {body}
          </Col>
        </Row>
      );
    });
  };

  renderMessageDetails = messagesDetails =>
    messagesDetails.map(message => {
      const {
        id,
        author,
        author_username,
        body,
        date_created,
        last_modified,
        group_message_id
      } = message;
      return (
        <Row className="Message borderedRow">
          <Col xs={8}>
            <i className="far fa-user" /> {author_username}
          </Col>
          <Col xs={4}>
            <Moment className="pull-right" fromNow>
              {last_modified}
            </Moment>
            <i
              class="fas fa-keyboard pull-right"
              style={{ margin: "2px 4px 0 0" }}
            />
          </Col>
          <Col xs={12} className="MessageBody">
            <i className="far fa-comment" /> {body}
          </Col>
        </Row>
      );
    });

  createMessage = (recipients, title, body) => {
    const { User } = this.props;
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

  replyToGroup = body => {
    const { recipient_group_id } = this.state;
    const { User, Messages } = this.props;
    const { messageRecipients } = Messages;
    const { token, id } = User;
    const payload = { author: id, body, group_message_id: recipient_group_id };
    this.props.postMessage(
      token,
      recipient_group_id,
      messageRecipients,
      payload
    );
  };

  getMessageDetails = recipient_group_id => {
    const { token } = this.props.User;
    this.props.getMessageDetails(token, recipient_group_id);
  };

  getGroupMessageRecipients = recipient_group_id => {
    const { token } = this.props.User;
    this.props.getGroupMessageRecipients(token, recipient_group_id);
  };

  render() {
    const {
      User,
      show,
      search,
      recipients,
      selectOptions,
      title,
      body,
      modalTitle,
      creatingMessage,
      messageDetails,
      Messages
    } = this.state;
    let messages = Messages.results;
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
          <Col
            md={2}
            xs={3}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button
              //disabled={!(User.is_superuser || User.can_create_article)}
              onClick={() => {
                this.setState({ show: true, creatingMessage: true });
              }}
            >
              <i className="fas fa-comment" /> Message
            </Button>
          </Col>
          <Col md={10} xs={9}>
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
        {this.renderGroupMessages(messages)}
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={show}
            onHide={() =>
              this.setState({
                show: false,
                modalTitle: this.props.modalTitle,
                creatingMessage: false
              })
            }
            dialogClassName="loginModal"
            bsSize="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                <i className="fas fa-comments" /> {modalTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {creatingMessage ? (
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
                            onChange={this.onChange}
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
              ) : (
                this.renderMessageDetails(
                  messageDetails.results ? messageDetails.results : []
                )
              )}
            </Modal.Body>
            <Modal.Footer>
              {creatingMessage ? (
                <Button
                  disabled={recipients.length < 1}
                  onClick={() => this.createMessage(recipients, title, body)}
                >
                  <i className="fas fa-plus" /> Create
                </Button>
              ) : (
                <Row>
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
                  <Col xs={12}>
                    <Button onClick={() => this.replyToGroup(body)}>
                      <i className="fas fa-reply-all" /> Reply
                    </Button>
                  </Col>
                </Row>
              )}
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
