import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Image
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import {
  viewNewsletter,
  postNewsletterLike,
  updateNewsletterLike,
  postNewsletterComment,
  deleteNewsletterComment
} from "../../actions/NewsLetter";
import {
  viewArticle,
  postArticleLike,
  updateArticleLike,
  postArticleComment,
  deleteArticleComment
} from "../../actions/Articles";
import { setHtmlDocument } from "../../actions/App";
import { withRouter, Link } from "react-router-dom";
import Moment from "react-moment";
import ConfirmAction from "../ConfirmAction";

const mapStateToProps = ({ User, Articles, Newsletters, HtmlDocument }) => ({
  User,
  Articles,
  Newsletters,
  HtmlDocument
});

const mapDispatchToProps = {
  setHtmlDocument,

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
};

class ViewHtmlDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  static propTypes = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const {
      Articles,
      Newsletters,
      viewNewsletter,
      viewArticle,
      setHtmlDocument
    } = this.props;
    const { params, path } = this.props.match;
    const { id } = params;
    if (path.includes("articles")) {
      const reduxArticle = Articles.results.findIndex(k => k.id == id);
      if (reduxArticle != -1) setHtmlDocument(Articles.results[reduxArticle]);
      viewArticle(id);
    }
    if (path.includes("newsletters")) {
      const reduxNewsletter = Newsletters.results.findIndex(k => k.id == id);
      if (reduxNewsletter != -1)
        setHtmlDocument(Newsletters.results[reduxNewsletter]);
      viewNewsletter(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { HtmlDocument } = props;
    this.setState({ HtmlDocument });
  };

  likeDocument = () => {
    const { User, HtmlDocument, match } = this.props;
    const { id } = HtmlDocument;
    const document_id = id;
    const alreadyLiked = HtmlDocument.likes.results.findIndex(
      like => like.author === User.id
    );
    const count = HtmlDocument.likes.results[alreadyLiked]
      ? HtmlDocument.likes.results[alreadyLiked].count + 1
      : 1;
    const payload = { document_id, author: User.id, count };

    if (match.path.includes("newsletters")) {
      alreadyLiked !== -1
        ? this.props.updateNewsletterLike(
            HtmlDocument.likes.results[alreadyLiked].id,
            User.token,
            payload
          )
        : this.props.postNewsletterLike(User.token, payload);
    }
    if (match.path.includes("articles")) {
      alreadyLiked !== -1
        ? this.props.updateArticleLike(
            HtmlDocument.likes.results[alreadyLiked].id,
            User.token,
            payload
          )
        : this.props.postArticleLike(User.token, payload);
    }
  };

  postComment = () => {
    const { User, HtmlDocument, match } = this.props;
    const { text, likes } = this.state;
    const { id } = HtmlDocument;
    const document_id = id;

    const payload = {
      document_id,
      author: User.id,
      text,
      last_modified_by: User.id,
      likes
    };

    if (match.path.includes("newsletters"))
      this.props.postNewsletterComment(User.token, payload);
    if (match.path.includes("articles"))
      this.props.postArticleComment(User.token, payload);
  };

  deleteComment = (id, token) => {
    const { path } = this.props.match;
    if (path.includes("newsletters"))
      this.props.deleteNewsletterComment(id, token);
    if (path.includes("articles")) this.props.deleteArticleComment(id, token);
  };

  renderComments = comments =>
    comments.map(com => {
      const { User } = this.props;
      return (
        <Row className="commentContainer">
          <Col xs={10}>
            <Image
              style={{ height: "50px" }}
              src={com.author_profile_image}
              rounded
            />{" "}
            <Link to={"/profile/" + com.author}>{com.author_username}</Link>
          </Col>
          <Col xs={2} className="pull-right">
            <ConfirmAction
              Action={e => {
                this.deleteComment(com.id, this.props.User.token);
              }}
              Disabled={false}
              Icon={<i className="fa fa-trash-alt" />}
              hasPermission={User.is_superuser || User.id === com.author}
              Size=""
              Class="pull-right"
              Title={com.text}
            />
          </Col>
          <Col xs={12}>
            <i className="far fa-clock" />
            <small>
              {" "}
              <Moment fromNow>{com.last_modified}</Moment>
            </small>
          </Col>
          <Col xs={12}>
            <p>
              <i className="fas fa-comment" /> {com.text}
            </p>
          </Col>
        </Row>
      );
    });

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  validateComment() {
    const { text } = this.state;
    if (text) {
      const { length } = text;
      if (length > 4) return "success";
      else if (length > 150) return "warning";
      else if (length > 256) return "error";
    }
    return null;
  }

  render() {
    const { User } = this.props;
    const { text, HtmlDocument } = this.state;
    const { likes, comments } = HtmlDocument ? HtmlDocument : [];
    const likeTotal = likes
      ? likes.results.reduce((accumulator, like) => accumulator + like.count, 0)
      : 0;
    const userLikeIndex = likes
      ? likes.results.findIndex(like => like.author === User.id)
      : -1;
    const amountLiked =
      User.token && userLikeIndex !== -1
        ? likes.results[userLikeIndex].count
        : 0;
    // console.log("HTMLDOCUMENT");
    return HtmlDocument ? (
      <Grid className="HtmlParser Container fadeIn-2">
        <Row className="ViewHtmlDocument">
          <Col xs={12} className="Center">
            <h2>
              <Link to={"/profile/" + HtmlDocument.author}>
                {HtmlDocument.author_username}
              </Link>
            </h2>
          </Col>
          <Col xs={12} className="Center">
            <i className="fas fa-tags" /> [{HtmlDocument.tags}]
          </Col>
          <Col xs={12}>
            <PageHeader className="Center">{HtmlDocument.title}</PageHeader>
          </Col>
          <Col xs={12}>
            {ReactHtmlParser(
              HtmlDocument.html
                ? HtmlDocument.html
                : "<div style='position: absolute; top: 25%; right: 50%;'><i class='fa fa-spinner fa-spin'/></div>"
            )}
          </Col>
          <Col xs={6} className="Center">
            <h3>
              <i className="far fa-eye" /> {HtmlDocument.views}
            </h3>
          </Col>
          <Col xs={6} className="Center">
            <h3>
              <Button
                disabled={!(User.token && amountLiked < 5)}
                onClick={this.likeDocument}
              >
                <i className="fa fa-thumbs-up" /> {likeTotal}
              </Button>
            </h3>
          </Col>
          {HtmlDocument.comments ? (
            <Col xs={12}>
              <h1 className="Center">COMMENTS</h1>
              {this.renderComments(comments.results)}
            </Col>
          ) : null}
          {User.token ? (
            <Col xs={12}>
              <FormGroup
                className="Center commentBar"
                validationState={this.validateComment()}
              >
                <FormControl
                  className="commentTextArea"
                  componentClass="textarea"
                  value={text}
                  type="text"
                  name="text"
                  placeholder="Comment..."
                  onChange={this.onChange}
                />
              </FormGroup>
              <div className="Center">
                <Button
                  className="commentPostButton"
                  disabled={text.length === 0}
                  type="submit"
                  onClick={this.postComment}
                >
                  Post
                </Button>
              </div>
            </Col>
          ) : null}
        </Row>
      </Grid>
    ) : null;
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ViewHtmlDocument)
);
