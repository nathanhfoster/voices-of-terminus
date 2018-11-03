import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Grid, Row, Col, Button} from 'react-bootstrap'
import Moment from 'react-moment'
import './styles.css'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import HtmlParser from '../HtmlParser'

const mapStateToProps = ({User, Window}) => ({
  User,
  Window
})

const mapDispatchToProps = {
}

class Card extends Component {
  constructor(props) {
    super(props)
    this.deleteThisCard = this.deleteThisCard.bind(this)
    this.editThisCard = this.editThisCard.bind(this)
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

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  deleteThisCard = id => this.props.deleteCard(id)

  editThisCard = id => {
    // Get current path in url
    const {pathname} = this.props.history.location
    // Call passed edit function
    this.props.editCard(id)
    // Determine route
    if(pathname.includes('articles')) { this.props.history.push('/articles/edit/article/' + id + '/') }
    if(pathname.includes('news')) { this.props.history.push('/articles/edit/newsletter/' + id + '/') }
  }

  hasDeletePermission = (User, author) => {
    const {pathname} = this.props.history.location
    if(pathname.includes('articles')) {
      if(User.is_admin) return true
      if(User.is_staff && User.can_delete_article) return true
      if(User.id == author || User.can_delete_article) return true
    }

    if(pathname.includes('news')) {
      if(User.is_admin) return true
      if(User.is_staff && User.can_delete_newsletter) return true
      if(User.id == author || User.can_delete_newsletter) return true
    }
    
    return false
  }

  hasUpdatePermission = (User, author) => {
    const {pathname} = this.props.history.location
    
    if(pathname.includes('articles')) {
      if(User.is_admin) return true
      if(User.is_staff && User.can_update_article) return true
      if(User.id == author || User.can_update_article) return true
    }

    if(pathname.includes('news')) {
      if(User.is_admin) return true
      if(User.is_staff && User.can_update_article) return true
      if(User.id == author || User.can_update_article) return true
    }
    
    return false
  }

  render() {
    const {User, summary, author, author_username, html, desgin, date_created, id, last_modified, last_modified_by, last_modified_by_username, slug, tags, title, isMobile} = this.state
    const hasUpdatePermission = this.hasUpdatePermission(User, author)
    return (
      <div className="Clickable Card Hover" onClick={this.props.click}>
        <div className="Preview">
          <div className="previewItem">
            <HtmlParser html={html} />
          </div>
        </div>
        {summary ?
          <div className="Summary">
            <div className="summaryTitle">
              <h4>{title}</h4>
            </div>
            <hr className="summaryTitleDivider"/>
            <div>
              {this.hasDeletePermission(User, author) ? <Button onClick={(e) => {e.stopPropagation(); this.deleteThisCard(id)}} className="cardActions pull-right"><i className="fa fa-trash-alt"/></Button>: null}
              {hasUpdatePermission ? <Button onClick={(e) => {e.stopPropagation(); this.editThisCard(id)}} className="cardActions pull-right"><i className="fa fa-pencil-alt"/></Button> : null}
            </div>
            <div>
              <h5>Author: {author_username}</h5>
              <h6>Updated <Moment fromNow>{last_modified}</Moment> by: {last_modified_by_username}</h6>
              <h6>Tags: [{tags}]</h6>
            </div>
        </div>
        : null}
      </div>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Card))