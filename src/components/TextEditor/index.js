import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  InputGroup,
  FormControl,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { setEditorState } from "../../actions/TextEditor";
import { clearHtmlDocument } from "../../actions/App";
import {
  postArticle,
  updateArticle,
  clearArticlesApi
} from "../../actions/Articles";
import { getUsers } from "../../actions/Admin";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { selectStyles } from "../../helpers/styles";
import { isEquivalent } from "../../helpers";
import { articleSlectOptions } from "../../helpers/select";
import { options } from "./options";

const mapStateToProps = ({
  Articles,
  editorState,
  HtmlDocument,
  User,
  Admin
}) => ({
  Articles,
  editorState,
  HtmlDocument,
  User,
  Admin
});

const mapDispatchToProps = {
  postArticle,
  setEditorState,
  updateArticle,
  clearHtmlDocument,
  getUsers,
  clearArticlesApi
};

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);

    this.state = {
      author: null,
      body: "",
      date_created: "",
      date_modified: "",
      id: null,
      last_modified: null,
      last_modified_by: null,
      slug: null,
      tags: "",
      title: "",
      suggestions: [],

      editorState: null,
      show: false,
      selectValue: null
    };
  }

  static propTypes = {
    editorState: PropTypes.func.isRequired
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { editorState, title, User, selectValue } = nextState;
    const currentEditorState = this.state.editorState;
    const currentTitle = this.state.title;
    const currentUser = this.state.User;
    const currentSelectValue = this.state.selectValue;

    const editorChanged = !isEquivalent(currentEditorState, editorState);
    const titleChanged = currentTitle != title;
    const userChanged = !isEquivalent(currentUser, User);
    const isFiltering = selectValue != currentSelectValue;

    return editorChanged || titleChanged || userChanged || isFiltering;
  }

  componentDidMount() {
    const { getUsers, clearArticlesApi } = this.props;
    clearArticlesApi();
    getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { Articles, editorState, Admin } = props;
    const { Users } = Admin;
    const suggestions = Users.map(
      user =>
        (user = {
          text: user.username,
          value: user.username,
          url: `/profile/${user.id}`
        })
    );
    const { User, HtmlDocument, match } = props;
    const Leader = User.is_leader || User.is_council;
    articleSlectOptions[1].isDisabled = !(User.is_leader || User.is_council);
    const { author, title } = HtmlDocument ? HtmlDocument : "";
    const tags = HtmlDocument
      ? HtmlDocument.tags
          .split("|")
          .filter(i => i != "Article")
          .map(i => (i = { value: i, label: i }))
      : [];
    const selectValue = [articleSlectOptions[0], ...tags];
    const { id } = match ? match.params : null;
    const { path } = match ? match : null;

    // If HTML Document has been loaded from Redux and editing a Article
    if (HtmlDocument && path.includes("edit")) {
      const { html } = HtmlDocument;
      editorState = this.htmlToEditorState(html);
    }

    // Set the editorState from Redux if it exists else create an empty state
    else if (editorState) {
      editorState = this.htmlToEditorState(editorState);
    } else editorState = EditorState.createEmpty();

    this.setState({
      Articles,
      User,
      HtmlDocument,
      id,
      author,
      tags,
      title,
      editorState,
      selectValue: this.orderOptions(selectValue),
      suggestions
    });
  };

  htmlToEditorState = html => {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  };

  componentWillUnmount() {
    const { setEditorState, clearHtmlDocument, clearArticlesApi } = this.props;
    const { editorState } = this.state;
    clearArticlesApi();
    // setEditorState(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    clearHtmlDocument();
  }

  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  postArticle = () => {
    const { editorState, title, User, selectValue } = this.state;
    let { tags } = this.state;
    tags = tags.length < 1 ? selectValue[0].value : tags;
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.postArticle(User.token, {
      title,
      slug: "doc",
      author: User.id,
      html,
      tags,
      last_modified_by: User.id
    });
  };

  updateArticle = id => {
    const { author, tags, title, editorState, User } = this.state;
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.updateArticle(id, User.token, {
      last_modified_by: User.id,
      html,
      tags,
      title
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  orderOptions = values =>
    values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));

  onSelectChange(selectValue, { action, removedValue }) {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = articleSlectOptions.filter(v => v.isFixed);
        break;
    }
    selectValue = this.orderOptions(selectValue);
    const tags = selectValue.map(i => i.value).join("|");
    this.setState({ selectValue, tags });
  }

  render() {
    const { history } = this.props;
    const {
      User,
      id,
      author,
      tags,
      title,
      editorState,
      HtmlDocument,
      selectValue,
      suggestions,
      Articles
    } = this.state;
    const { posting, posted, updating, updated, error } = Articles;
    return !(User.is_superuser || User.can_create_article) ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="TextEditor Container fadeIn">
        <Row className="ActionToolbarRow">
          <Col
            md={6}
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!selectValue[0].value}
              type="submit"
              onClick={this.postArticle}
            >
              {posting && !posted
                ? [<i className="fa fa-spinner fa-spin" />, " POST"]
                : !posting && posted && !error
                ? [
                    <i
                      className="fas fa-check"
                      style={{ color: "var(--color_emerald)" }}
                    />,
                    " POST"
                  ]
                : "POST"}
            </Button>
            <Button
              type="submit"
              onClick={() => this.updateArticle(id)}
              disabled={!id}
            >
              {updating && !updated
                ? [<i className="fa fa-spinner fa-spin" />, " UPDATE"]
                : !updating && updated && !error
                ? [
                    <i
                      className="fas fa-check"
                      style={{ color: "var(--color_emerald)" }}
                    />,
                    " UPDATE"
                  ]
                : "UPDATE"}
            </Button>
          </Col>
          <Col
            md={6}
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              type="submit"
              onClick={() =>
                this.setState({
                  editorState: EditorState.createEmpty(),
                  title: "",
                  tags: ""
                })
              }
              className="pull-right"
            >
              Clear
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-heading" />
                </InputGroup.Addon>
                <FormControl
                  value={title}
                  type="text"
                  placeholder="Title"
                  name="title"
                  autoFocus={true}
                  onChange={this.onChange.bind(this)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-tag" />
                </InputGroup.Addon>
                <Select
                  value={selectValue}
                  isMulti
                  styles={selectStyles}
                  isSearchable={false}
                  isClearable={selectValue.some(v => !v.isFixed)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={articleSlectOptions}
                  onBlur={e => e.preventDefault()}
                  onTab={e => e.preventDefault()}
                  blurInputOnSelect={false}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Editor
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              toolbarClassName="Toolbar"
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
              onFocus={e => e.preventDefault()}
              // onBlur={(e, editorState) => {
              //   this.props.setEditorState(
              //     draftToHtml(convertToRaw(editorState.getCurrentContent()))
              //   );
              // }}
              onTab={e => e.preventDefault()}
              blurInputOnSelect={false}
              toolbar={options}
              mention={{
                separator: " ",
                trigger: "@",
                suggestions: suggestions
              }}
              // toolbarOnFocus
              // stripPastedStyles="off"
              // spellCheck="off"
              // autoCapitalize="off"
              // autoComplete="off"
              // autoCorrect="off"
            />
          </Col>
        </Row>
        {/* <Row>
          <Col sm={12}>
            <textarea
            style={{height: '500px', width: '100%'}}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />
          </Col>
        </Row> */}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TextEditor);
