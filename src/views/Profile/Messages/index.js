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
  ButtonGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import {
  getUserMessages,
  updateMessage,
  createMessageGroup,
  getMessageDetails,
  getGroupMessageRecipients,
  postMessage,
  deleteMessageRecipient
} from "../../../actions/Messages";
import { postSettings, setSettings } from "../../../actions/Settings";
import { getUsers } from "../../../actions/Admin";
import { Redirect } from "react-router-dom";
import Moment from "react-moment";
import "./styles.css";
import matchSorter from "match-sorter";
import Select from "react-select";
import { selectGuildRecipients, RemoveArrayDuplicates } from "../../../helpers";
import { selectStyles } from "../../../helpers/styles";
import ConfirmAction from "../../../components/ConfirmAction";
import { userRefreshDelay } from "../../../helpers/variables";

const mapStateToProps = ({ Admin, User, Messages }) => ({
  Admin,
  User,
  Messages
});

const mapDispatchToProps = {
  getUserMessages,
  updateMessage,
  createMessageGroup,
  getUsers,
  getMessageDetails,
  getGroupMessageRecipients,
  postMessage,
  deleteMessageRecipient,
  postSettings,
  setSettings
};

class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      search: "",
      Recipients: [],
      selectOptions: [],
      modalTitle: "Create Message",
      title: "",
      body: "",
      recipient_group_id: null
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
    const { User, getUserMessages, getUsers } = this.props;
    const { id, token, Settings } = User;
    const { push_messages } = Settings;
    const { Users } = this.props.Admin;
    const Recipients = Users
      ? Users.filter(i => i.id == User.id).map(
          e => (e = { value: e.id, label: e.username, isFixed: true })
        )
      : [];
    this.setState({ Recipients });

    if (!push_messages) getUserMessages(id, token);
    getUsers();
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval);
    this.getState(nextProps);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { Messages } = nextProps;
  //   const { messageDetails } = Messages;
  //   const messageCount = Messages.count;
  //   const currentMessageCount = this.state.Messages.count;

  //   const messageDetailCount = messageDetails.count;
  //   const currentMessageDetailCount = this.state.messageDetails.count;

  //   const { show, search, title, body } = nextState;
  //   const currentShow = this.state.show;
  //   const currentSearch = this.state.search;
  //   const currentTitle = this.state.title;
  //   const currentBody = this.state.body;

  //   const messagesChanged = currentMessageCount != messageCount;
  //   const showChanged = show != currentShow;
  //   const messageDetailChanged =
  //     messageDetailCount != currentMessageDetailCount;
  //   const searchChanged = search != currentSearch;
  //   const titleChanged = title != currentTitle;
  //   const bodyChanged = body != currentBody;

  //   console.log(messageDetailCount, currentMessageDetailCount);

  //   return (
  //     messagesChanged ||
  //     messageDetailChanged ||
  //     showChanged ||
  //     searchChanged ||
  //     titleChanged ||
  //     bodyChanged
  //   );
  // }

  getState = props => {
    const { Admin, User, Messages, history } = props;
    const { messageDetails } = Messages;
    const selectOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];

    this.interval = setInterval(
      () => this.fetchMessages(User.token, User.Settings),
      userRefreshDelay
    );

    this.setState({
      Admin,
      User,
      Messages,
      selectOptions,
      messageDetails,
      history
    });
  };

  fetchMessages = (token, Settings) => {
    const { recipient_group_id } = this.state;
    const { push_messages } = Settings;
    const { getMessageDetails, getGroupMessageRecipients } = this.props;
    const shouldFetch = recipient_group_id && push_messages;
    if (shouldFetch) {
      getMessageDetails(token, recipient_group_id);
      getGroupMessageRecipients(token, recipient_group_id);
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  readMessage = messages => {
    const { User, updateMessage } = this.props;
    const payload = { is_read: true };
    for (let i = 0; i < messages.length; i++) {
      const { id } = messages[i];
      updateMessage(id, User.token, payload);
    }
  };

  hasUnreadMessage = messages => {
    for (let i = 0; i < messages.length; i++) {
      if (!messages[i].is_read) return false;
    }
    return true;
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSelectFilterChange = (Recipients, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        Recipients = this.state.Recipients.filter(v => v.isFixed);
        break;
    }

    this.setState({ Recipients });
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
      const recentMessage = messages.length > 0 ? messages[0] : {};
      const {
        //id,
        //is_read,
        message_body,
        message_id,
        message_last_modified,
        recipient_group_id
      } = recentMessage;
      return (
        <Row
          key={recipient_group_id}
          onClick={e => {
            e.preventDefault();
            this.readMessage(messages);
            this.getMessageDetails(recipient_group_id);
            this.getGroupMessageRecipients(recipient_group_id);
            this.setState({
              show: true,
              modalTitle: title,
              uri,
              recipient_group_id,
              Recipients: []
            });
          }}
          className="Message borderedRow"
          style={
            !is_read
              ? {
                  borderLeftWidth: "6px",
                  borderLeftColor: "var(--primaryColor)"
                }
              : null
          }
        >
          <Col md={9}>
            <i className="fas fa-heading" />{" "}
            <span className="MessageTitle">{title}</span>
          </Col>
          <Col md={3}>
            <Moment fromNow className="pull-right">
              {message_last_modified}
            </Moment>
            <i
              class="fas fa-keyboard pull-right"
              style={{ margin: "2px 4px 0 0" }}
            />{" "}
          </Col>
          <Col md={6}>
            <i className="far fa-user" /> {author_username}
          </Col>
          <Col xs={12} className="MessageBody">
            <i className="far fa-comment" /> {message_body}
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
        <Row className="Message borderedRow" key={id}>
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

  createMessage = (Recipients, title, body) => {
    const { createMessageGroup } = this.props;
    const { User } = this.props;
    const { token } = User;
    const author = User.id;
    const uri = null;
    const recipientList = Recipients.map(e => e.value);
    createMessageGroup(token, author, uri, recipientList, title, body);
    this.setState({ show: false, body: "" });
  };

  replyToGroup = (e, body) => {
    e.preventDefault();
    const { User, Messages, postMessage } = this.props;
    const { recipient_group_id } = this.state;
    const { messageRecipients } = Messages;
    const recipients = RemoveArrayDuplicates(
      messageRecipients.map(r => r.recipient_id)
    );

    const payload = {
      author: User.id,
      body,
      group_message_id: recipient_group_id
    };

    postMessage(User.token, recipient_group_id, recipients, payload);
    this.setState({ body: "" });
  };

  getMessageDetails = recipient_group_id => {
    const { User, getMessageDetails } = this.props;
    getMessageDetails(User.token, recipient_group_id);
  };

  getGroupMessageRecipients = recipient_group_id => {
    const { User, getGroupMessageRecipients } = this.props;
    getGroupMessageRecipients(User.token, recipient_group_id);
  };

  render() {
    const { deleteMessageRecipient, postSettings, setSettings } = this.props;
    const {
      Admin,
      User,
      show,
      search,
      Recipients,
      selectOptions,
      title,
      body,
      modalTitle,
      messageDetails,
      Messages,
      history,
      uri,
      recipient_group_id
    } = this.state;
    const { Settings } = User;
    const { push_messages } = Settings;
    let messages = Messages.results;
    const { messageRecipients } = Messages;
    const creatingMessage = !recipient_group_id;
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
            md={3}
            xs={4}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button onClick={() => this.setState({ show: true })}>
              <i className="fas fa-comment" /> Message
            </Button>
            <Button
              onClick={() =>
                !Settings.id
                  ? postSettings(User.token, {
                      user: User.id,
                      push_messages: !push_messages
                    })
                  : setSettings(User.token, Settings.id, {
                      push_messages: !push_messages
                    })
              }
            >
              <i className={`fas fa-toggle-${push_messages ? "on" : "off"}`} />{" "}
              Push messages
            </Button>
          </Col>
          <Col md={9} xs={8}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="fas fa-search" />
              </InputGroup.Addon>
              <FormControl
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
        {show ? (
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={show}
              onHide={() =>
                this.setState({
                  show: false,
                  modalTitle: this.props.modalTitle,
                  recipient_group_id: null
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
              <Modal.Body className="messageBody">
                {creatingMessage ? (
                  <Form className="Container fadeIn">
                    <Row>
                      <Col xs={12} className="ActionToolbarRow Center">
                        <Button
                          onClick={() =>
                            this.setState({
                              Recipients: selectGuildRecipients(
                                Recipients,
                                User,
                                Admin.Users
                              )
                            })
                          }
                        >
                          <i className="fas fa-user-plus" /> Guild
                        </Button>
                      </Col>
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Addon>
                            <i className="fas fa-user-plus" />
                          </InputGroup.Addon>
                          <Select
                            //https://react-select.com/props
                            value={Recipients}
                            isMulti
                            styles={selectStyles()}
                            onBlur={e => e.preventDefault()}
                            blurInputOnSelect={false}
                            //isClearable={this.state.Recipients.some(v => !v.isFixed)}
                            isSearchable={true}
                            placeholder="Username..."
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
                              style={{ height: 500 }}
                              componentClass="textarea"
                              placeholder="Type your message..."
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
                    disabled={Recipients.length < 1}
                    onClick={() => this.createMessage(Recipients, title, body)}
                  >
                    <i className="fas fa-plus" /> Create
                  </Button>
                ) : (
                  <Row>
                    {!this.state.uri ? (
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
                    ) : null}
                    <Col xs={12} className="Center">
                      <ButtonGroup>
                        {this.state.uri ? (
                          <Button onClick={() => history.push(uri)}>
                            <i className="fas fa-link" /> {modalTitle}
                          </Button>
                        ) : (
                          <Button
                            disabled={!body}
                            onClick={e => this.replyToGroup(e, body)}
                          >
                            <i className="fas fa-reply-all" /> Reply
                          </Button>
                        )}
                        <ConfirmAction
                          Action={() => {
                            const { id } = messageRecipients.filter(
                              r => r.recipient_id == User.id
                            )[0];
                            deleteMessageRecipient(User.token, User.id, id);
                            this.setState({ show: false });
                          }}
                          Disabled={false}
                          Icon={<i className="fas fa-trash" />}
                          hasPermission={true}
                          Title={this.state.modalTitle}
                        />
                      </ButtonGroup>
                    </Col>
                  </Row>
                )}
              </Modal.Footer>
            </Modal>
          </Row>
        ) : null}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Messages);
