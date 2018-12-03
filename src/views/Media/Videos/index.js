import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Image, NavItem } from "react-bootstrap";
import "./styles.css";
import Moment from "react-moment";
import { LinkContainer } from "react-router-bootstrap";

const mapStateToProps = ({ VoTYouTubeChannelData }) => ({
  VoTYouTubeChannelData
});

const mapDispatchToProps = {};

class Videos extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      VoTYouTubeChannelData: [],
      history: {}
    };
  }

  static propTypes = {
    VoTYouTubeChannelData: PropTypes.array
  };

  static defaultProps = {
    VoTYouTubeChannelData: []
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { VoTYouTubeChannelData } = props;
    this.setState({ VoTYouTubeChannelData });
  };

  renderVideos = videos =>
    videos.map(video => {
      const route = `videos/${video.videoId}/youtube`;
      return (
        <LinkContainer to={route}>
          <NavItem eventKey={video.videoId}>
            <Row className="youTubeContainer">
              <Col md={3} className="videoImageContainer Center">
                <Image src={video.thumbnails.high} />
              </Col>
              <Col md={9} className="videoTitleContainer">
                <h3>{video.title}</h3>
                <i className="far fa-clock" />{" "}
                <Moment fromNow>{video.publishedAt}</Moment>
                <p>{video.description}</p>
              </Col>
            </Row>
          </NavItem>
        </LinkContainer>
      );
    });

  render() {
    const { VoTYouTubeChannelData } = this.state;
    return (
      <Grid className="Videos Container fadeIn-2">
        {VoTYouTubeChannelData.length > 1
          ? this.renderVideos(VoTYouTubeChannelData)
          : null}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Videos);
