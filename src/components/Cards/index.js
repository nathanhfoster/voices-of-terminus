import React from "react";

import { Link } from "react-router-dom";
import { Button, ButtonToolbar } from "react-bootstrap";
import Moment from "react-moment";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import ConfirmAction from "../ConfirmAction";
import "./styles.css";

const Html = (html, title) =>
  html
    ? ` <table
      id="u_content_text_1"
      class="u_content_text"
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      border="0"
    >
      <tbody>
        <tr>
          <td
            style="overflow-wrap: break-word;padding:10px;"
            align="left"
          >
            <div style="color: #ffffff; line-height: 140%; text-align: left;">
              <p style="font-size: 24px; line-height: 140%; text-align: center;">
                <span style="text-decoration: underline; font-size: 14px; line-height: 19.6px;">
                  <span style="font-size: 18px; line-height: 25.2px;">
                    ${title}
                  </span>
                </span>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>`
    : `<div style="position: absolute; top: 25%; right: 50%;">
      <i class="fa fa-spinner fa-spin" />
    </div>`;

const options = {
  decodeEntities: true,
  transform
};

function transform(node, index) {
  // return null to block certain elements
  // don't allow <span> elements
  if (node.type === "tag" && node.name === "span") {
    return null;
  }

  // Transform <ul> into <ol>
  // A node can be modified and passed to the convertNodeToElement function which will continue to render it and it's children
  if (node.type === "tag" && node.name === "ul") {
    node.name = "ol";
    return convertNodeToElement(node, index, transform);
  }

  // return an <i> element for every <b>
  // a key must be included for all elements
  if (node.type === "tag" && node.name === "b") {
    return <i key={index}>I am now in italics, not bold</i>;
  }

  // all links must open in a new window
  if (node.type === "tag" && node.name === "a") {
    node.attribs.target = "_blank";
    return convertNodeToElement(node, index, transform);
  }
}

const Cards = props => {
  //console.log("CARD");
  const {
    User,
    Settings,
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
  const { fullHtml } = Settings;
  //
  return (
    <div className="Clickable Card Hover" onClick={click} key={id}>
      <div className="Preview">
        <div className="previewItem">
          {ReactHtmlParser(
            !html
              ? "<div style='position: absolute; top: 25%; right: 50%;'><i class='fa fa-spinner fa-spin'/></div>"
              : fullHtml && html
              ? html
              : Html(html, title)
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
          <div
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <ConfirmAction
              Action={e => deleteCard(id, User.token)}
              Disabled={false}
              Icon={<i className="fas fa-trash" />}
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
                to={`/profile/${author}`}
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
                to={`/profile{last_modified_by}`}
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
