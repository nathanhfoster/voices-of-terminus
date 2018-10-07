import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import YouTube from 'react-youtube'
import { Map } from 'immutable'

const mapStateToProps = ({VideoToWatch}) => ({
  VideoToWatch
})

const mapDispatchToProps = {
}

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      id: '',
      Video: {}
    }
  }

  static propTypes = {
    id: PropTypes.string,
    Video: new Map(),
    setVideoToWatch: PropTypes.func.isRequired
  }

  static defaultProps = {
  }
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { match: { params: {id} } } = props
    this.setState({id})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }
  render() {
    const {id} = this.state
    return (
      <Grid className="VideoPlayer Container">
      <Row>
        <PageHeader className="pageHeader">Watch</PageHeader>
      </Row>
        <Row>
          <Col className="videoPlayerContainer">
            <YouTube
              videoId={id}              // defaults -> null
              // id={string}                       // defaults -> null
              className="videoPlayer"              // defaults -> null
              // containerClassName={string}       // defaults -> ''
              opts={{
                height: '100%',
                width: '100%',
                playerVars: { // https://developers.google.com/youtube/player_parameters
                  autoplay: false,
                  color: 'white',
                  rel: 0, // Changin Sep 25 https://developers.google.com/youtube/player_parameters#release_notes_08_23_2018
                }
              }}                   // defaults -> {}
              onReady={this._onReady}              // defaults -> noop
              // onPlay={func}                     // defaults -> noop
              // onPause={func}                    // defaults -> noop
              // onEnd={func}                      // defaults -> noop
              // onError={func}                    // defaults -> noop
              // onStateChange={func}              // defaults -> noop
              // onPlaybackRateChange={func}       // defaults -> noop
              // onPlaybackQualityChange={func}    // defaults -> noop
            />
          </Col>
        </Row>        
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(VideoPlayer)