import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, Button} from 'react-bootstrap'
import Moment from 'react-moment'
import './styles.css'

import {withRouter} from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'

class Card extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    User: PropTypes.object,
    summary: PropTypes.bool,
    author: PropTypes.number,
    html: PropTypes.string,
    design: PropTypes.string,
    date_created: PropTypes.Date,
    id: PropTypes.number,
    last_modified: PropTypes.Date,
    last_modified_by: PropTypes.Date,
    slug: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string
  }

  render() {
    const {User, canDelete, canUpdate, click, editCard, deleteCard, summary, author, author_username, html, desgin, date_created, id, last_modified, last_modified_by, last_modified_by_username, slug, tags, title} = this.props
    return (
      <div className="Clickable Card Hover" onClick={click}>
        <div className="Preview">
          <div className="previewItem">
            {ReactHtmlParser(html)}
          </div>
        </div>
        {summary ?
          <div className="Summary">
            <div className="summaryTitle inlineNoWrap">
              <h4>{title}</h4>
            </div>
            <hr className="summaryTitleDivider"/>
            <div>
              {canDelete ? <Button onClick={(e) => {e.stopPropagation(); deleteCard(id, User.token)}} className="cardActions pull-right"><i className="fa fa-trash-alt"/></Button>: null}
              {canUpdate ? <Button onClick={(e) => {e.stopPropagation(); editCard(id)}} className="cardActions pull-right"><i className="fa fa-pencil-alt"/></Button> : null}
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
export default withRouter(Card)
