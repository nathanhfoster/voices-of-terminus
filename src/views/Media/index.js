import React, { Component } from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'
import { connect as reduxConnect } from 'react-redux'
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
    images: ImmutableProptypes.listOf,
    YouTubeChannelData: ImmutableProptypes.listOf,
    history: ImmutableProptypes.map
  }

  static defaultProps = {
    images: [imageGallery, videoGallery, streamGallery, podcastGallery],
    YouTubeChannelData: [],
    TabItems: [
      {Route: "/media/images", Title: "IMAGES", Component: Images},
      {Route: "/media/videos", Title: "VIDEOS", Component: Videos},
      {Route: "/media/streams", Title: "STREAMS", Component: Streams},
      {Route: "/media/podcasts", Title: "PODCASTS", Component: Podcasts},
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    const {YouTubeChannelData, history} = props
    this.setState({
      YouTubeChannelData,
      history
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderImages = images => images.map(k => {
    return (
      <Col lg={6} md={6} sm={12}>
        <Image src={k} responsive />
      </Col>
    )
  })

  renderTabs = TabItems => TabItems.map(k => {
    return (
      <Tab eventKey={k.Route} title={k.Title} className="fadeIn-2">
        {<k.Component />}
      </Tab>
    )
  })

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
    const {history} = this.state
    const {TabItems} = this.props
    return (
      <Grid className="Media Container">
        <Row>
          <PageHeader className="pageHeader">MEDIA</PageHeader>
        </Row>
        <Row>
        <Col>
          <Tabs defaultActiveKey={history.location.pathname} className="Tabs" onSelect={(Route) => history.push(Route)} animation={false}>
          {this.renderTabs(TabItems)}
          </Tabs>
        </Col>
      </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Media)