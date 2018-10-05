import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab,} from 'react-bootstrap'
import './styles.css'
import {getNewsletters, deleteNewsLetter} from '../../actions/NewsLetter'
import Card from '../../components/Card'

const mapStateToProps = ({Newsletters}) => ({
  Newsletters
})

const mapDispatchToProps = {
  getNewsletters,
  deleteNewsLetter
}

class News extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
   
    }
  }

  static propTypes = { 

  }

  static defaultProps = {
    getNewsletters: PropTypes.func.isRequired
  }
  
  componentWillMount() {
    this.props.getNewsletters()
    this.getState(this.props)
  }

  componentDidMount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Newsletters} = props
    this.setState({
      Newsletters
    })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderCards = (Newsletters) => Newsletters.map(card => {
    return (
      <Col className="CardContainer" md={6}>
        <Card {...card} deleteItem={this.props.deleteNewsLetter}/>
      </Col>
    )
  })

  render() {
    const {Newsletters} = this.state
    return (
      <Grid className="News Container">
        <Row>
            <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
              <Tab eventKey={1} title="Latest" className="fadeIn-2">
                <Row>
                  {Newsletters.length ? this.renderCards(Newsletters) : null}
                </Row>
              </Tab>
              <Tab eventKey={2} title="Tab 2" className="fadeIn-2">
                Tab 2 content
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(News)