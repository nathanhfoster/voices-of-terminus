import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Grid, Row, Col, Button } from "react-bootstrap";
import Moment from "react-moment";
import "./styles.css";

import { withRouter } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

class Card extends PureComponent {
  constructor(props) {
    super(props);
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
  };

  render() {
    //console.log('CARD')
    const {
      User,
      canDelete,
      canUpdate,
      click,
      editCard,
      deleteCard,
      summary,
      author,
      author_username,
      html,
      desgin,
      date_created,
      id,
      last_modified,
      last_modified_by,
      last_modified_by_username,
      slug,
      tags,
      title,
      views,
      likeCount,
      commentCount
    } = this.props;
    return (
      <div className="Clickable Card Hover" onClick={click}>
        <div className="Preview">
          <div className="previewItem"> {ReactHtmlParser(html)} </div>{" "}
        </div>{" "}
        {summary ? (
          <div className="Summary inlineNoWrap">
            <div className="summaryTitle">
              <h4 className="inlineNoWrap"> {title} </h4>{" "}
            </div>
            <div className="cardActions">
              {" "}
              {canDelete ? (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    deleteCard(id, User.token);
                  }}
                  bsSize="small"
                  className="pull-right"
                >
                  {" "}
                  <i className="fa fa-trash-alt" />{" "}
                </Button>
              ) : null}{" "}
              {canUpdate ? (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    editCard(id);
                  }}
                  bsSize="small"
                  className="pull-right"
                >
                  {" "}
                  <i className="fa fa-pencil-alt" />{" "}
                </Button>
              ) : null}{" "}
            </div>{" "}
            <div className="cardInfo">
              <div
                className="inlineNoWrap"
                style={{
                  width: "calc(100% - 64px)%"
                }}
              >
                {" "}
                <i className="fas fa-user" />{" "}
                <Link
                  to={"/profile/" + author}
                  onClick={e => e.stopPropagation()}
                >
                  {" "}
                  {author_username}{" "}
                </Link>{" "}
                <i className="far fa-clock" />{" "}
                <Moment fromNow> {date_created} </Moment>
              </div>
              <div>
                {" "}
                <i className="fas fa-pencil-alt" />{" "}
                <Link
                  to={"/profile/" + last_modified_by}
                  onClick={e => e.stopPropagation()}
                >
                  {" "}
                  {last_modified_by_username}{" "}
                </Link>{" "}
                <i className="far fa-clock" />{" "}
                <Moment fromNow> {last_modified} </Moment>
              </div>
              <div>
                {" "}
                <i className="fas fa-tags" /> [{tags}]{" "}
              </div>{" "}
            </div>{" "}
            <div className="cardStats">
              <div>
                {" "}
                <i className="far fa-eye" /> {views}{" "}
              </div>{" "}
              <div>
                {" "}
                <i className="fas fa-thumbs-up" /> {likeCount ? likeCount : 0}{" "}
              </div>{" "}
              <div>
                {" "}
                <i className="fas fa-comment" />{" "}
                {commentCount ? commentCount : 0}{" "}
              </div>{" "}
            </div>{" "}
          </div>
        ) : null}{" "}
      </div>
    );
  }
}
export default withRouter(Card);
