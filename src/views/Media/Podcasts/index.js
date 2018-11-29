import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, Image, NavItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './styles.css'
import './stylesM.css'
import Moment from 'react-moment'
import {getVotPlaylistShow} from '../../../actions/App'

const mapStateToProps = ({VotPlaylistShow}) => ({
  VotPlaylistShow
})

const mapDispatchToProps = {
  getVotPlaylistShow
}

class Podcasts extends PureComponent {
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
    this.props.getVotPlaylistShow()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {VotPlaylistShow} = props
    this.setState({VotPlaylistShow})
  }

  renderPlaylistItems = playlist => playlist.map(podcast => {
    const id = podcast.thumbnail.split('/')[4]
    const route = `podcasts/${id}/youtube`
   return (
     <LinkContainer to={route}>
        <NavItem eventKey={podcast.playlistItemId}>
          <Row className="youTubeContainer">
            <Col md={3} className="videoImageContainer"> 
              <Image src={podcast.thumbnails.high} />
            </Col>
            <Col md={9} className="videoTitleContainer">
              <h3>{podcast.title}</h3>
              <i className="far fa-clock"/> <Moment fromNow>{podcast.publishedAt}</Moment>
              <p>{podcast.description}</p>
            </Col>
          </Row>
        </NavItem>
    </LinkContainer>
   )
  })

  render() {
    const {VotPlaylistShow} = this.state
    return (
      <Grid className="Podcasts Container fadeIn-2">
        {this.renderPlaylistItems(VotPlaylistShow.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)))}
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Podcasts)