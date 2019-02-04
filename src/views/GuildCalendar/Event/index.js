import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { selectStyles } from "../../../helpers/styles";
import Select from "react-select";
import { eventTags } from "../../../helpers/select";
import { withRouter, Redirect } from "react-router-dom";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {
    selectOptions: eventTags
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User } = props;
    this.setState({ User });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSelectTagChange = (selectValue, { action, removedValue }) => {
    const { selectOptions } = this.props;
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = selectOptions.filter(v => v.isFixed);
        break;
    }

    this.setState({ tags: selectValue });
  };

  render() {
    const { selectOptions, history } = this.props;
    const { User, title, description, tags } = this.state;
    return !(User.is_superuser || User.can_create_calendar_event) ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Grid className="Event Container">
        <Row>
          <PageHeader className="pageHeader">EVENT</PageHeader>
        </Row>
        <Form className="Container fadeIn">
          <Row>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl
                  value={title}
                  type="text"
                  name="title"
                  placeholder="Title"
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  value={description}
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={this.onChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-tags" />
                </InputGroup.Addon>
                <Select
                  //https://react-select.com/props
                  value={tags}
                  isMulti
                  styles={selectStyles}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={false}
                  name="colors"
                  placeholder="Tags..."
                  classNamePrefix="select"
                  onChange={this.onSelectTagChange}
                  options={selectOptions}
                />
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Event)
);
