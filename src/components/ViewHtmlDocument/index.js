import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {viewNewsletter} from '../../actions/NewsLetter'
import {viewArticle} from '../../actions/Articles'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({HtmlDocument}) => ({
  HtmlDocument
})

const mapDispatchToProps = {
  viewNewsletter,
  viewArticle,
}

class ViewHtmlDocument extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = { 
  }

  componentDidMount() {
    const {viewNewsletter, viewArticle} = this.props
    const {params, path} = this.props.match
    if(path.includes('newsletters')) viewNewsletter(params.id)
    if(path.includes('articles')) viewArticle(params.id)
  }

  render() {
    const {HtmlDocument} = this.props
    return ( HtmlDocument ?
      <Grid className="HtmlParser Container fadeIn-2">
        <Row className="ViewHtmlDocument">
          <Col md={12}>
            <PageHeader className="pageHeader">{HtmlDocument.title}</PageHeader>
          </Col>
          <Col md={6} className="Center">
            <h2>By: {HtmlDocument.author_username}</h2>
          </Col>
          <Col md={6} className="Center">
            <h3><i class="far fa-eye"/> {HtmlDocument.views}</h3>
          </Col>
          <Col md={12}>
            {ReactHtmlParser(HtmlDocument.html)}
          </Col>
        </Row>
      </Grid>
      : null
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(ViewHtmlDocument))
