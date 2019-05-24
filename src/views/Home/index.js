import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import "./styles.css";
import "./stylesM.css";
import { Timeline } from "react-twitter-widgets";
import { Grid, Row, Col } from "react-bootstrap";
import ReactPlayer from "react-player";
import HomeCarousel from "../../components/HomeCarousel";

const mapStateToProps = ({
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData
}) => ({
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData
});

const mapDispatchToProps = {};

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      votLatestVideo: {},
      vrLatestVideo: {}
    };
  }

  static propTypes = {
    VoTYouTubeChannelData: PropTypes.object,
    VRYouTubeChannelData: PropTypes.object,
    votLatestVideo: PropTypes.object
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, VoTYouTubeChannelData, VRYouTubeChannelData } = props;
    const votLatestVideo = VoTYouTubeChannelData.latest.find(e => e.videoId);
    const vrLatestVideo = VRYouTubeChannelData.latest.find(e => e.videoId);
    this.setState({ User, votLatestVideo, vrLatestVideo });
  };

  render() {
    const { User, votLatestVideo, vrLatestVideo } = this.state;
    return [
      <Grid className="Home Container fadeIn ">
        <Row>
          <Col xs={12}>
            <HomeCarousel User={User} />
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={3} sm={3} className="newsFeed">
            <div>
              <Timeline
                dataSource={{
                  sourceType: "profile",
                  screenName: "pantheon_VoT"
                }}
                options={{
                  username: "Pantheon_VoT",
                  height: "366px",
                  theme: "dark"
                }}
                onLoad={() => null}
              />
            </div>
            <div>
              <Timeline
                dataSource={{
                  sourceType: "profile",
                  screenName: "PantheonMMO"
                }}
                options={{
                  username: "Pantheon",
                  height: "366px",
                  theme: "dark"
                }}
                onLoad={() => null}
              />
            </div>
          </Col>
          <Col lg={6} md={6} className="newsFeed">
            <h1 className="LatestVideoHeader">Latest From VoT</h1>
            {votLatestVideo && (
              <ReactPlayer
                className="Clickable LatestVideo"
                url={`https://www.youtube.com/watch?v=${
                  votLatestVideo.videoId
                }`}
                playing={false}
                width="100%"
                controls
                config={{
                  youtube: {
                    playerVars: { showinfo: 0 }
                  }
                }}
              />
            )}

            <h1 className="LatestVideoHeader">Latest From VR</h1>
            {vrLatestVideo && (
              <ReactPlayer
                className="Clickable LatestVideo"
                url={`https://www.youtube.com/watch?v=${vrLatestVideo.videoId}`}
                playing={false}
                width="100%"
                controls
                config={{
                  youtube: {
                    playerVars: { showinfo: 0 }
                  }
                }}
              />
            )}
          </Col>
          <Col lg={3} md={3} sm={12} className="newsFeed">
            <iframe
              src="https://discordapp.com/widget?id=161500442088439808&theme=dark"
              allowtransparency="true"
              frameborder="0"
              height="742px"
              width="100%"
            />
          </Col>
        </Row>
      </Grid>
    ];
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home);
