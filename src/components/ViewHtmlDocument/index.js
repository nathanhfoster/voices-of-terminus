import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Button, PageHeader } from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import { isEquivalent } from "../../helpers";
import { UserHasPermissions } from "../../helpers/userPermissions";
import { viewNewsletter } from "../../actions/NewsLetters";
import { viewArticle } from "../../actions/Articles";
import { setHtmlDocument, clearHtmlDocument } from "../../actions/App";
import { deleteArticle } from "../../actions/Articles";
import { deleteNewsLetter } from "../../actions/NewsLetters";
import { Link } from "react-router-dom";
import ConfirmAction from "../../components/ConfirmAction";
import CommentLikes from "./CommentLikes";

const mapStateToProps = ({ User, Articles, Newsletters, HtmlDocument }) => ({
  User,
  Articles,
  Newsletters,
  HtmlDocument
});

const mapDispatchToProps = {
  setHtmlDocument,
  viewNewsletter,
  viewArticle,
  clearHtmlDocument,
  deleteArticle,
  deleteNewsLetter
};

class ViewHtmlDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      User: {},
      HtmlDocument: {},
      text: ""
    };
  }

  static propTypes = {
    User: PropTypes.object,
    HtmlDocument: PropTypes.object,
    text: PropTypes.string,
    setHtmlDocument: PropTypes.func.isRequired,
    viewNewsletter: PropTypes.func.isRequired,
    viewArticle: PropTypes.func.isRequired,
    clearHtmlDocument: PropTypes.func.isRequired,
    deleteArticle: PropTypes.func.isRequired,
    deleteNewsLetter: PropTypes.func.isRequired
  };

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
    if (path.includes("article")) {
      const reduxArticle = Articles.results.findIndex(k => k.id == id);
      if (reduxArticle != -1) setHtmlDocument(Articles.results[reduxArticle]);
      viewArticle(id);
    }
    if (path.includes("newsletter")) {
      const reduxNewsletter = Newsletters.results.findIndex(k => k.id == id);
      if (reduxNewsletter != -1)
        setHtmlDocument(Newsletters.results[reduxNewsletter]);
      viewNewsletter(id);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { HtmlDocument } = nextProps;
    const currentHtmlDocument = this.state.HtmlDocument;

    return !isEquivalent(HtmlDocument, currentHtmlDocument);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, HtmlDocument } = props;
    this.setState({ User, HtmlDocument });
  };

  componentWillUnmount() {
    const { clearHtmlDocument } = this.props;
    clearHtmlDocument();
  }

  render() {
    const { deleteArticle, deleteNewsLetter, history, match } = this.props;
    const { User, HtmlDocument } = this.state;
    const documentId = match.params.id;
    const documentEditUrl = match.url.replace("view", "edit");
    const documentType = documentEditUrl.split("/")[2];
    let deleteAction;
    let goBackUrl;
    if (documentType.includes("article")) {
      deleteAction = deleteArticle;
      goBackUrl = "/articles";
    } else {
      deleteAction = deleteNewsLetter;
      goBackUrl = "/news";
    }

    const { author, author_username, tags, title, html } = HtmlDocument;

    // console.log("HTMLDOCUMENT: RENDERED");
    return (
      HtmlDocument && (
        <Grid className="HtmlParser Container fadeIn">
          <Row className="ViewHtmlDocument">
            {UserHasPermissions(User, `change_${documentType}`, author) && (
              <Col xs={12} className="ActionToolbarRow">
                <Button onClick={e => history.push(documentEditUrl)}>
                  <i className="fas fa-pencil-alt" />
                </Button>
                <ConfirmAction
                  Action={e => {
                    deleteAction(documentId, User.token);
                    history.push(goBackUrl);
                  }}
                  Disabled={false}
                  Icon={<i className="fas fa-trash" />}
                  hasPermission={UserHasPermissions(
                    User,
                    `delete_${documentType}`,
                    author
                  )}
                  Size=""
                  Class="pull-right"
                  Title={title}
                />
              </Col>
            )}
            <Col xs={12} className="Center">
              <h2>
                <Link to={`/profile/${author}`}>{author_username}</Link>
              </h2>
            </Col>
            <Col xs={12} className="Center">
              <i className="fas fa-tags" /> [{tags}]
            </Col>
            <Col xs={12}>
              <PageHeader className="Center">{title}</PageHeader>
            </Col>
            <Col xs={12}>
              {!html ? (
                <div style={{ position: "absolute", top: "25%", right: "50%" }}>
                  <i className="fa fa-spinner fa-spin fa-2x" />
                </div>
              ) : (
                ReactHtmlParser(html)
              )}
            </Col>
            <CommentLikes match={match} history={history} />
          </Row>
        </Grid>
      )
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(
  ViewHtmlDocument
);
