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
  InputGroup,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { selectStyles } from "../../../helpers/styles";
import Select from "react-select";
import { eventTags } from "../../../helpers/select";
import { roleOptions, classOptions, removeDuplicates } from "../../../helpers";
import { Redirect } from "react-router-dom";
import Slider, { Range } from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postEvent, clearEventssApi } from "../../../actions/Events";

const mapStateToProps = ({ User, Events }) => ({ User, Events });

const mapDispatchToProps = { postEvent, clearEventssApi };

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start_date: new Date(),
      end_date: new Date(),
      tags: eventTags.filter(e => e.isFixed),
      min_level: 1,
      max_level: 60,
      role_preferences: [
        { value: "Healer", label: "Healer" },
        { value: "Melee Dps", label: "Melee Dps" },
        { value: "Ranged Dps", label: "Ranged Dps" },
        { value: "Tank", label: "Tank" }
      ],
      class_preferences: [],
      congregation_size: 6
    };
  }

  static propTypes = {};

  static defaultProps = {
    min_level: 1,
    max_level: 60
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
    const { clearEventssApi } = this.props;
    clearEventssApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events } = props;
    this.setState({ User, Events });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearEventssApi } = this.props;
    clearEventssApi();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSliderChange = props =>
    this.setState({ min_level: props[0], max_level: props[1] });

  onSliderHandle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Slider.Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  onSelectTagChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = eventTags.filter(v => v.isFixed);
        break;
    }

    this.setState({ tags: selectValue });
  };

  onSelectRollPreferenceChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = roleOptions.filter(v => v.isFixed);
        this.setState({ class_preferences: [] });
        break;
    }

    this.setState({ role_preferences: selectValue });
  };

  onSelectClassPreferenceChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = roleOptions.filter(v => v.isFixed);
        break;
    }

    this.setState({ class_preferences: selectValue });
  };

  postEvent = () => {
    const { postEvent } = this.props;
    const {
      start_date,
      end_date,
      title,
      description,
      User,
      tags,
      min_level,
      max_level,
      role_preferences,
      class_preferences,
      location,
      congregation_size
    } = this.state;
    const payload = {
      start_date,
      end_date,
      title,
      description,
      author: User.id,
      last_modified_by: User.id,
      tags: tags.map(i => i.value).join("|"),
      min_level,
      max_level,
      role_preferences: role_preferences.map(i => i.value).join("|"),
      class_preferences: class_preferences.map(i => i.value).join("|"),
      location,
      congregation_size
    };
    postEvent(User.token, payload);
  };

  roleClassOptions = role_preferences =>
    removeDuplicates(
      role_preferences.map(e => classOptions[e.value]).flat(1),
      "value"
    );

  setStartDate = startDate => {
    const { end_date } = this.state;
    const newDate = new Date(startDate).toISOString();
    if (new Date(end_date) - new Date(startDate) <= 0)
      return this.setState({ start_date: newDate, end_date: newDate });
    else return this.setState({ start_date: newDate });
  };

  setEndDate = endDate => {
    const { start_date } = this.state;
    const newDate = new Date(endDate).toISOString();
    if (new Date(start_date) - new Date(endDate) >= 0)
      return this.setState({ start_date: newDate, end_date: newDate });
    else return this.setState({ end_date: newDate });
  };

  render() {
    const { history } = this.props;
    const {
      User,
      Events,
      title,
      description,
      tags,
      min_level,
      max_level,
      role_preferences,
      class_preferences,
      location,
      start_date,
      end_date,
      congregation_size
    } = this.state;
    const {
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error
    } = Events;
    return !(User.is_superuser || User.can_create_calendar_event) ? (
      history.length > 1 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="Event Container">
        <Row>
          <PageHeader className="pageHeader">EVENT</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={this.postEvent}
              className="todayButton"
            >
              {posting && !posted
                ? [<i className="fa fa-spinner fa-spin" />, " POST"]
                : !posting && posted && !error
                ? [
                    <i
                      className="fas fa-check"
                      style={{ color: "var(--color_emerald)" }}
                    />,
                    " POST"
                  ]
                : [<i className="fas fa-cloud-upload-alt" />, " POST"]}
            </Button>
          </Col>
        </Row>
        <Form className="Container fadeIn">
          <Row>
            <Col md={6} xs={12} className="expirationDate">
              <InputGroup>
                <InputGroup.Addon>
                  <i className="far fa-calendar-check" />
                </InputGroup.Addon>
                <DatePicker
                  //calendarClassName="Calendar"
                  popperClassName="calendarPopper"
                  fixedHeight={true}
                  //startDate={expiration_date}
                  //value={expiration_date.toString()}
                  selected={start_date}
                  onChange={date => this.setStartDate(date)}
                  showTimeSelect
                  //timeFormat="hh:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="time"
                  placeholderText="Start date"
                />
              </InputGroup>
            </Col>
            <Col md={6} xs={12} className="expirationDate">
              <InputGroup>
                <InputGroup.Addon>
                  <i className="far fa-calendar-times" />
                </InputGroup.Addon>
                <DatePicker
                  //calendarClassName="Calendar"
                  popperClassName="calendarPopper"
                  fixedHeight={true}
                  //startDate={expiration_date}
                  //value={expiration_date.toString()}
                  selected={end_date}
                  onChange={date => this.setEndDate(date)}
                  showTimeSelect
                  //timeFormat="hh:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="time"
                  placeholderText="End date"
                />
              </InputGroup>
            </Col>
            <Col md={12} style={{ marginTop: 16 }}>
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
                  componentClass="textarea"
                  value={description}
                  type="textarea"
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
                  options={eventTags}
                />
              </InputGroup>
            </Col>
            <Col xs={12} style={{ marginTop: 16 }}>
              <FormGroup>
                <ControlLabel>{`Level range (${min_level} - ${max_level})`}</ControlLabel>
                <Range
                  allowCross={false}
                  min={this.props.min_level}
                  max={this.props.max_level}
                  defaultValue={[this.props.min_level, this.props.max_level]}
                  tipFormatter={value => `${value}%`}
                  onChange={props => this.onSliderChange(props)}
                  handle={props => this.onSliderHandle(props)}
                  trackStyle={[{ backgroundColor: "var(--grey)" }]}
                  handleStyle={[
                    {
                      backgroundColor: "var(--primaryColor)",
                      border: "2px solid var(--primaryColor)"
                    },
                    {
                      backgroundColor: "var(--primaryColor)",
                      border: "2px solid var(--primaryColor)"
                    }
                  ]}
                  railStyle={{ backgroundColor: "var(--slate_grey)" }}
                  // dotStyle={{backgroundColor: 'red'}}
                  // activeDotStyle={{backgroundColor: 'green'}}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel>Role preferences</ControlLabel>
                <Select
                  //https://react-select.com/props
                  value={role_preferences}
                  isMulti
                  styles={selectStyles}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={false}
                  name="colors"
                  placeholder="Role preferences..."
                  classNamePrefix="select"
                  onChange={this.onSelectRollPreferenceChange}
                  options={roleOptions}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel>Class preferences</ControlLabel>
                <Select
                  //https://react-select.com/props
                  value={class_preferences}
                  isMulti
                  styles={selectStyles}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={false}
                  name="colors"
                  placeholder="Class preferences..."
                  classNamePrefix="select"
                  onChange={this.onSelectClassPreferenceChange}
                  options={this.roleClassOptions(role_preferences)}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Location</ControlLabel>
                <span className="help">(Zone, Dungeon)</span>
                <FormControl
                  value={location}
                  type="text"
                  name="location"
                  placeholder="Zone interest..."
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Congregation size</ControlLabel>
                <span className="help">(Group, Raid)</span>
                <FormControl
                  value={congregation_size}
                  type="number"
                  name="congregation_size"
                  placeholder="Group size..."
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Event);
