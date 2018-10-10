import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, NavItem, Tabs, Tab} from 'react-bootstrap'
import './styles.css'
import Moment from 'react-moment'
import { LinkContainer } from 'react-router-bootstrap'
import imageGallery from '../../images/media-images.png'
import videoGallery from '../../images/media-videos.png'
import streamGallery from '../../images/media-streams.png'
import podcastGallery from '../../images/media-podcasts.png'
import Images from './Images'
import Videos from './Videos'
import Streams from './Streams'
import Podcasts from './Podcasts'
import { Map, List } from 'immutable'

const mapStateToProps = ({YouTubeChannelData}) => ({
  YouTubeChannelData
})

const mapDispatchToProps = {
  
}

class Media extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      YouTubeChannelData: [],
      history: {}
    }
  }

  static propTypes = {
    images: new List(),
    YouTubeChannelData: new List(),
    history: new Map(),
    eventKey: ''
  }

  static defaultProps = {
    images: [imageGallery, videoGallery, streamGallery, podcastGallery],
    YouTubeChannelData: [],
    TabItems: [
      {eventKey: "/media/images", Title: "IMAGES", Component: Images},
      {eventKey: "/media/videos", Title: "VIDEOS", Component: Videos},
      {eventKey: "/media/streams", Title: "STREAMS", Component: Streams},
      {eventKey: "/media/podcasts", Title: "PODCASTS", Component: Podcasts},
    ]
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
    const {YouTubeChannelData, history} = props
    const {pathname} = history.location
    this.setState({eventKey: pathname, YouTubeChannelData, history})
  }

  renderImages = images => images.map(k => (
      <Col lg={6} md={6} sm={12}>
        <Image src={k} responsive />
      </Col>
    )
  )

  renderTabs = TabItems => TabItems.map(k => (
      <Tab eventKey={k.eventKey} title={k.Title} className="fadeIn-2" unmountOnExit={true}>
        {<k.Component />}
      </Tab>
    )
  )

    //(k.videoId) => this.props.history.push(k.videoId)

    renderVideos = (videos) => videos.map(k => {
      const route = k.videoId
      const {TabItems} = this.props
      return (
        <LinkContainer to={route}>
          <NavItem eventKey={1}>
            <Row  className="youTubeContainer" >
              <Col md={9} mdPush={3} className="videoTitleContainer">
                <h3>{k.title}</h3>
                <Moment fromNow>{k.publishedAt}</Moment>
                <p>{k.description}</p>
              </Col>
              <Col md={3} mdPull={9} className="videoImageContainer"> 
                <Image src={k.thumbnails.high} />
              </Col>
            </Row>
         </NavItem>
        </LinkContainer>
      )
    })

  render() {
    const {eventKey, history} = this.state
    const {TabItems} = this.props
    return (
      <Grid className="Media Container fadeIn-2">
        <Row>
          <PageHeader className="pageHeader">MEDIA</PageHeader>
        </Row>
        <Row>
        <Col>
          <Tabs defaultActiveKey={eventKey} activeKey={eventKey} className="Tabs" onSelect={eventKey => {this.setState({eventKey}); history.push(eventKey)}} animation={false}>
            {this.renderTabs(TabItems)}
          </Tabs>
        </Col>
      </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Media))