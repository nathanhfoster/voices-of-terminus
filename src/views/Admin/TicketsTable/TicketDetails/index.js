import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Well, Image } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { getTicket } from "../../../../actions/Tickets";
import { Link, Redirect } from "react-router-dom";
import Moment from "react-moment";
import { circleColor, isEmpty } from "../../../../helpers";
import "./styles.css";

const mapStateToProps = ({ Admin, User }) => ({ Admin, User });

const mapDispatchToProps = { getTicket };

class TicketDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const { User, getTicket, match } = this.props;
    const { id } = match.params;
    const { token } = User;
    getTicket(token, id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User } = props;
    const { Ticket } = Admin;
    this.setState({ User, Ticket });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { history } = this.props;
    const { User, Ticket } = this.state;
    const canViewTickets =
      User.is_leader ||
      User.is_advisor ||
      User.is_council ||
      User.is_general_officer ||
      User.is_officer;
    const {
      id,
      author,
      author_username,
      offender,
      offender_username,
      description,
      image,
      priority,
      status,
      ticket_type,
      date_created,
      last_modified
    } = Ticket;
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
          <Row>
            <Col xs={12}>
              <h3>
                <i className="fas fa-exclamation-circle" />
                {` Priority: ${priority}`}
              </h3>
            </Col>
            <Col xs={12}>
              <h3>{`Type: ${ticket_type}`}</h3>
            </Col>
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
              <h3>
                Created: <Moment fromNow>{date_created}</Moment>
              </h3>
            </Col>
            {dateChanged && (
              <Col xs={12}>
                <h3>
                  Updated: <Moment fromNow>{last_modified}</Moment>
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
            {offender && (
              <Col xs={12}>
                <h3>
                  Offended by:{" "}
                  <Link to={`/admin/edit/user/${offender}`}>
                    {offender_username}
                  </Link>
                </h3>
              </Col>
            )}
            <Col xs={12}>
              <h3>Description</h3>
              <Well className="TicketDescription" bsSize="large">
                {description}
              </Well>
            </Col>
            <Col xs={12}>
              <h3>Image proof</h3>
              <Image
                title="Image proof"
                className="ImageProof"
                src={image}
                rounded
              />
            </Col>
          </Row>
        </Grid>
      )
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TicketDetails);
