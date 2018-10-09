import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row} from 'react-bootstrap'
import { Map, List} from 'immutable'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {getNewsLetter} from '../../actions/NewsLetter'
import {getArticle} from '../../actions/Articles'
import {clearHtmlDocument} from '../../actions/App'

const mapStateToProps = ({HtmlDocument}) => ({
  HtmlDocument
})

const mapDispatchToProps = {
  getNewsLetter,
  getArticle,
  clearHtmlDocument
}

class HtmlParser extends Component {
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
    const path = this.props.match ? this.props.match.path : ' '
    if(path.includes('news')) this.props.getNewsLetter(this.props.match.params.id)
    if(path.includes('articles')) this.props.getArticle(this.props.match.params.id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {HtmlDocument, html} = props
    this.setState({HtmlDocument, html})
  }

  componentWillUnmount() {
    //this.props.clearHtmlDocument()
    this.setState({HtmlDocument: null})
  }

  render() {
    // Checks if the html document came from an api call or was passed as a prop from another parent
    const html = this.state.html ? this.state.html : this.state.HtmlDocument.html
    return (
      <Grid className="HtmlParser Container">
        <Row>
          {ReactHtmlParser(html)}
        </Row> 
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HtmlParser)