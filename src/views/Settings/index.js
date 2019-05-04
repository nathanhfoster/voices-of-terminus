import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Checkbox } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import {
  getUserSettings,
  postSettings,
  setSettings
} from "../../actions/Settings";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { getUserSettings, postSettings, setSettings };

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    Settings: PropTypes.object
  };

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
    const { User, getUserSettings } = this.props;
    if (User.token) getUserSettings(User.token, User.id);
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
    const { postSettings, setSettings } = this.props;
    const { User } = this.state;
    const { Settings } = User;
    const { show_footer, push_messages } = Settings;
    return (
      <Grid className="Settings Container">
        <Row>
          <PageHeader className="pageHeader">SETTINGS</PageHeader>
        </Row>
        <Row>
          <h2 className="headerBanner">Appearance</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <Checkbox
              disabled={!User.id}
              checked={show_footer}
              onClick={() =>
                !Settings.id
                  ? postSettings(User.token, {
                      user: User.id,
                      show_footer: !show_footer
                    })
                  : setSettings(User.token, Settings.id, {
                      show_footer: !show_footer
                    })
              }
            >
              <span className="checkBoxText">Show footer</span>
              <span className="help">Toggles the view of the footer</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <Checkbox
              disabled={!User.id}
              checked={push_messages}
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
              <span className="checkBoxText">Push messages</span>
              <span className="help">Toggles frequent fetches of messages</span>
            </Checkbox>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings);
