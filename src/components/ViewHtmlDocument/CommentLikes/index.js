import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormControl,
  Image
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import ConfirmAction from "../../ConfirmAction";
import {
  postNewsletterLike,
  updateNewsletterLike,
  postNewsletterComment,
  deleteNewsletterComment
} from "../../../actions/NewsLetters";
import {
  postArticleLike,
  updateArticleLike,
  postArticleComment,
  deleteArticleComment
} from "../../../actions/Articles";
import "./styles.css";
import { isEquivalent } from "../../../helpers";
import { UserHasPermissions } from "../../../helpers/userPermissions";

const mapStateToProps = ({ User, HtmlDocument }) => ({ User, HtmlDocument });

const mapDispatchToProps = {
  postNewsletterLike,
  updateNewsletterLike,
  postNewsletterComment,
  deleteNewsletterComment,

  postArticleLike,
  updateArticleLike,
  postArticleComment,
  deleteArticleComment
};

class CommentLikes extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { text: "" };
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  shouldComponentUpdate(nextProps, nextState) {
    const { HtmlDocument } = nextProps;
    const { text } = nextState;
    const currentText = this.state.text;
    const currentHtmlDocument = this.state.HtmlDocument;

    const documentChanged = HtmlDocument != currentHtmlDocument;
    const textChanged = !isEquivalent(text, currentText);

    return documentChanged || textChanged;
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, HtmlDocument, history, match } = props;

    const { likes } = HtmlDocument;
    const likeTotal = likes
      ? likes.results.reduce((accumulator, like) => accumulator + like.count, 0)
      : null;
    const userLikeIndex = likes
      ? likes.results.findIndex(like => like.author === User.id)
      : -1;
    const amountLiked =
      User.token && userLikeIndex !== -1
        ? likes.results[userLikeIndex].count
        : 0;
    this.setState({
      User,
      history,
      match,
      HtmlDocument,
      likeTotal,
      amountLiked
    });
  };

  likeDocument = () => {
    this.setState(prevState => ({
      likeTotal: prevState.likeTotal + 1,
      amountLiked: prevState.amountLiked + 1
    }));
    const {
      updateNewsletterLike,
      postNewsletterLike,
      updateArticleLike,
      postArticleLike
    } = this.props;
    const { User, HtmlDocument, match } = this.state;
    const { path } = match;
    const { id } = HtmlDocument;
    const document_id = id;
    const alreadyLiked = HtmlDocument.likes.results.findIndex(
      like => like.author === User.id
    );
    const count = HtmlDocument.likes.results[alreadyLiked]
      ? HtmlDocument.likes.results[alreadyLiked].count + 1
      : 1;
    const payload = { document_id, author: User.id, count };

    if (path.includes("newsletter")) {
      alreadyLiked !== -1
        ? updateNewsletterLike(
            HtmlDocument.likes.results[alreadyLiked].id,
            User.token,
            payload
          )
        : postNewsletterLike(User.token, payload);
    }
    if (path.includes("article")) {
      alreadyLiked !== -1
        ? updateArticleLike(
            HtmlDocument.likes.results[alreadyLiked].id,
            User.token,
            payload
          )
        : postArticleLike(User.token, payload);
    }
  };

  postComment = () => {
    const { postNewsletterComment, postArticleComment } = this.props;
    const { User, HtmlDocument, match } = this.state;
    const { path } = match;
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

    if (path.includes("newsletter")) postNewsletterComment(User.token, payload);
    if (path.includes("article")) postArticleComment(User.token, payload);
  };

  deleteComment = (id, token) => {
    const { match, deleteNewsletterComment, deleteArticleComment } = this.props;
    const { path } = match;
    if (path.includes("newsletter")) deleteNewsletterComment(id, token);
    if (path.includes("article")) deleteArticleComment(id, token);
  };

  renderComments = comments =>
    comments.map(com => {
      const { User, match } = this.props;
      const { path } = match;
      return (
        <Row className="commentContainer" key={com.id}>
          <Col xs={10}>
            <Image
              style={{ height: "50px" }}
              src={com.author_profile_image}
              rounded
            />{" "}
            <Link to={`/profile/${com.author}`}>{com.author_username}</Link>
          </Col>
          <Col xs={2} className="pull-right">
            <ConfirmAction
              Action={e => this.deleteComment(com.id, User.token)}
              Disabled={false}
              Icon={<i className="fas fa-trash" />}
              hasPermission={UserHasPermissions(
                User,
                path.includes("article")
                  ? "delete_articlecomment"
                  : "delete_newslettercomment",
                com.author
              )}
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
    const {
      User,
      history,
      HtmlDocument,
      text,
      likeTotal,
      amountLiked
    } = this.state;
    const { comments } = HtmlDocument ? HtmlDocument : [];
    // console.log("LIKES");

    return (
      <Row>
        <Col xs={6} className="Center">
          <h3>
            <i className="far fa-eye" /> {HtmlDocument.views}
          </h3>
        </Col>
        <Col xs={6} className="Center">
          <h3>
            <Button
              disabled={amountLiked > 5}
              onClick={() =>
                !User.token ? history.push("/login") : this.likeDocument()
              }
            >
              <i className="fa fa-thumbs-up" /> {likeTotal}
            </Button>
          </h3>
        </Col>
        {comments && (
          <Col xs={12}>
            <h1 className="Center">COMMENTS</h1>
            {this.renderComments(comments.results)}
          </Col>
        )}
        {User.token && (
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
            <div className="Center cardActions">
              <Button
                className="commentPostButton"
                disabled={text.length === 0}
                type="submit"
                onClick={this.postComment}
              >
                <i className="fas fa-cloud-upload-alt" /> POST
              </Button>
            </div>
          </Col>
        )}
      </Row>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(CommentLikes);
