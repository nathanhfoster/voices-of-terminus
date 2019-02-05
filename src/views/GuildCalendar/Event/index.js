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
import { withRouter, Redirect } from "react-router-dom";
import Slider, { Range } from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      min_level: 1,
      max_level: 60,
      role_preferences: [],
      class_preferences: []
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

  onSliderChange = props =>
    this.setState({ min_level: props[0], max_level: props[1] });

  onSliderHandle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="bottom"
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
        selectValue = classOptions.filter(v => v.isFixed);
        break;
    }

    this.setState({ class_preferences: selectValue });
  };

  postEvent = () => {
    const {
      title,
      description,
      tags,
      min_level,
      max_level,
      role_preferences,
      class_preferences
    } = this.state;
    const payload = {
      title,
      description,
      tags: tags.map(i => i.value).join("|"),
      min_level,
      max_level,
      role_preferences: role_preferences.map(i => i.value).join("|"),
      class_preferences: class_preferences.map(i => i.value).join("|")
    };
    console.log(payload);
  };

  roleClassOptions = role_preferences =>
    removeDuplicates(
      role_preferences.map(e => classOptions[e.value]).flat(1),
      "value"
    );

  render() {
    const { history, min_level, max_level } = this.props;
    const {
      User,
      title,
      description,
      tags,
      role_preferences,
      class_preferences
    } = this.state;
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
        <Row className="ActionToolbarRow">
          <Col xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={this.postEvent}
              className="todayButton"
            >
              Post
            </Button>
          </Col>
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
                <ControlLabel>Level range</ControlLabel>
                <Range
                  allowCross={false}
                  min={min_level}
                  max={max_level}
                  defaultValue={[min_level, max_level]}
                  tipFormatter={value => `${value}%`}
                  onChange={props => this.onSliderChange(props)}
                  handle={props => this.onSliderHandle(props)}
                  trackStyle={[{ backgroundColor: "var(--grey)" }]}
                  handleStyle={[
                    {
                      backgroundColor: "var(--primaryColor)",
                      borderColor: "var(--primaryColor)"
                    },
                    {
                      backgroundColor: "var(--primaryColor)",
                      borderColor: "var(--primaryColor)"
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
                  placeholder="Role preferences..."
                  classNamePrefix="select"
                  onChange={this.onSelectClassPreferenceChange}
                  options={this.roleClassOptions(role_preferences)}
                />
                <FormControl.Feedback />
              </FormGroup>
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
