import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, Button} from 'react-bootstrap'
import Moment from 'react-moment'
import './styles.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import HtmlParser from '../HtmlParser'
import {clearHtmlDocument} from '../../actions/App'
import {withRouter} from 'react-router-dom'

const mapStateToProps = ({User, Window}) => ({
  User,
  Window
})

const mapDispatchToProps = {
  clearHtmlDocument
}

class Card extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      author: null,
      body: '', 
      date_created: '',
      last_modified: '',
      last_modified_by: null,
      slug: null,
      tags: '',
      title: ''
    }
  }

  static propTypes = { 
    author: PropTypes.number,
    body: PropTypes.string,
    date_created: PropTypes.Date,
    id: PropTypes.number,
    last_modified: PropTypes.Date,
    last_modified_by: PropTypes.Date,
    slug: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.id != nextState.id
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {isMobile} = props.Window
    const {User, summary, author, author_username, html, design, date_created, id, last_modified, last_modified_by, last_modified_by_username, slug, tags, title} = props
    this.setState({User, summary, author, author_username, html, design, date_created, id, last_modified, last_modified_by, last_modified_by_username, slug, tags, title, isMobile})
  }

  hasDeletePermission = (User, author) => {
    const {tags} = this.state
    if(tags.includes('Article')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_delete_article) return true
      if(User.id == author || User.can_delete_article) return true
    }

    if(tags.includes('Newsletter')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_delete_newsletter) return true
      if(User.id == author || User.can_delete_newsletter) return true
    }
    
    return false
  }

  hasUpdatePermission = (User, author) => {
    const {tags} = this.state
    
    if(tags.includes('Article')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_update_article) return true
      if(User.id == author || User.can_update_article) return true
    }

    if(tags.includes('Newsletter')) {
      if(User.is_superuser) return true
      if(User.is_staff && User.can_update_newsletter) return true
      if(User.id == author || User.can_update_newsletter) return true
    }
    
    return false
  }

  render() {
    const {User, summary, author, author_username, html, desgin, date_created, id, last_modified, last_modified_by, last_modified_by_username, slug, tags, title, isMobile} = this.state
    const hasDeletePermission = this.hasDeletePermission(User, author)
    const hasUpdatePermission = this.hasUpdatePermission(User, author)
    const {click, editCard, deleteCard} = this.props
    return (
      <div className="Clickable Card Hover" onClick={click}>
        <div className="Preview">
          <div className="previewItem">
            <HtmlParser html={html} />
          </div>
        </div>
        {summary ?
          <div className="Summary">
            <div className="summaryTitle inlineNoWrap">
              <h4>{title}</h4>
            </div>
            <hr className="summaryTitleDivider"/>
            <div>
              {hasDeletePermission ? <Button onClick={(e) => {e.stopPropagation(); deleteCard(id, User.token)}} className="cardActions pull-right"><i className="fa fa-trash-alt"/></Button>: null}
              {hasUpdatePermission ? <Button onClick={(e) => {e.stopPropagation(); editCard(id)}} className="cardActions pull-right"><i className="fa fa-pencil-alt"/></Button> : null}
            </div>
            <div className="">
              <h5><i class="fas fa-user"/> <Link to={'/profile/' + author} onClick={(e) => e.stopPropagation()} className="userContainer">{author_username}</Link></h5>
              <h5 style={{minHeight: '30px'}}><i class="fas fa-pencil-alt"/> <Link to={'/profile/' + last_modified_by} onClick={(e) => e.stopPropagation()} className="userContainer">{last_modified_by_username} </Link><Moment fromNow>{last_modified}</Moment></h5>
              <h6>Tags: [{tags}]</h6>
            </div>
        </div>
        : null}
      </div>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Card))