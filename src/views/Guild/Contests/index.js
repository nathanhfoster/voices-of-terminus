import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, Image, Tab, Tabs, PageHeader } from 'react-bootstrap'
import './styles.css'
import contestImage from '../../../images/contest.png'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Contests extends Component {
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
      <Grid className="Contests Container">
         <Row>
          <PageHeader className="pageHeader">CONTESTS</PageHeader>
        </Row>
        <Tabs defaultActiveKey={1} className="currentTab" animation>
          <Tab eventKey={1} title="CURRENT">
            <Image src={contestImage} responsive />
          </Tab>
          <Tab eventKey={2} title="PAST">
            <Row>
              <Col sm={12}>
              <PageHeader className="pageHeader">Stream Layout Contest</PageHeader>
                <h4>Ended:  November 2, 2017.<br/>Winner(s): Rezum</h4>
              <PageHeader className="pageHeader">Skarface Contest</PageHeader>
                <h4>Ended: Jan 31st 2017.<br/>Winner(s): Moxxie</h4>
              <PageHeader className="pageHeader">Joke Contest</PageHeader>
                <h4>Ended: Nov 9th 2016.<br/>Winner(s): Syntro</h4>
              <PageHeader className="pageHeader">Meme Contest</PageHeader>
                <h4>Ended: Sept 29th 2016. <br/>Winner(s): Lyrina</h4>
              <PageHeader className="pageHeader">Short Story Contest</PageHeader>
                <h4>Ended: Aug 18th 2016. <br/>Winner(s): DarkSoulOmega &amp; Teila</h4>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Contests)