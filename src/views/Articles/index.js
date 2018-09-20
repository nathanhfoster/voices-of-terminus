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

const mapStateToProps = ({Articles}) => ({
  Articles
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
    Cards: [
      { Preview: '1 Contents of a document', Title: 'TITLE 1', Author: 'AUTHOR 1', Tags: ['Review', 'Blog'] },
      { Preview: '2 Contents of a document', Title: 'TITLE 2', Author: 'AUTHOR 2', Tags: ['FanFiction', 'Blog'] },
      { Preview: '3 Contents of a document', Title: 'TITLE 3', Author: 'AUTHOR 3', Tags: ['Blog', 'Review'] },
      { Preview: '4 Contents of a document', Title: 'TITLE 4', Author: 'AUTHOR 4 ', Tags: ['Blog'] },
      { Preview: '5 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 5', Tags: ['Review', 'Blog'] },
      { Preview: '6 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 6', Tags: ['FanFiction', 'Blog'] },
      { Preview: '7 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 7', Tags: ['FanFiction', 'Review'] },
      { Preview: '8 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 8 ', Tags: ['Blog'] }
    ]
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
    //postEditorState('AXIOS FTW')
    this.props.getEditorState()
  }

  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Articles} = props
    this.setState({
      Articles
    })
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderCards = (Cards) => Cards.map(card => {
    return (
      <Col className="CardContainer" md={3}>
        <Card {...card} />
      </Col>
    )
  })

  render() {
    const {Articles} = this.state
    const {Cards} = this.props
    return (
      <Grid className="Articles Container">
        <Row>
        <ButtonToolbar>
          <Button onClick={() => this.props.history.push('/articles/new')} className="newArticleButton">
            New Article
          </Button>
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
          {this.renderCards(Articles)}
        </Row>

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