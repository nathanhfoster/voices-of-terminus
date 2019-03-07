import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, ButtonToolbar } from "react-bootstrap";
import Moment from "react-moment";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import ConfirmAction from "../ConfirmAction";
import PopOver from "../PopOver";
import "./styles.css";

class Cards extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isHovered: false };
  }

  static propTypes = {};

  static defaultProps = {
    renderHtml: title =>
      ` <table
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
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({ props });
  };

  render() {
    const { isHovered } = this.state;
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
      commentCount,
      renderHtml
    } = this.state.props;
    return (
      <div
        className="Clickable Card Hover"
        onClick={click}
        key={id}
        // onMouseEnter={() => this.setState({ isHovered: true })}
        // onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <div className="Preview">
          <div className="previewItem">
            {ReactHtmlParser(renderHtml(title))}
          </div>
        </div>
        {summary ? (
          <div className="Summary inlineNoWrap">
            <div className="summaryTitle">
              <h4 className="inlineNoWrap">{title}</h4>
              <PopOver User={User} className="pull-right">
                {canUpdate ? (
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      editCard(id);
                    }}
                    bsSize=""
                    className="pull-right"
                  >
                    <i className="fa fa-pencil-alt" />
                  </Button>
                ) : null}
                <ConfirmAction
                  Action={e => deleteCard(id, User.token)}
                  Disabled={false}
                  Icon={<i className="fas fa-trash" />}
                  hasPermission={canDelete}
                  Size=""
                  Class="pull-right"
                  Title={title}
                />
              </PopOver>
            </div>
            <div
              className="ActionToolbar cardActions"
              componentClass={ButtonToolbar}
            />
            <div className="cardInfo">
              <div
                className="inlineNoWrap"
                style={{
                  width: "calc(100% - 64px)%"
                }}
              >
                <Link
                  to={`/profile/${author}`}
                  onClick={e => e.stopPropagation()}
                >
                  {author_username}
                </Link>{" "}
                <i className="far fa-clock" />
                <Moment fromNow>{date_created}</Moment>
              </div>
              {/* <div>
                <i className="fas fa-pencil-alt" />
                <Link
                  to={`/profile/${last_modified_by}`}
                  onClick={e => e.stopPropagation()}
                >
                  {last_modified_by_username}
                </Link>{" "}
                <i className="far fa-clock" />
                <Moment fromNow>{last_modified}</Moment>
             </div>*/}
              {/* <div>[{tags}]</div> */}
            </div>
            <div className="cardStats">
              <div>
                <i className="far fa-eye" /> {views}
              </div>
              <div>
                <i className="fas fa-thumbs-up" /> {likeCount ? likeCount : 0}
              </div>
              <div>
                <i className="fas fa-comment" />{" "}
                {commentCount ? commentCount : 0}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Cards;
