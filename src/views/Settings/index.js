import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Checkbox } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { setSettings } from "../../actions/Settings";

const mapStateToProps = ({ Settings }) => ({ Settings });

const mapDispatchToProps = { setSettings };

class Settings extends Component {
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

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Settings } = props;
    this.setState({ Settings });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { setSettings } = this.props;
    const { Settings } = this.state;
    const { showFooter, pushMessages, fullHtml } = Settings;
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
              checked={showFooter}
              onClick={() => setSettings({ showFooter: !showFooter })}
            >
              <span className="checkBoxText">Show footer</span>
              <span className="help">Toggles the view of the footer.</span>
            </Checkbox>
          </Col>
          <Col xs={12}>
            <Checkbox
              checked={fullHtml}
              onClick={() => setSettings({ fullHtml: !fullHtml })}
            >
              <span className="checkBoxText">Full html</span>
              <span className="help">
                Toggles rendering the full html pages or just the title in each
                card in the News section.
              </span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <Checkbox
              checked={pushMessages}
              onClick={() => setSettings({ pushMessages: !pushMessages })}
            >
              <span className="checkBoxText">Push messages</span>
              <span className="help">
                Toggles frequent fetches of messages.
              </span>
            </Checkbox>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings);
