import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Well,
  Image,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import {
  getTicket,
  editTicket,
  getTicketNotes,
  postTicketNote,
  getTicketStatusChanges,
  postTicketStatusChange
} from "../../../../actions/Tickets";
import { clearAdminApi } from "../../../../actions/Admin";
import { Link, Redirect } from "react-router-dom";
import Moment from "react-moment";
import { circleColor } from "../../../../helpers";
import { UserHasPermissions } from "../../../../helpers/userPermissions";
import { ticketStatusOptions } from "../../../../helpers/options";
import Select from "react-select";
import { selectStyles } from "../../../../helpers/styles";
import "./styles.css";

const mapStateToProps = ({ Admin, User }) => ({ Admin, User });

const mapDispatchToProps = {
  getTicket,
  editTicket,
  getTicketNotes,
  postTicketNote,
  getTicketStatusChanges,
  postTicketStatusChange,
  clearAdminApi
};

class TicketDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {
    ticketTypeOptions: ticketStatusOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const {
      User,
      getTicket,
      getTicketNotes,
      getTicketStatusChanges,
      clearAdminApi,
      match
    } = this.props;
    const { id } = match.params;
    const { token } = User;
    clearAdminApi();
    getTicket(User.id, token, id);
    getTicketNotes(token, id);
    getTicketStatusChanges(token, id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, ticketTypeOptions } = props;
    const { Ticket, posting, posted, updating, updated, error } = Admin;
    const { StatusChanges, Notes } = Ticket;
    const { notes } = this.state.notes ? this.state : Ticket;
    const { status } = this.state.status ? this.state : Ticket;
    this.setState({
      User,
      Ticket,
      StatusChanges,
      Notes,
      ticketTypeOptions,
      posting,
      posted,
      updating,
      updated,
      error,
      notes,
      status
    });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearAdminApi } = this.props;
    clearAdminApi();
  }

  renderOthersInvolved = othersInvolved =>
    othersInvolved.map(o => {
      const name = o;
      return <span className="OthersInvolved">{name}</span>;
    });

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  selectOnChange = (e, a, name) => {
    switch (a.action) {
      case "clear":
        this.setState({ [name]: null });
        break;
      case "pop-value":
        if (e.value.isFixed) {
          return;
        }
      case "select-option":
        this.setState({ [name]: e.value });
        break;
    }
  };

  editTicketStatus = () => {
    const { Ticket } = this.props.Admin;
    const {
      User,
      editTicket,
      postTicketStatusChange,
      postTicketNote,
      match
    } = this.props;
    const { id } = match.params;
    const originalStatus = Ticket.status;
    const originalNotes = Ticket.notes;
    let { status, notes } = this.state;
    const statusChanged = status !== originalStatus;
    const notesChanged = notes !== originalNotes;
    if (typeof status === "object") status = status.value;

    const ticketPayload = { status, notes };
    const statusChangePayload = { ticket_id: id, author: User.id, status };
    const notesPayload = {
      ticket_id: id,
      author: User.id,
      text: notes
    };
    if (statusChanged || notesChanged)
      editTicket(User.token, id, ticketPayload);
    if (statusChanged) postTicketStatusChange(User.token, statusChangePayload);
    if (notesChanged) postTicketNote(User.token, notesPayload);
  };

  renderStatusChangesOrNotes = array =>
    array.length > 0 ? (
      array.map(s => {
        const {
          id,
          ticket_id,
          author,
          author_username,
          date_created,
          status,
          text
        } = s;
        return (
          <Col xs={12} className="StatusChangeNoteCard">
            <Col xs={6}>
              <span>
                <i className="far fa-clock" />{" "}
                <Moment format="MM/DD/YYYY hh:mm a">{date_created}</Moment>
              </span>
            </Col>
            <Col xs={6}>
              <div className="pull-right">
                <i className="fas fa-user" /> <span>{author_username}</span>
              </div>
            </Col>
            <Col xs={12}>
              {status ? (
                <span>
                  <i
                    className="fas fa-circle"
                    style={{ color: circleColor(status) }}
                  />
                  {` Status: ${status}`}
                </span>
              ) : (
                <div className="noteTextContainer">
                  <p className="noteText">{text}</p>
                </div>
              )}
            </Col>
          </Col>
        );
      })
    ) : (
      <div className="StatusChangeNoteCard">
        <span>None</span>
      </div>
    );

  render() {
    const { history } = this.props;
    const {
      User,
      Ticket,
      StatusChanges,
      Notes,
      ticketTypeOptions,
      posting,
      posted,
      updating,
      updated,
      error
    } = this.state;
    const canViewTickets = UserHasPermissions(
      User,
      "view_ticket",
      Ticket.author
    );
    const {
      id,
      author,
      author_username,
      offenders,
      offender_username,
      corroborators,
      corroborator_username,
      others_involved,
      description,
      ticket_type,
      image,
      priority,
      // status,
      // notes,
      date_created,
      last_modified,
      date_resolved,
      judge,
      escalated,
      viewed,
      person_who_viewed
    } = Ticket;
    const { status, notes } = this.state;
    const othersInvolved = others_involved ? others_involved.split("|") : [];
    const dateChanged = new Date(last_modified) - new Date(date_created) > 0;
    return !canViewTickets ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      Ticket && (
        <Grid className="TicketDetails Container">
          <Row>
            <PageHeader className="pageHeader">TICKET</PageHeader>
          </Row>
          <Row className="ActionToolbarRow">
            <Col
              xs={12}
              className="ActionToolbar cardActions"
              componentClass={ButtonToolbar}
            >
              <Button onClick={() => this.editTicketStatus()}>
                {posting && !posted
                  ? [<i className="fa fa-spinner fa-spin" />, " SUBMIT"]
                  : !posting && posted && !error
                  ? [
                      <i
                        className="fas fa-check"
                        style={{ color: "var(--color_emerald)" }}
                      />,
                      " SUBMIT"
                    ]
                  : error
                  ? [
                      <i
                        className="fas fa-times"
                        style={{ color: "var(--color_alizarin)" }}
                      />,
                      " SUBMIT"
                    ]
                  : "SUBMIT"}
              </Button>
            </Col>
          </Row>
          <Row className="detailRow borderedRow">
            <Col xs={12}>
              <h3>
                <i
                  className="fas fa-circle"
                  style={{ color: circleColor(status) }}
                />
                {` Status: ${status}`}
              </h3>
            </Col>
            <Col xs={12}>
              <h3>{` Priority: ${priority}`}</h3>
            </Col>
            <Col xs={12}>
              <h3>{`Type: ${ticket_type}`}</h3>
            </Col>
            <Col xs={12}>
              <h3>
                Created:{" "}
                <Moment format="MM/DD/YYYY hh:mm a">{date_created}</Moment>
              </h3>
            </Col>
            {dateChanged && (
              <Col xs={12}>
                <h3>
                  Updated:{" "}
                  <Moment format="MM/DD/YYYY hh:mm a">{last_modified}</Moment>
                </h3>
              </Col>
            )}
            {author_username && (
              <Col xs={12}>
                <h3>
                  Reported by:{" "}
                  <Link to={`/admin/edit/user/${author}`}>
                    {author_username}
                  </Link>
                </h3>
              </Col>
            )}
            {offenders && (
              <Col xs={12}>
                <h3>
                  Offended by:{" "}
                  <Link to={`/admin/edit/user/${offenders}`}>
                    {offender_username}
                  </Link>
                </h3>
              </Col>
            )}
            {othersInvolved.length > 0 && (
              <Col xs={12}>
                <h3>
                  Others involved:{this.renderOthersInvolved(othersInvolved)}
                </h3>
              </Col>
            )}
            <Col xs={12}>
              <h3>Description</h3>
              <Well className="TicketDescription" bsSize="large">
                {description}
              </Well>
            </Col>
            {image && (
              <Col xs={12}>
                <h3>Image proof</h3>
                <Image
                  title="Image proof"
                  className="ImageProof"
                  src={image}
                  rounded
                />
              </Col>
            )}
            {UserHasPermissions(User, "change_ticket") &&
              User.id !== Ticket.author && [
                <Col xs={12}>
                  <ControlLabel>Update status</ControlLabel>
                  <Select
                    name="ticket_type"
                    value={
                      status && status.value
                        ? status
                        : { value: status, label: status }
                    }
                    onChange={(e, a) => this.selectOnChange(e, a, "status")}
                    options={ticketTypeOptions}
                    isClearable={false}
                    isSearchable={false}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    styles={selectStyles()}
                  />
                </Col>,
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      <i className="fas fa-sticky-note" /> Notes
                    </ControlLabel>
                    <FormControl
                      value={notes}
                      componentClass="textarea"
                      type="textarea"
                      name="notes"
                      wrap="hard"
                      placeholder="Notes..."
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </Col>
              ]}
          </Row>
          <Row style={{ marginTop: 16 }}>
            <h2 className="headerBanner">HISTORY</h2>
          </Row>
          <Row>
            <Col xs={12} className="borderedRow">
              <h2 className="headerBanner">Status Changes</h2>
              <div className="StatusChangeContainer">
                {this.renderStatusChangesOrNotes(StatusChanges)}
              </div>
            </Col>
            <Col xs={12} className="borderedRow">
              <h2 className="headerBanner">Notes</h2>
              <div className="StatusChangeContainer">
                {this.renderStatusChangesOrNotes(Notes)}
              </div>
            </Col>
          </Row>
        </Grid>
      )
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TicketDetails);
