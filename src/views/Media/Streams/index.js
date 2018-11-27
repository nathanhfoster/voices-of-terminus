import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {getVotTwitchStreams} from '../../../actions/App'
import { Grid, Row, Col, Image, NavItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Moment from 'react-moment'

const mapStateToProps = ({VotTwitchStreams}) => ({
  VotTwitchStreams
})

const mapDispatchToProps = {
  getVotTwitchStreams
}

class Streams extends PureComponent {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.props.getVotTwitchStreams()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {VotTwitchStreams} = props
    this.setState({VotTwitchStreams})
  }

  /*
  animated_preview_url: "https://vod-storyboards.twitch.tv/626d9488eaadd9392b35_pantheon_vot_31171011440_1016813646/storyboards/333774978-strip-0.jpg"
broadcast_id: 31171011440
broadcast_type: "archive"
channel: {name: "pantheon_vot", display_name: "pantheon_vot"}
created_at: "2018-11-09T22:40:48Z"
description: null
description_html: null
fps: {160p30: 30.00015364637774, 360p30: 30.00015364637774, 480p30: 30.00015364637774, 720p60: 60.000062078448536, chunked: 59.99982618552336}
game: "Pantheon: Rise of the Fallen"
language: "en"
length: 6443
preview: "https://static-cdn.jtvnw.net/s3_vods/626d9488eaadd9392b35_pantheon_vot_31171011440_1016813646/thumb/thumb0-320x240.jpg"
published_at: "2018-11-09T22:40:48Z"
recorded_at: "2018-11-09T22:40:48Z"
resolutions: {160p30: "284x160", 360p30: "640x360", 480p30: "852x480", 720p60: "1280x720", chunked: "1280x720"}
status: "recorded"
tag_list: ""
thumbnails: (4) [{…}, {…}, {…}, {…}]
title: "Pantheon: Rise of the Fallen Voices of Terminus Show #140 - Player Q&A: w/ The NathanNapalm"
url: "https://www.twitch.tv/videos/333774978"
views: 192
_id: "v333774978"
  */

  renderStreams = streams => streams.map(stream => {
    const id = stream._id.split('v')[1]
    const route = `videos/${id}/twitch`
    return (
      <LinkContainer to={route}>
        <NavItem eventKey={id}>
          <Row className="youTubeContainer">
            <Col md={9} mdPush={3} className="videoTitleContainer">
              <h3>{stream.title}</h3>
              <i className="far fa-clock"/> <Moment fromNow>{stream.created_at}</Moment>
              <p>{stream.description}</p>
            </Col>
            <Col md={3} mdPull={9} className="videoImageContainer"> 
              <Image src={stream.thumbnails[0].url} />
            </Col>
          </Row>
       </NavItem>
      </LinkContainer>
    )
  })

  render() {
    const {videos} = this.state.VotTwitchStreams
    return (
      <Grid className="Streams Container fadeIn-2">
        {this.renderStreams(videos)}
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Streams)