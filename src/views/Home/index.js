import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'
import './stylesM.css'
import { Timeline } from 'react-twitter-widgets'
import {Grid, Row, Col, NavItem} from 'react-bootstrap'
import ReactPlayer from 'react-player'
import HomeCarousel from '../../components/HomeCarousel'

const mapStateToProps = ({VoTYouTubeChannelData, VRYouTubeChannelData}) => ({
  VoTYouTubeChannelData,
  VRYouTubeChannelData
})

const mapDispatchToProps = {
}

class Home extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      votLatestVideo: {},
      vrLatestVideo: {}
    }
  }

  static propTypes = {
    VoTYouTubeChannelData: PropTypes.object,
    VRYouTubeChannelData: PropTypes.object,
    votLatestVideo: PropTypes.object
  }

  static defaultProps = {
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
    const votLatestVideo = props.VoTYouTubeChannelData[0]
    const vrLatestVideo = props.VRYouTubeChannelData[0]
    this.setState({votLatestVideo, vrLatestVideo})
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const {votLatestVideo, vrLatestVideo} = this.state
    const youTubeOpts = {
      height: '329px',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
        color: 'white',
      }
    }
    return ([
      <Grid className="Home Container fadeIn-2 ">
      <Row>
        <Col xs={12}>
          <HomeCarousel/>
        </Col>
      </Row>
        <Row>
          <Col lg={3} md={3} sm={3} className="newsFeed">
           <div>
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'pantheon_VoT'
                }}
                options={{
                  username: 'Pantheon_VoT',
                  height: '366px',
                  theme: 'dark'
                }}
                onLoad={() => null}
              />
           </div>
           <div>
            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: 'PantheonMMO'
              }}
              options={{
                username: 'Pantheon',
                height: '366px',
                theme: 'dark'
              }}
              onLoad={() => null}
            />
           </div>
              
          </Col>
          <Col lg={6} md={6} className="newsFeed">
            <h1>Latest From VoT</h1>
            {votLatestVideo ?
              <ReactPlayer
                className="Clickable"
                url={`https://www.youtube.com/watch?v=${votLatestVideo.videoId}`}
                playing={false}
                width="100%"
                controls
                config={{
                  youtube: {
                    playerVars: { showinfo: 0 }
                  }
                }}
              />
              : null }

            <h1>Latest From VR</h1>
            {vrLatestVideo ? 
              <ReactPlayer
                className="Clickable"
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
              : null}
          </Col>
          <Col lg={3} md={3} sm={12} className="newsFeed">
              <iframe src="https://discordapp.com/widget?id=161500442088439808&theme=dark" allowtransparency="true" frameborder="0" height="742px" width="100%"/>
          </Col>
        </Row>
      </Grid>,
      <footer className="HomeFooter">
        <Grid className="Container">
          <span className="copyRight" style={{fontSize: '12px'}}>&copy; {new Date().getFullYear()} Voices of Terminus. Trademarks, copyrights, and media are property of their respective owners.</span>
        </Grid>
      </footer>
    ])
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
