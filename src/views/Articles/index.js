import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader,ButtonToolbar, Button } from 'react-bootstrap'
import Drag from '../../components/Drag'
import './styles.css'
import './stylesM.css'
import Card from '../../components/Card'
import {getEditorState} from '../../actions/TextEditor'
import { Map, List} from 'immutable'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({Articles, User}) => ({
  Articles,
  User
})

const mapDispatchToProps = {
  getEditorState
}

class Articles extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      Articles: []
    }
  }

  static propTypes = {
    Articles: new List(),
    getEditorState: PropTypes.func.isRequired
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.props.getEditorState()
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
    
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Articles, User} = props
    this.setState({
      Articles,
      User
    })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderCards = (Articles) => Articles.map(card => {
    return (
      <Col className="CardContainer" md={3}>
        <Card {...card} />
      </Col>
    )
  })

  render() {
    const {Articles, User} = this.state
    return (
      <Grid className="Articles Container">
        <Row>
        <ButtonToolbar>
          {User.token ? <Button onClick={() => this.props.history.push('/articles/new')} className="newArticleButton">
            New Article
          </Button> : null}
          </ButtonToolbar>
        </Row>

        <Row>
          <Drag />
        </Row>

        <Row>
            <PageHeader className="pageHeader">ARTICLES</PageHeader>
        </Row>

        <Row>
          <Col sm={12}>
            <h3>Highlights</h3>
          </Col>
        </Row>
        <Row>
          
        </Row>
          {Articles.length ? this.renderCards(Articles) : null}
        <Row>
          <Col sm={12}>
            <h3>Recent</h3>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Articles))