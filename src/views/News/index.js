import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Tabs, Tab, ButtonToolbar, Button, FormGroup, InputGroup, FormControl} from 'react-bootstrap'
import './styles.css'
import {clearHtmlDocument} from '../../actions/App'
import {getNewsletters, getNewsLetter, deleteNewsLetter} from '../../actions/NewsLetter'
import Card from '../../components/Card'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({User, Newsletters}) => ({
  User,
  Newsletters
})

const mapDispatchToProps = {
  getNewsletters,
  getNewsLetter,
  clearHtmlDocument,
  deleteNewsLetter
}

class News extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
   
    }
  }

  static propTypes = { 

  }

  static defaultProps = {
    getNewsletters: PropTypes.func.isRequired
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    this.props.getNewsletters()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User, Newsletters} = props
    this.setState({User, Newsletters})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.props.clearHtmlDocument()
  }

  renderCards = Newsletters => Newsletters.sort((a,b) => new Date(b.date_created) - new Date(a.date_created)).map(card => {
    return (
      <Col className="CardContainer translateHover" md={6}>
        <Card
          {...card}
          click={() => this.props.history.push('/news/' + card.id)}
          editCard={this.props.getNewsLetter}
          deleteCard={this.props.deleteNewsLetter}
          summary={true}
         />
      </Col>
    )
  })

  onChange = (e) => {
    const query = e.target.value.toLowerCase()
    const Newsletters = this.props.Newsletters.filter(newsletter => {
      const title = newsletter.title ? newsletter.title.toLowerCase() : ' '
      const tags = newsletter.tags ? newsletter.tags.toLowerCase() : ' '
      if(title.includes(query) || tags.includes(query)) return true
      return false
    })
    this.setState({Newsletters, [e.target.name]: e.target.value})
}

  render() {
    const {User, Newsletters} = this.state
    return (
      <Grid className="News Container fadeIn-2 fadeIn-2">
        <PageHeader className="pageHeader">NEWS</PageHeader>
        <Row>
          <Col md={4} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
              {User.token ? 
                <Button onClick={() => this.props.history.push('/articles/new/newsletter')}>
                Create
                </Button>
                : null}
          </Col>
          <Col md={8} xs={12} className="ActionToolbar" componentClass={InputGroup}>
            <InputGroup.Addon>
              <FormControl name="filter" componentClass="select" onChange={this.onChange}>
                <option value=" ">TAGS</option>
                <option value="article">article</option>
                <option value="newsletter">newsletter</option>
              </FormControl>
            </InputGroup.Addon>
            <FormControl type="text" name="search" placeholder="Search..." onChange={this.onChange} />
          </Col>
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} className="Tabs" animation={false}>
            <Tab eventKey={1} title="LATEST" className="fadeIn-2" unmountOnExit={true}>
              <Row>
                {Newsletters.length ? this.renderCards(Newsletters) : null}
              </Row>
            </Tab>
            <Tab eventKey={2} title="SUGGESTED" className="fadeIn-2" unmountOnExit={true}>
              Suggested
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(News))
