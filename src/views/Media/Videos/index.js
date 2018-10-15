import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, Image, NavItem} from 'react-bootstrap'
import './styles.css'
import Moment from 'react-moment'
import {LinkContainer} from 'react-router-bootstrap'
import {setVideoToWatch} from '../../../actions/Videos'

const mapStateToProps = ({VoTYouTubeChannelData}) => ({
  VoTYouTubeChannelData
})

const mapDispatchToProps = {
  setVideoToWatch
}

class Videos extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      VoTYouTubeChannelData: [],
      history: {}
    }
  }

  static propTypes = {
    VoTYouTubeChannelData: PropTypes.array,
    setVideoToWatch: PropTypes.func.isRequired
  }

  static defaultProps = {
    VoTYouTubeChannelData: [],
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {VoTYouTubeChannelData} = props
    this.setState({VoTYouTubeChannelData})
  }

    //(k.videoId) => this.props.history.push(k.videoId)

    renderVideos = (videos) => videos.map(video => {
      const route = 'videos/' + video.videoId
      return (
        <LinkContainer to={route} onClick={()=>this.props.setVideoToWatch(video)}>
          <NavItem eventKey={1}>
            <Row className="youTubeContainer">
              <Col md={9} mdPush={3} className="videoTitleContainer">
                <h3>{video.title}</h3>
                <Moment fromNow>{video.publishedAt}</Moment>
                <p>{video.description}</p>
              </Col>
              <Col md={3} mdPull={9} className="videoImageContainer"> 
                <Image src={video.thumbnails.high} />
              </Col>
            </Row>
         </NavItem>
        </LinkContainer>
      )
    })

  render() {
    const {VoTYouTubeChannelData} = this.state
    return (
      <Grid className="Videos Container fadeIn-2">
          {VoTYouTubeChannelData.length > 1 ? this.renderVideos(VoTYouTubeChannelData) : null} 
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Videos)