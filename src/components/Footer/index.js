import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Grid, Row, Col, Image } from 'react-bootstrap'
import femaleElf from '../../images/elf_female.png'
import maleElf from '../../images/elf_male.png'
import femaleHalfling from '../../images/halfling_female.png'
import maleHalfling from '../../images/halfling_male.png'
import femaleHuman from '../../images/human_female.png'
import maleHuman from '../../images/human_male.png'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Footer extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    femaleImages: [
      femaleElf, femaleHalfling, femaleHuman
    ],
    maleImgaes: [
      maleElf, maleHalfling, maleHuman
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
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  /**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
  getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {
    return ([
      <Image className="Female footerImages" src={this.props.femaleImages[this.getRandomInt(0, 2)]} height="400px"/>,
      <Image className="Male footerImages" src={this.props.maleImgaes[this.getRandomInt(0, 2)]} height="400px"/>,
      <div className="FooterContainer">
        <Grid>
          <Row>
           <Col lg={6} md={6} sm={6} xs={12}>
            <h5>The VOT Difference</h5>
            <p class="grey-text text-lighten-4">
              We are the voices of those longing for community, for a family that trancends beliefs, race or blood.
              There is nothing more glorious than sharing an adventure and forming bonds with wonderful people. We
              invite you to share in our adventure in Pantheon: Rise of the Fallen.
            </p>
           </Col>

            <Col lg={3} md={3} sm={3} xs={5}>
              <h5 class="white-text align-center">Must See</h5>
              <Col><a href="http://pantheonmmo.com?referer=VoicesOfTerminus">Pantheon: RotF</a></Col>
              <Col><a href="http://visionaryrealms.com?referer=VoicesOfTerminus" target="_blank">Visionary Realms</a></Col>
              <Col><a href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ" target="_blank">Gameplay</a></Col>
            </Col>

            <Col lg={3} md={3} sm={3} xs={6}>
              <h5>Connect</h5>
              <Row>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="http://twitch.tv/pantheon_vot" target="_blank">Twitch</a>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="http://twitter.com/pantheon_vot">Twitter</a>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ" target="_blank">Youtube</a>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="https://www.facebook.com/VoicesofTerminus/" target="_blank">Facebook</a>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="http://discord.me/vot" target="_blank">Discord</a>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <a href="/donate">Donate</a>
                </Col>
              </Row>
            </Col>
            
          </Row>
        </Grid>
       </div>
    ])
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)