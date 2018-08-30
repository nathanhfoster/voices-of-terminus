import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import leadershipCharter from '../../../images/leadership_charter.png'
import rules from '../../../images/rules_and_regulations.png'
import {Grid, Row, Col, Image} from 'react-bootstrap'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Charters extends Component {
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

  render() {
    return (
      <Grid className="ChartersContainer">
        <Row>
          <Col>
          <h3>The Voice of Terminus Principles</h3>
          <p>Founded upon the principles of family-type bonds, game enjoyment, and teamwork through personal excellence, Voices of Terminus is a collection of tight-knit individuals seeking to explore all aspects of Terminus through teamwork and devotion to enjoyment - without a rabid focus on all-night raiding and non-stop zerging.</p>
          <p>We remain true to each other and to our mission of honing our individual skills to their very utmost so that we can advance together, as one, with the knowledge and satisfaction that advancement was earned through teamwork, shared vision, and like-mind spirits.</p>
          <p>As a guild we stress quality over quantity. We recognize each other as a family and unite as a guild above our own self interest. We value teamwork and thoughtful tactics over blind, brute force. We value each other with the understanding that we are apart of something bigger than ourselves. We are united as a whole, unifying not just to as guild, but to create a family that will meet challenges head on and stand the test of time.</p>
          <p>We are composed of many different people each of us coming from different walks of life, backgrounds, and gaming expertise. As individuals, we impart our unique characteristics to the game and to the guild, but each member branches from the same foundational principles.</p>
          <p>Whether you are a new member or the guild leader himself, we understand that our actions and our voices reflect upon not just ourselves, but resonate the family as a whole. We hold ourselves to the highest standard in all aspects so that our community as a whole properly reflects the quality of its constituent members. We let our actions, our teamwork, and our unity speak where words might sometime fail. This is who we are and together... we are the Voices of Terminus.</p>

          <h3>Leadership Charter</h3>
          <Image src={leadershipCharter} responsive/>
          <h3>Member Charter</h3>
          <Image src={rules} responsive/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Charters)