import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, Button, PageHeader} from 'react-bootstrap'
import './styles.css'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Donate extends Component {
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
      <Grid className="Donate Container fadeIn-2">
        <Row>
          <Col>
            <PageHeader className="pageHeader">DONATIONS</PageHeader>
            <p className="donationText">VoT (Voices of Terminus) Show is community/fan-based podcast/show started March 23, 2016. Its is made for the community and fans of Pantheon during it’s development and thereafter. 
              The show is never based on tips or donations nor does it budget for them. It is for the community, by the community, for the fans, by the fans. Donations are NEVER required, but 
              if you feel like supporting the show, then click the following link/button. Always take care of yourself first! Otherwise feel free to support the show by retweeting, following 
              and spreading the word!
            </p>
            <Button type="submit" href="https://paypal.me/VoicesofTerminus" target="_blank">Donate</Button>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Donate)