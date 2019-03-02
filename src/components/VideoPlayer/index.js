import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, PageHeader, Button } from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import ReactPlayer from "react-player";

const mapStateToProps = ({ VideoToWatch }) => ({
  VideoToWatch
});

const mapDispatchToProps = {};

class VideoPlayer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      pip: false,
      playing: true,
      muted: false
    };
  }

  static propTypes = {
    id: PropTypes.string
  };

  static defaultProps = {};
  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const {
      match: {
        params: { id }
      }
    } = props;
    const {
      match: {
        params: { type }
      }
    } = props;
    this.setState({ id, type });
  };

  pip = () => {
    const { pip } = this.state;
    console.log("PIP");
    this.setState({ pip: !pip });
  };
  onEnablePIP = () => {
    console.log("onEnablePIP");
    this.setState({ pip: true });
  };
  onDisablePIP = () => {
    console.log("onDisablePIP");
    this.setState({ pip: false });
  };

  switchPlayer = (id, type) => {
    switch (type) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${id}`;

      case "twitch":
        return `https://www.twitch.tv/videos/${id}`;

      case "soundcloud":
        return `https://soundcloud.com/${id}/accelerated`;

      case "facebook":
        return `https://www.facebook.com/facebook/videos/${id}`;

      case "vimeo":
        return `https://vimeo.com/${id}`;

      case "streamable":
        return `https://streamable.com/${id}`;

      case "wistia":
        return `https://home.wistia.com/medias/${id}`;

      case "dailymotion":
        return `https://www.dailymotion.com/video/${id}`;

      case "mixcloud":
        return `https://www.mixcloud.com/mixcloud/${id}`;

      default:
        return `${id}`;
    }
  };

  render() {
    const { id, type, pip, playing, muted } = this.state;
    const url = this.switchPlayer(id, type);
    return (
      <Grid className="VideoPlayer Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">Watch</PageHeader>
        </Row>
        <Row>
          <Col className="videoPlayerContainer">
            <ReactPlayer
              className="videoPlayer"
              url={url}
              playing={playing}
              height="100%"
              width="100%"
              muted={muted}
              controls
              pip={pip}
              onEnablePIP={this.onEnablePIP}
              onDisablePIP={this.onDisablePIP}
              config={{ file: { attributes: { disablepictureinpicture: 'true' }}}}
            />
            {ReactPlayer.canEnablePIP(url) && (
              <Button onClick={this.pip}>
                <i className="fas fa-clone" />
              </Button>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
