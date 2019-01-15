import React, { Component } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Image,
  NavItem,
  Tabs,
  Tab
} from "react-bootstrap";
import "./styles.css";
import Moment from "react-moment";
import { LinkContainer } from "react-router-bootstrap";
import Images from "./Images";
import Videos from "./Videos";
import Streams from "./Streams";
import Podcasts from "./Podcasts";

const mapStateToProps = ({ YouTubeChannelData }) => ({
  YouTubeChannelData
});

const mapDispatchToProps = {};

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      YouTubeChannelData: [],
      history: {}
    };
  }

  static propTypes = {
    images: PropTypes.array,
    YouTubeChannelData: PropTypes.array,
    history: PropTypes.object,
    eventKey: ""
  };

  static defaultProps = {
    YouTubeChannelData: [],
    TabItems: [
      {
        eventKey: "/media/images",
        Title: <i className="fas fa-images"> IMAGES</i>,
        Component: Images
      },
      {
        eventKey: "/media/videos",
        Title: <i className="fab fa-youtube"> VIDEOS</i>,
        Component: Videos
      },
      {
        eventKey: "/media/streams",
        Title: <i className="fab fa-twitch"> STREAMS</i>,
        Component: Streams
      },
      {
        eventKey: "/media/podcasts",
        Title: <i className="fas fa-podcast"> PODCASTS</i>,
        Component: Podcasts
      },
      {
        eventKey: "/media/vot-network",
        Title: <i className="fas fa-network-wired"> VOT NETWORK</i>,
        Component: Podcasts
      }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { YouTubeChannelData, history } = props;
    const { pathname } = history.location;
    this.setState({ eventKey: pathname, YouTubeChannelData, history });
  };

  renderTabs = TabItems =>
    TabItems.map(k => (
      <Tab
        eventKey={k.eventKey}
        title={k.Title}
        className="fadeIn"
        unmountOnExit={true}
      >
        {<k.Component />}
      </Tab>
    ));

  render() {
    const { eventKey, history } = this.state;
    const { TabItems } = this.props;
    return (
      <Grid className="Media Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">MEDIA</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs
              defaultActiveKey={eventKey}
              activeKey={eventKey}
              className="Tabs"
              onSelect={eventKey => {
                this.setState({ eventKey });
                history.push(eventKey);
              }}
              animation={false}
            >
              {this.renderTabs(TabItems)}
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Media)
);
