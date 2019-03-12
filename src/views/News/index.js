import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Tabs,
  Tab,
  ButtonToolbar,
  Button,
  InputGroup,
  FormControl
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import { clearHtmlDocument } from "../../actions/App";
import {
  getArticles,
  getArticle,
  getArticleHtml,
  deleteArticle,
  nextArticles
} from "../../actions/Articles";
import {
  getNewsletters,
  getNewsletter,
  getNewsletterHtml,
  deleteNewsLetter,
  nextNewsletters
} from "../../actions/NewsLetters";
import Cards from "../../components/Cards";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { newsSelectOptions } from "../../helpers/select";
import { selectStyles } from "../../helpers/styles";
import { hasUpdatePermission, hasDeletePermission } from "../../helpers";
import { isSubset } from "../../helpers";
import deepEqual from "deep-equal";
import matchSorter from "match-sorter";

const mapStateToProps = ({ User, Settings, Articles, Newsletters }) => ({
  User,
  Settings,
  Articles,
  Newsletters
});

const mapDispatchToProps = {
  getArticles,
  getArticle,
  getArticleHtml,
  deleteArticle,
  nextArticles,
  getNewsletters,
  getNewsletter,
  getNewsletterHtml,
  deleteNewsLetter,
  nextNewsletters,
  clearHtmlDocument
};

class News extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { path } = match;
    this.state = {
      selectValue: [
        path.includes("article")
          ? { value: "Article", label: "Article" }
          : { value: "Newsletter", label: "Newsletter" }
      ],
      Documents: { results: [] },
      search: ""
    };
  }

  static propTypes = {
    getNewsletters: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectOptions: newsSelectOptions,
    Documents: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    let { Articles, Newsletters } = nextProps;
    const { Documents } = this.state;
    const { selectValue, search, history } = nextState;
    const { pathname } = history.location;

    const currentPathName = this.state.eventKey;
    const currentDocuments = Articles.results.concat(Newsletters.results);

    const currentSelectValue = this.state.selectValue;
    const currentSearch = this.state.search;

    return (
      !deepEqual(Documents, currentDocuments) ||
      !deepEqual(pathname, currentPathName) ||
      !deepEqual(selectValue, currentSelectValue) ||
      !deepEqual(search, currentSearch)
    );
  }

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getArticles, getNewsletters } = this.props;

    getArticles();
    getNewsletters();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  componentWillUnmount() {
    const { clearHtmlDocument } = this.props;
    clearHtmlDocument();
  }

  redirect = (history, path) => {
    if (path == "/articles/") return history.push("/articles/latest");
    if (path == "/news/") return history.push("/news/latest");

    return true;
  };

  getState = props => {
    const { User, Settings, history, match, ApiResponse } = props;
    let { selectOptions } = props;
    let { Articles, Newsletters } = props;
    Articles.results = Articles.hasOwnProperty("results")
      ? Articles.results
      : [];
    Newsletters.results = Newsletters.hasOwnProperty("results")
      ? Newsletters.results
      : [];
    const { pathname } = history.location;

    let Documents = Articles.results.concat(Newsletters.results);

    selectOptions =
      Documents.length > 1
        ? Documents.map(i => i.tags)[0]
            .split("|")
            .map(i => (i = { value: i, label: i }))
        : selectOptions;
    this.setState({
      User,
      Settings,
      Articles,
      Newsletters,
      Documents,
      selectOptions,
      eventKey: pathname,
      history,
      match,
      ApiResponse
    });
  };

  getHtml = (Articles, Newsletters) => {
    const { getArticleHtml, getNewsletterHtml } = this.props;

    const emptyArticleHtml = Articles.results.findIndex(
      article => !article.hasOwnProperty("html")
    );
    const emptyNewsletterHtml = Newsletters.results.findIndex(
      newsletter => !newsletter.hasOwnProperty("html")
    );
    if (emptyArticleHtml != -1 && !Articles.loading) {
      return getArticleHtml(Articles.results[emptyArticleHtml].id);
    }
    if (emptyNewsletterHtml != -1 && !Newsletters.loading) {
      return getNewsletterHtml(Newsletters.results[emptyNewsletterHtml].id);
    }
  };

  //Filter the Documents if the documents tags array contains the filter array
  renderCards = (Settings, Documents, filter, dontFilter, sort, tabFilter) =>
    Documents.filter(doc =>
      dontFilter ? doc : isSubset(doc.tags.split("|"), filter)
    )
      .filter(tabFilter)
      .sort(sort)
      .map(card => {
        const {
          User,
          history,
          getArticle,
          deleteArticle,
          getNewsletter,
          deleteNewsLetter
        } = this.props;
        let click = null;
        let editCard = null;
        let deleteCard = null;
        let className = "CardContainer ";
        if (card.tags.includes("Article")) {
          click = () => history.push(`/view/article/${card.id}`);
          editCard = () => {
            history.push(`/article/edit/${card.id}`);
            getArticle(card.id);
          };
          deleteCard = deleteArticle;
          className += "CardContainerArticle";
        }
        if (card.tags.includes("Newsletter")) {
          click = () => history.push(`/view/newsletter/${card.id}`);
          editCard = () => {
            history.push(`/newsletter/edit/${card.id}`);
            getNewsletter(card.id);
          };
          deleteCard = deleteNewsLetter;
          className += "CardContainerNewsletter";
        }
        return (
          <Col className={className} md={3} sm={6} xs={12}>
            <Cards
              {...card}
              Settings={Settings}
              key={card.id}
              User={User}
              canDelete={hasDeletePermission(User, card.author, card.tags)}
              canUpdate={hasUpdatePermission(User, card.author, card.tags)}
              click={click}
              editCard={editCard}
              deleteCard={deleteCard}
              summary={true}
            />
            {/* {Cards({
              ...card,
              Settings,
              key: card.id,
              User,
              canDelete: hasDeletePermission(User, card.author, card.tags),
              canUpdate: hasUpdatePermission(User, card.author, card.tags),
              click,
              editCard,
              deleteCard,
              summary: true
            })} */}
          </Col>
        );
      });

  onSelectChange = (selectValue, { action, removedValue }) => {
    const { selectOptions } = this.props;
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = selectOptions.filter(v => v.isFixed);
        break;
    }

    this.setState({ selectValue });
  };

  onChange = (filter, Documents) => {
    const { name, value } = filter.target;
    this.setState({ [name]: value ? value : undefined });
  };

  paginate = (Articles, Newsletters) => {
    const { nextArticles, nextNewsletters } = this.props;
    if (Articles) nextArticles(Articles);
    if (Newsletters) nextNewsletters(Newsletters);
  };

  render() {
    // console.log("NEWS");
    const { Articles, Newsletters, selectOptions } = this.props;
    const { User, Settings, search, eventKey, history, match } = this.state;
    let { selectValue } = this.state;
    selectValue = selectValue.length > 0 ? selectValue : selectOptions;
    let { Documents } = this.state;
    Documents = search
      ? matchSorter(Documents, search, {
          keys: ["title", "author_username", "last_modified_by_username"]
        })
      : Documents;
    const Title = match.path.includes("article") ? "ARTICLES" : "NEWS";
    const latest = Title == "ARTICLES" ? "/articles/latest" : "/news/latest";
    const suggested =
      Title == "ARTICLES" ? "/articles/suggested" : "/news/suggested";
    const popular = Title == "ARTICLES" ? "/articles/popular" : "/news/popular";
    const myDocs = Title == "ARTICLES" ? "/articles/my-docs" : "/news/my-docs";
    const filter = selectValue.map(i => i.value);
    const maxlength = selectOptions.length;
    const dontFilter = filter.length == maxlength || filter.length == 0;
    return this.redirect(history, eventKey) && Documents ? (
      <Grid className="News Container">
        <Row>
          <PageHeader className="pageHeader">{Title}</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            md={3}
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {Title == "ARTICLES" &&
              (User.is_superuser || User.can_create_article) && (
                <Button onClick={() => history.push("/article/new/")}>
                  <i className="fas fa-plus" /> Article
                </Button>
              )}
            {Title == "NEWS" && (User.is_superuser || User.can_create_article) && (
              <Button onClick={() => history.push("/newsletter/new")}>
                <i className="fas fa-plus" /> Newsletter
              </Button>
            )}
          </Col>
          <Col md={5} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="fas fa-search" />
              </InputGroup.Addon>
              <FormControl
                type="text"
                name="search"
                placeholder="Filter by Title or Author..."
                value={search}
                onChange={filter => this.onChange(filter, Documents)}
              />
            </InputGroup>
          </Col>
          <Col md={4} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="fas fa-tags" />
              </InputGroup.Addon>
              <Select
                //https://react-select.com/props
                value={this.state.selectValue}
                isMulti
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                isSearchable={false}
                placeholder="Filter by tags..."
                classNamePrefix="select"
                onChange={this.onSelectChange}
                options={selectOptions}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey={eventKey}
            activeKey={eventKey}
            className="Tabs"
            onSelect={eventKey => {
              this.setState({ eventKey });
              history.push(eventKey);
            }}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <Tab eventKey={latest} title="LATEST">
              <Row>
                {Documents.length
                  ? this.renderCards(
                      Settings,
                      Documents,
                      filter,
                      dontFilter,
                      (a, b) =>
                        new Date(b.date_created) - new Date(a.date_created),
                      doc => doc
                    )
                  : null}
              </Row>
            </Tab>
            <Tab eventKey={suggested} title="SUGGESTED">
              <Row>
                {Documents.length
                  ? this.renderCards(
                      Settings,
                      Documents,
                      filter,
                      dontFilter,
                      (a, b) => a.views - b.views,
                      doc => doc
                    )
                  : null}
              </Row>
            </Tab>
            <Tab eventKey={popular} title="POPULAR">
              <Row>
                {Documents.length
                  ? this.renderCards(
                      Settings,
                      Documents,
                      filter,
                      dontFilter,
                      (a, b) => b.popularity - a.popularity,
                      doc => doc
                    )
                  : null}
              </Row>
            </Tab>
            <Tab eventKey={myDocs} title="MY DOCS">
              <Row>
                {!User.token ? (
                  <Redirect to="/login" />
                ) : Documents.length ? (
                  this.renderCards(
                    Settings,
                    Documents,
                    filter,
                    dontFilter,
                    (a, b) =>
                      new Date(b.date_created) - new Date(a.date_created),
                    doc => doc.author === this.state.User.id
                  )
                ) : null}
              </Row>
            </Tab>
          </Tabs>
        </Row>
        <Row className="Center LoadButton">
          {!(Articles.next || Newsletters.next) ? null : (
            <Button
              onClick={() => this.paginate(Articles.next, Newsletters.next)}
            >
              <i className="fas fa-download" /> More
            </Button>
          )}
        </Row>
      </Grid>
    ) : (
      <div style={{ position: "absolute", top: "25%", right: "50%" }}>
        <i className="fa fa-spinner fa-spin" />
      </div>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(News);
