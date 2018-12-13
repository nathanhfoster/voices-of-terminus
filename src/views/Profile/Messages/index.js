import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { getMessages, updateMessage } from "../../../actions/Messages";
import { withRouter, Redirect } from "react-router-dom";
import Moment from "react-moment";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User, Messages }) => ({
  User,
  Messages
});

const mapDispatchToProps = {
  getMessages,
  updateMessage
};

class Messages extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    // const { id, token } = this.props.User;
    // this.props.getMessages(id, token);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Messages } = props;
    this.setState({ User, Messages });
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  readMessage = id => {
    const { User } = this.props;
    const payload = { is_read: true };
    this.props.updateMessage(id, User.token, payload);
  };

  renderMessagers = messages =>
    messages.map(message => {
      const {
        id,
        is_read,
        recipient_group_id,
        group_author,
        group_last_modified,
        group_title,
        group_uri,
        message_id,
        message_body
      } = message;
      return (
        <Row
          onClick={e => {
            e.preventDefault();
            this.readMessage(id);
            this.setState({ show: true });
          }}
          className="Message"
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
            <span className="MessageTitle">{group_title}</span>
          </Col>

          <Col md={4} xs={6}>
            <i className="far fa-user" /> {group_author}
          </Col>
          <Col md={4} xs={6}>
            <i className="far fa-clock" />{" "}
            <Moment fromNow>{group_last_modified}</Moment>
          </Col>
          <Col xs={12} className="MessageBody">
            <i className="far fa-comment" /> {message_body}
          </Col>
        </Row>
      );
    });

  render() {
    const { User, Messages, show } = this.state;
    return !User.token ? (
      <Redirect to="/login" />
    ) : (
      <Grid className="Messages Container">
        <Row>
          <PageHeader className="pageHeader">MESSAGES</PageHeader>
        </Row>
        {Messages.results ? this.renderMessagers(Messages.results) : null}
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={show}
            onHide={this.setState({ show: false })}
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
                  <Col />
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.createUserAccount}>Create</Button>
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
