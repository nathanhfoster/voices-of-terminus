import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getVotTwitchStreams } from "../../../actions/App";
import { Grid, Row, Col, Image, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "react-moment";
import BrandImage from "../../../images/brand.png";
import { DeepCopy } from "../../../helpers";

const mapStateToProps = ({ VotTwitchStreams }) => ({
  VotTwitchStreams
});

const mapDispatchToProps = {
  getVotTwitchStreams
};

class Streams extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    this.props.getVotTwitchStreams();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let VotTwitchStreams = DeepCopy(props.VotTwitchStreams);
    VotTwitchStreams.videos = VotTwitchStreams.videos
      .filter(v => v._id)
      .map(v => {
        v._id = v._id.split("v")[1];
        return v;
      });
    this.setState({ VotTwitchStreams });
  };

  renderStreams = streams =>
    streams.map(stream => {
      const { _id } = stream;
      const route = `videos/${_id}/twitch`;
      return (
        <LinkContainer to={route}>
          <NavItem eventKey={_id}>
            <Row className="youTubeContainer">
              <Col md={3} className="videoImageContainer Center">
                <Image
                  src={
                    stream.thumbnails.length > 0
                      ? stream.thumbnails[0].url
                      : BrandImage
                  }
                />
              </Col>
              <Col md={9} className="videoTitleContainer">
                <h3>{stream.title}</h3>
                <p>{stream.description}</p>
              </Col>
              <Col md={3} xs={6}>
                <i className="far fa-clock" />{" "}
                <Moment fromNow>{stream.created_at}</Moment>
              </Col>
              <Col md={3} xs={6}>
                <i className="far fa-eye"> {stream.views}</i>
              </Col>
              <Col md={3} xs={6}>
                {stream.broadcast_type == "archive"
                  ? [<span>Type: </span>, <i className="fas fa-archive" />]
                  : [<span>Type: </span>, <i className="fas fa-headset" />]}
              </Col>
              <Col md={3} xs={6}>
                {stream.status == "recorded"
                  ? [
                      <span>Status: </span>,
                      <i className="fas fa-microphone-alt" />
                    ]
                  : [
                      <span>Status: </span>,
                      <i className="fas fa-microphone-alt-slash" />
                    ]}
              </Col>
            </Row>
          </NavItem>
        </LinkContainer>
      );
    });

  render() {
    const streams = this.state.VotTwitchStreams.videos
      ? this.state.VotTwitchStreams.videos
      : [];
    return (
      <Grid className="Streams Container fadeIn">
        {this.renderStreams(streams)}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Streams);
