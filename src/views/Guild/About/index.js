import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, NavItem} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class About extends Component {
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
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  render() {
    return (
      <Grid className="About Container fadeIn-2">
        <Row>
          <Col className="votDifferenceContainer">
            <div className="votDifferenceText">
              <h3>The VoT Difference</h3>
              <p>
              We are the voices of those longing for community, for a family that trancends beliefs, race or blood.
              There is nothing more glorious than sharing an adventure and forming bonds with wonderful people.
              We invite you to share in our adventure in Pantheon: Rise of the Fallen.
              </p>
              <div className="SocialMediaLinks">
                <NavItem eventKey={8.1} href="http://discord.me/vot" class="fab fa-discord" target="_blank"></NavItem>
                <NavItem eventKey={8.2} href="http://twitch.tv/pantheon_vot" class="fab fa-twitch" target="_blank"></NavItem>
                <NavItem eventKey={8.3} href="https://www.youtube.com/channel/UCQ0BiIpfN9b5kUP8TA9eG1A" class="fab fa-youtube" target="_blank"></NavItem>
                <NavItem eventKey={8.4} href="https://www.facebook.com/VoicesofTerminus/" class="fab fa-facebook" target="_blank"></NavItem>
                <NavItem eventKey={8.5} href="http://twitter.com/pantheon_vot" class="fab fa-twitter" target="_blank"></NavItem>
              </div>
            </div> 
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(About)