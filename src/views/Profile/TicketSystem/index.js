import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { getUserTickets } from "../../../actions/Tickets";
import Moment from "react-moment";
import TicketTable from "../../Admin/TicketsTable";
import "./styles.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { getUserTickets };

class TicketSystem extends Component {
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
    const { User, getUserTickets } = this.props;
    getUserTickets(User.token, User.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User } = props;
    this.setState({ User });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { history } = this.props;
    const { pathname } = history.location;
    const { User } = this.state;
    const { Tickets } = User;

    return (
      <Grid className="TicketSystem Container">
        <Row>
          <PageHeader className="pageHeader">TICKETS</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button onClick={e => history.push("/ticket/new")}>+ Ticket</Button>
          </Col>
        </Row>
        <Row>{TicketTable(Tickets, history, pathname)}</Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TicketSystem);
