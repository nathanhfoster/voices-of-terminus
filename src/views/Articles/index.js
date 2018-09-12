import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import Card from '../../components/Card'
import TextEditor from '../../components/TextEditor'

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = {
}

class Articles extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
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
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
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

  renderCards = (Cards) => Cards.map(card => {
    return (
      <Col className="CardContainer" md={3}>
        <Card {...card} />
      </Col>
    )
  })

  render() {
    const {Cards} = this.props
    return (
      <Grid className="Articles Container">
        <Row>
          <TextEditor />
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
          {this.renderCards(Cards)}
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
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Articles)