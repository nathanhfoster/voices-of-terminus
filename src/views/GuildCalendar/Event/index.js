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
import {
  deepCopy,
  roleOptions,
  classOptions,
  removeDuplicates
} from "../../../helpers";
import { Redirect } from "react-router-dom";
import Slider, { Range } from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postEvent, clearEventsApi } from "../../../actions/Events";

const mapStateToProps = ({ User, Events }) => ({ User, Events });

const mapDispatchToProps = { postEvent, clearEventsApi };

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
      group_size: 1
    };
  }

  static propTypes = {};

  static defaultProps = {
    min_level: 1,
    max_level: 60,
    groups: [],
    party: [
      {
        role_preferences: [{ value: "Tank", label: "Tank" }],
        class_preferences: []
      },
      {
        role_preferences: [{ value: "Healer", label: "Healer" }],
        class_preferences: []
      },
      {
        role_preferences: [
          { value: "Melee Dps", label: "Melee Dps" },
          { value: "Off Tank", label: "Off Tank" },
          { value: "Ranged Dps", label: "Ranged Dps" }
        ],
        class_preferences: []
      },
      {
        role_preferences: [{ value: "Crowd Control", label: "Crowd Control" }],
        class_preferences: []
      },
      {
        role_preferences: [{ value: "Support", label: "Support" }],
        class_preferences: []
      },
      {
        role_preferences: [{ value: "Utility", label: "Utility" }],
        class_preferences: []
      }
    ]
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
    const { clearEventsApi } = this.props;
    clearEventsApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events, party } = props;
    let { groups } = this.state;
    if (!groups) {
      groups = [party];
    }
    this.setState({ User, Events, groups });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearEventsApi } = this.props;
    clearEventsApi();
  }

  onChange = e => {
    let { groups, group_size } = this.state;
    const { party } = this.props;
    const { name, value } = e.target;
    if (name === "group_size") {
      if (group_size > value) groups.length -= 1;
      else groups = [...groups, [...party]];
      this.setState({ groups });
    }
    this.setState({ [name]: value });
  };

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
    const { party } = this.props;
    let { groups, group_size } = this.state;
    const raidSelected = selectValue.map(e => e.value).includes("Raid");
    if (raidSelected) {
      group_size = 4;
      for (let i = groups.length; i < group_size; i++) {
        groups = [...groups, [...party]];
      }
    } else {
      group_size = 1;
      groups.length = group_size;
    }
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

    this.setState({ tags: selectValue, group_size, groups });
  };

  onSelectRollPreferenceChange = (
    selectValue,
    { action, removedValue },
    groups,
    groupIndex,
    partyIndex
  ) => {
    groups = deepCopy(groups);
    groups[groupIndex][partyIndex].role_preferences = selectValue;
    switch (action) {
      case "remove-value":
        break;
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = roleOptions.filter(v => v.isFixed);
        groups[groupIndex][partyIndex].class_preferences = [];
        break;
    }
    this.setState({ groups });
  };

  onSelectClassPreferenceChange = (
    selectValue,
    { action, removedValue },
    groups,
    groupIndex,
    partyIndex
  ) => {
    groups = deepCopy(groups);
    groups[groupIndex][partyIndex].class_preferences = selectValue;
    switch (action) {
      case "remove-value":
        break;
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = roleOptions.filter(v => v.isFixed);
        break;
    }
    this.setState({ groups });
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
      group_size,
      groups
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
      location,
      group_size
    };
    postEvent(User.token, payload, groups);
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

  renderGroupClass = (groups, group_size) =>
    groups.map((group, i) => {
      return (
        <Row className="borderedRow memberRow" key={i}>
          <h2 className="headerBanner">Group {i + 1}</h2>
          {group.map((member, k) => {
            const { role_preferences, class_preferences } = member;
            return (
              <Col md={2} xs={12} className="memberCol">
                <FormGroup>
                  <ControlLabel>Role preferences ({k + 1})</ControlLabel>
                  <Select
                    //https://react-select.com/props
                    value={role_preferences}
                    isMulti
                    styles={selectStyles}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                    isSearchable={false}
                    placeholder="Role preferences..."
                    classNamePrefix="select"
                    onChange={(selectValue, { action, removedValue }) =>
                      this.onSelectRollPreferenceChange(
                        selectValue,
                        { action, removedValue },
                        groups,
                        i,
                        k
                      )
                    }
                    options={roleOptions}
                  />
                  <ControlLabel>Class preferences ({k + 1})</ControlLabel>
                  <Select
                    //https://react-select.com/props
                    value={class_preferences}
                    isMulti
                    styles={selectStyles}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                    placeholder="Class preferences..."
                    classNamePrefix="select"
                    onChange={(selectValue, { action, removedValue }) =>
                      this.onSelectClassPreferenceChange(
                        selectValue,
                        { action, removedValue },
                        groups,
                        i,
                        k
                      )
                    }
                    options={this.roleClassOptions(role_preferences)}
                  />
                </FormGroup>
              </Col>
            );
          })}
        </Row>
      );
    });

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
      group_size,
      groups
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
    const raidSelected = tags.map(e => e.value).includes("Raid");
    return !(User.is_superuser || User.can_create_calendar_event) ? (
      history.length > 1 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="Event Container fadeIn">
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
              style={{ marginLeft: 16 }}
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={this.postEvent}
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
            <Col xs={12} style={{ marginTop: 16 }}>
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
            <Col xs={12}>
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
            {raidSelected && (
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel>Group size</ControlLabel>
                  <span className="help">(Number of groups.)</span>
                  <FormControl
                    value={group_size}
                    min={1}
                    max={4}
                    type="number"
                    name="group_size"
                    placeholder="Group size..."
                    onChange={this.onChange}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
          {this.renderGroupClass(groups, group_size)}
        </Form>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Event);
