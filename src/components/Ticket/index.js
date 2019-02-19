import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button,
  Image,
  ControlLabel,
  FormControl,
  FormGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import FormData from "form-data";
import { getUsers, clearAdminApi } from "../../actions/Admin";
import { postTicket } from "../../actions/Tickets";
import { withAlert } from "react-alert";
import Select from "react-select";
import { selectStyles } from "../../helpers/styles";
import { isEquivalent } from "../../helpers";
import "./styles.css";

const mapStateToProps = ({ Admin, User }) => ({ Admin, User });

const mapDispatchToProps = { postTicket, getUsers, clearAdminApi };

class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticket_type: { value: "Report", label: "Report" },
      priority: { value: 1, label: 1 }
    };
  }

  static propTypes = {};

  static defaultProps = {
    tagOptions: [{ value: "Report", label: "Report" }],
    priorityOptions: [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 3, label: 3 }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    // const { User } = nextProps;
    // const { last_login } = User;
    // const currentUser = this.state.User;
    // const currentLogin = currentUser.last_login;

    // if (isEquivalent(currentUser, User) && last_login != currentLogin)
    //   shouldUpdate = false;

    return shouldUpdate;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const { getUsers, clearAdminApi } = this.props;
    getUsers();
    clearAdminApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, tagOptions, priorityOptions } = props;
    const { token, id } = User;
    const offenderOptions = Admin.Users
      ? Admin.Users.map(i => (i = { value: i.id, label: i.username })).sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      : [];
    const { posting, posted, updating, updated, error } = Admin;
    this.setState({
      token: token,
      author: id,
      tagOptions,
      offenderOptions,
      priorityOptions,
      posting,
      posted,
      updating,
      updated,
      error
    });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearAdminApi } = this.props;
    clearAdminApi();
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
      reader.onloadend = () => this.setState({ image: reader.result });
    }
  };

  selectOnChange = (e, a, name) => {
    switch (a.action) {
      case "clear":
        break;
      case "pop-value":
        if (e.value.isFixed) {
          return;
        }
      case "select-option":
        this.setState({ [name]: e });
        break;
    }
  };

  postTicket = () => {
    const { postTicket } = this.props;
    const {
      token,
      author,
      offender,
      description,
      ticket_type,
      image,
      priority
    } = this.state;

    let payload = new FormData();
    payload.append("author", author);
    payload.append("offender", offender ? offender.value : "");
    payload.append("description", description);
    payload.append("ticket_type", ticket_type.value);
    payload.append("image", image);
    payload.append("priority", priority.value);

    postTicket(token, payload);
  };

  render() {
    const {
      offender,
      description,
      ticket_type,
      image,
      priority,
      tagOptions,
      offenderOptions,
      priorityOptions,
      posting,
      posted,
      updating,
      updated,
      error
    } = this.state;
    return (
      <Grid className="Ticket Container">
        <Row>
          <PageHeader className="pageHeader">TICKET</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button onClick={e => this.postTicket()}>
              {posting && !posted
                ? [<i className="fa fa-spinner fa-spin" />, " POST"]
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
        <Row className="borderedRow">
          <Col xs={4}>
            <ControlLabel>Type</ControlLabel>
            <FormGroup>
              <Select
                name="ticket_type"
                value={ticket_type}
                onChange={(e, a) => this.selectOnChange(e, a, "ticket_type")}
                options={tagOptions}
                isClearable={false}
                isSearchable={false}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col xs={4}>
            <ControlLabel>Offender</ControlLabel>
            <FormGroup>
              <Select
                name="offender"
                placeholder="Search for offender..."
                value={offender}
                onChange={(e, a) => this.selectOnChange(e, a, "offender")}
                options={offenderOptions}
                isClearable={false}
                isSearchable={true}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col xs={4}>
            <ControlLabel>Priority</ControlLabel>
            <FormGroup>
              <Select
                name="priority"
                value={priority}
                onChange={(e, a) => this.selectOnChange(e, a, "priority")}
                options={priorityOptions}
                isClearable={false}
                isSearchable={false}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles}
              />
            </FormGroup>
          </Col>
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                value={description}
                componentClass="textarea"
                type="textarea"
                name="description"
                wrap="hard"
                placeholder="Description"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="Center borderedRow">
          <Col xs={12}>
            <Image src={image} className="ProfileImages" responsive rounded />
            <ControlLabel>Image proof</ControlLabel>
            <FormControl
              style={{ margin: "auto" }}
              type="file"
              label="File"
              name="image"
              onChange={this.setImage}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Ticket)
);
