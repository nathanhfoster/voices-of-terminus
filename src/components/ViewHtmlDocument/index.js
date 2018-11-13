import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {getNewsLetter} from '../../actions/NewsLetter'
import {getArticle} from '../../actions/Articles'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({HtmlDocument}) => ({
  HtmlDocument
})

const mapDispatchToProps = {
  getNewsLetter,
  getArticle,
}

class ViewHtmlDocument extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = { 
  }

  componentDidMount() {
    const {getNewsLetter, getArticle} = this.props
    const {params, path} = this.props.match
    if(path.includes('newsletters')) getNewsLetter(params.id)
    if(path.includes('articles')) getArticle(params.id)
  }

  render() {
    console.log("RENDER HTML")
    const {HtmlDocument} = this.props
    // Check if there is an :id in the url params
    const {match} = this.props
    // Checks if the html document came from an api call or was passed as a prop from another parent
    const loadHtml = HtmlDocument ? HtmlDocument.html : '' 
    return (
      <Grid className="HtmlParser Container fadeIn-2">
        <Row className="ViewHtmlDocument">
          <Col md={12}>
            <PageHeader className="pageHeader">{HtmlDocument.title}</PageHeader>
          </Col>
          <Col md={12} className="Center">
            <h3>By: {HtmlDocument.author_username}</h3>
          </Col>
          <Col md={12}>
            {ReactHtmlParser(loadHtml)}
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(ViewHtmlDocument))
