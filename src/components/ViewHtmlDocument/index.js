import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Well, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {viewNewsletter, postNewsletterComment, deleteNewsletterComment} from '../../actions/NewsLetter'
import {viewArticle, postArticleComment, deleteArticleComment} from '../../actions/Articles'
import {withRouter, Link} from 'react-router-dom'
import Moment from 'react-moment'

const mapStateToProps = ({User, HtmlDocument}) => ({
  User,
  HtmlDocument
})

const mapDispatchToProps = {
  viewNewsletter,
  postNewsletterComment,
  deleteNewsletterComment,
  viewArticle,
  postArticleComment,
  deleteArticleComment
}

class ViewHtmlDocument extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  static propTypes = { 
  }

  componentDidMount() {
    const {viewNewsletter, viewArticle} = this.props
    const {params, path} = this.props.match
    if(path.includes('newsletters')) viewNewsletter(params.id)
    if(path.includes('articles')) viewArticle(params.id)
  }

  postComment = () => {
    const {User, HtmlDocument, match} = this.props
    const {text, likes} = this.state
    const {id} = HtmlDocument
    const document_id = id

    const payload = {document_id, author: User.id, text, last_modified_by: User.id, likes}

    if(match.path.includes('newsletters')) this.props.postNewsletterComment(User.token, payload)
    if(match.path.includes('articles')) this.props.postArticleComment(User.token, payload)
  }

  deleteComment = (id, token) => {
    const {path} = this.props.match
    if(path.includes('newsletters')) this.props.deleteNewsletterComment(id, token)
    if(path.includes('articles')) this.props.deleteArticleComment(id, token)
  }

  // id(pin): 1
  // article(pin): 7
  // author(pin): 1
  // author_username(pin): "admin"
  // text(pin): "TESTING"
  // date_created(pin): "2018-11-17T05:42:04.493467Z"
  // last_modified(pin): "2018-11-17T05:42:04.493467Z"
  // last_modified_by(pin): 1
  // last_modified_by_username(pin): "admin"
  // likes(pin): 5

  renderComments = comments => comments.map(com =>
    <Row className="commentContainer">
      <Col md={2} xs={5}><i className="fas fa-user"/> <Link to={'/profile/' + com.author}>{com.author_username}</Link></Col>
      <Col md={7} xs={7}><i class="far fa-clock"/> <Moment fromNow>{com.last_modified}</Moment></Col>
      <Col md={2} xs={10}>{com.likes} <i className="fas fa-thumbs-up"/></Col>
      <Col md={1} xs={2} className="pull-right">
        {this.props.User.id === com.author ? <Button onClick={() => this.deleteComment(com.id, this.props.User.token)} bsSize="small" className="pull-right"><i className="fa fa-trash-alt"/></Button>: null}
      </Col>
      <Col md={12}>{com.text}</Col>
    </Row>
  )

  onChange = e => this.setState({[e.target.name]: e.target.value})

  validateComment() {
    const {text} = this.state
    if(text) {
      const {length} = text
      if (length > 4) return 'success'
      else if (length > 150) return 'warning'
      else if (length > 256) return 'error'
    }
    return null
  }

  render() {
    const {User} = this.props
    const {text} = this.state
    const {HtmlDocument} = this.props
    const {comments} = HtmlDocument ? HtmlDocument : []
    return ( HtmlDocument ?
      <Grid className="HtmlParser Container fadeIn-2">
        <Row className="ViewHtmlDocument">
          <Col md={12}>
            <PageHeader className="pageHeader">{HtmlDocument.title}</PageHeader>
          </Col>
          <Col md={12} className="Center"><h2>By: {HtmlDocument.author_username}</h2></Col>
          <Col md={12}>
            {ReactHtmlParser(HtmlDocument.html)}
          </Col>
          <Col md={12} className="Center">
            <h3><i class="far fa-eye"/> {HtmlDocument.views}</h3>
          </Col>
          {HtmlDocument.comments?
          <Col md={12}>
            <h1 className="Center">COMMENTS <i className="fas fa-comment"/></h1>
            <Well className="userBio">{this.renderComments(comments)}</Well>
          </Col> : null}
          {User.token ?
          <Col md={12}>
            <FormGroup className="Center commentBar" validationState={this.validateComment()}>
              <FormControl className="commentTextArea" componentClass="textarea" value={text} type="text" name="text" placeholder="Comment..." onChange={this.onChange}/>
            </FormGroup>
            <div className="Center"><Button className="commentPostButton" disabled={text.length===0} type="submit" onClick={this.postComment}>Post</Button></div>
          </Col>
          : null}
        </Row>
      </Grid>
      : null
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(ViewHtmlDocument))
