import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {getNewsLetter} from '../../actions/NewsLetter'
import {getArticle} from '../../actions/Articles'
import {clearHtmlDocument} from '../../actions/App'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({HtmlDocument}) => ({
  HtmlDocument
})

const mapDispatchToProps = {
  getNewsLetter,
  getArticle,
  clearHtmlDocument
}

class HtmlParser extends PureComponent {
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

  shouldComponentUpdate(nextProps, nextState) {
    const {HtmlDocument} = nextProps
    // console.log('nextProps: ', nextProps)
    // console.log('nextState: ', nextState)
    return HtmlDocument
  }

  componentDidMount() {
    const {getNewsLetter, getArticle} = this.props
    const {params, path} = this.props.match
    if(path.includes('newsletters')) getNewsLetter(params.id)
    if(path.includes('articles')) getArticle(params.id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {HtmlDocument, html} = props
    this.setState({HtmlDocument, html})
  }

  componentWillUnmount() {
    this.setState({HtmlDocument: null})
    this.props.clearHtmlDocument()
  }

  render() {
    console.log("HTML RENDER")
    const {HtmlDocument} = this.state
    // Check if there is an :id in the url params
    const {match} = this.props
    // Checks if the html document came from an api call or was passed as a prop from another parent
    const html = this.state.HtmlDocument ? this.state.HtmlDocument.html : this.state.html
    return (
      <Grid className="HtmlParser Container fadeIn-2">
        { match.params.id && HtmlDocument ?
            <Row className="ViewHtmlDocument">
              <Col md={12}>
                <PageHeader className="pageHeader">{HtmlDocument.title}</PageHeader>
              </Col>
              <Col md={12} className="Center">
                <h3>By: {HtmlDocument.author_username}</h3>
              </Col>
              <Col md={12}>
                {ReactHtmlParser(html)}
              </Col>
            </Row>
        : ReactHtmlParser(html)
        }
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(HtmlParser))