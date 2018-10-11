import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row} from 'react-bootstrap'
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
    const {match} = this.props
    const path = match ? match.path : ' '
    if(path.includes('news')) this.props.getNewsLetter(match.params.id)
    if(path.includes('articles')) this.props.getArticle(match.params.id)
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
    // Check if there is an :id in the url params
    const {match} = this.props
    // Checks if the html document came from an api call or was passed as a prop from another parent
    const html = this.state.html ? this.state.html : this.state.HtmlDocument.html
    return (
      <Grid className="HtmlParser Container fadeIn-2">
        { match ?
          <div className="ViewHtmlDocument">
            {ReactHtmlParser(html)}
          </div> 
        : ReactHtmlParser(html)}
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HtmlParser)