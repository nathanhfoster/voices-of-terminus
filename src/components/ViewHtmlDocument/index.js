import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader, Well, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import {viewNewsletter, postNewsletterLike, updateNewsletterLike, postNewsletterComment, deleteNewsletterComment} from '../../actions/NewsLetter'
import {viewArticle, postArticleLike, updateArticleLike, postArticleComment, deleteArticleComment} from '../../actions/Articles'
import {withRouter, Link} from 'react-router-dom'
import Moment from 'react-moment'

const mapStateToProps = ({User, HtmlDocument}) => ({
  User,
  HtmlDocument
})

const mapDispatchToProps = {
  viewNewsletter,
  postNewsletterLike,
  updateNewsletterLike,
  postNewsletterComment,
  deleteNewsletterComment,

  viewArticle,
  postArticleLike,
  updateArticleLike,
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

  likeDocument = () => {
    const {User, HtmlDocument, match} = this.props
    const {id} = HtmlDocument
    const document_id = id
    const alreadyLiked = HtmlDocument.likes.findIndex(like => like.author === User.id)
    const count = HtmlDocument.likes[alreadyLiked] ? HtmlDocument.likes[alreadyLiked].count + 1 : 1
    const payload = {document_id, author: User.id, count}

    if(match.path.includes('newsletters')) {
      alreadyLiked !== -1 ? this.props.updateNewsletterLike(HtmlDocument.likes[alreadyLiked].id, User.token, payload) : this.props.postNewsletterLike(User.token, payload)
    }
    if(match.path.includes('articles')) {
      alreadyLiked !== -1 ? this.props.updateArticleLike(HtmlDocument.likes[alreadyLiked].id, User.token, payload) : this.props.postArticleLike(User.token, payload)
     }
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

  renderComments = comments => comments.map(com => {
    const {User} = this.props
    return(
    <Row className="commentContainer">
      <Col md={2} xs={5}><i className="fas fa-user"/> <Link to={'/profile/' + com.author}>{com.author_username}</Link></Col>
      <Col md={7} xs={7}><i class="far fa-clock"/> <small><Moment fromNow>{com.last_modified}</Moment></small></Col>
      <Col md={2} xs={10}><i className="fas fa-thumbs-up"/> {com.likes}</Col>
      <Col md={1} xs={2} className="pull-right">
        {User.is_superuser || User.id === com.author ? <Button onClick={() => this.deleteComment(com.id, this.props.User.token)} bsSize="small" className="pull-right"><i className="fa fa-trash-alt"/></Button>: null}
      </Col>
      <Col md={12}><i className="fas fa-comment"/> {com.text}</Col>
    </Row>
    )}
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
    const {likes, comments} = HtmlDocument ? HtmlDocument : []
    const likeTotal = likes ? likes.reduce((accumulator, like) => accumulator + like.count, 0) : 0
    const userLikeIndex = HtmlDocument.likes ? HtmlDocument.likes.findIndex(like => like.author === User.id) : -1
    const amountLiked = User.token && userLikeIndex !== -1 ? HtmlDocument.likes[userLikeIndex].count : 5
    console.log("RENDER")
    return (HtmlDocument ?
      <Grid className="HtmlParser Container fadeIn-2">
        <Row className="ViewHtmlDocument">
          <Col md={12}>
            <PageHeader className="pageHeader">{HtmlDocument.title}</PageHeader>
          </Col>
          <Col md={12} className="Center"><h2>By: {HtmlDocument.author_username}</h2></Col>
          <Col md={12}>
            {ReactHtmlParser(HtmlDocument.html)}
          </Col>
          <Col md={6} className="Center">
            <h3><i class="far fa-eye"/> {HtmlDocument.views}</h3>
          </Col>
          <Col md={6} className="Center">
            <h3><Button disabled={!(User.token && amountLiked < 5)} onClick={this.likeDocument}><i className="fa fa-thumbs-up"/> {likeTotal}</Button></h3>
          </Col>
          {HtmlDocument.comments?
          <Col md={12}>
            <h1 className="Center">COMMENTS</h1>
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
