import React from "react";

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Moment from "react-moment";
import ReactHtmlParser from "react-html-parser";
import ConfirmAction from "../ConfirmAction";
import "./styles.css";


const Cards = props => {
  console.log("CARD");
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
  } = props;
  return (
    <div className="Clickable Card Hover" onClick={click} key={id}>
      <div className="Preview">
        <div className="previewItem">
          {ReactHtmlParser(
            html
              ? html
              : "<div style='position: absolute; top: 25%; right: 50%;'><i class='fa fa-spinner fa-spin'/></div>"
          )}
        </div>
      </div>
      {summary ? (
        <div className="Summary inlineNoWrap">
          <div className="summaryTitle">
            <h4 className="inlineNoWrap">
              <i className="fas fa-heading" /> {title}
            </h4>
          </div>
          <div className="cardActions">
            <ConfirmAction
              Action={e => {
                e.stopPropagation();
                deleteCard(id, User.token);
              }}
              Disabled={false}
              Icon={<i className="fa fa-trash-alt" />}
              hasPermission={canDelete}
              Size="small"
              Class="pull-right"
              Title={title}
            />
            {canUpdate ? (
              <Button
                onClick={e => {
                  e.stopPropagation();
                  editCard(id);
                }}
                bsSize="small"
                className="pull-right"
              >
                <i className="fa fa-pencil-alt" />
              </Button>
            ) : null}
          </div>
          <div className="cardInfo">
            <div
              className="inlineNoWrap"
              style={{
                width: "calc(100% - 64px)%"
              }}
            >
              <i className="fas fa-user" />
              <Link
                to={"/profile/" + author}
                onClick={e => e.stopPropagation()}
              >
                {author_username}
              </Link>{" "}
              <i className="far fa-clock" />
              <Moment fromNow>{date_created}</Moment>
            </div>
            <div>
              <i className="fas fa-pencil-alt" />
              <Link
                to={"/profile/" + last_modified_by}
                onClick={e => e.stopPropagation()}
              >
                {last_modified_by_username}
              </Link>{" "}
              <i className="far fa-clock" />
              <Moment fromNow>{last_modified}</Moment>
            </div>
            <div>
              <i className="fas fa-tags" /> [{tags}]
            </div>
          </div>
          <div className="cardStats">
            <div>
              <i className="far fa-eye" /> {views}
            </div>
            <div>
              <i className="fas fa-thumbs-up" /> {likeCount ? likeCount : 0}
            </div>
            <div>
              <i className="fas fa-comment" /> {commentCount ? commentCount : 0}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cards;
