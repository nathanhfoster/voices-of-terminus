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
  getArticlesAllHtml,
  getArticle,
  getArticleHtml,
  deleteArticle,
  nextArticles
} from "../../actions/Articles";
import {
  getNewsletters,
  getNewslettersAllHtml,
  getNewsletter,
  getNewsletterHtml,
  deleteNewsLetter,
  nextNewsletters
} from "../../actions/NewsLetters";
import Card from "../../components/Card";
import Cards from "../../components/Cards";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { newsSelectOptions } from "../../helpers/select";
import { selectStyles } from "../../helpers/styles";
import {
  hasUpdatePermission,
  hasDeletePermission,
  isSubset,
  isEquivalent
} from "../../helpers";
import matchSorter from "match-sorter";

const mapStateToProps = ({ User, Settings, Articles, Newsletters }) => ({
  User,
  Settings,
  Articles,
  Newsletters
});

const mapDispatchToProps = {
  getArticles,
  getArticlesAllHtml,
  getArticle,
  getArticleHtml,
  deleteArticle,
  nextArticles,
  getNewsletters,
  getNewslettersAllHtml,
  getNewsletter,
  getNewsletterHtml,
  deleteNewsLetter,
  nextNewsletters,
  clearHtmlDocument
};

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: [],
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
    const CurrentArticles = this.state.Articles;
    const CurrentNewsletters = this.state.Newsletters;
    const { User, selectValue, search, history } = nextState;
    const { pathname } = history.location;

    Articles.results = Articles.hasOwnProperty("results")
      ? Articles.results
      : [];
    Newsletters.results = Newsletters.hasOwnProperty("results")
      ? Newsletters.results
      : [];

    const documentAddedOrDeleted =
      Documents.length != Articles.results.concat(Newsletters.results).length;

    const currentPathName = this.state.eventKey;
    const currentUser = this.state.User;
    const currentDocuments = Articles.results.concat(Newsletters.results);

    const currentSelectValue = this.state.selectValue;
    const currentSearch = this.state.search;

    const pathChanged = pathname != currentPathName;
    const initialLoad = Documents.length === 0;
    const userChanged = !isEquivalent(currentUser, User);

    const cardUpdated =
      Articles.loading == CurrentArticles.loading ||
      Newsletters.loading == CurrentNewsletters.loading ||
      !isSubset(
        Articles.results.map(k => k.html),
        CurrentArticles.results.map(k => k.html)
      ) ||
      !isSubset(
        Newsletters.results.map(k => k.html),
        CurrentNewsletters.results.map(k => k.html)
      ) ||
      !isSubset(
        Documents.map(k => k.last_modified),
        currentDocuments.map(k => k.last_modified)
      ) ||
      !isSubset(
        Documents.map(k => k.views),
        currentDocuments.map(k => k.views)
      ) ||
      !isSubset(
        Documents.map(k => k.likeCount),
        currentDocuments.map(k => k.likeCount)
      ) ||
      !isSubset(
        Documents.map(k => k.commentCount),
        currentDocuments.map(k => k.commentCount)
      );
    const isFiltering = selectValue != currentSelectValue;
    const isSearching = search != currentSearch;
    return (
      documentAddedOrDeleted ||
      pathChanged ||
      initialLoad ||
      cardUpdated ||
      isFiltering ||
      isSearching ||
      userChanged
    );
  }

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const {
      getArticles,
      getNewsletters,
      getArticlesAllHtml,
      getNewslettersAllHtml
    } = this.props;
    getArticles();
    getNewsletters();
    //getArticlesAllHtml();
    //getNewslettersAllHtml();
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval);
    this.getState(nextProps);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.clearHtmlDocument();
  }

  getState = props => {
    const { User, Settings, history, ApiResponse } = props;
    let { selectOptions } = props;
    let { Articles, Newsletters } = props;
    Articles.results = Articles.hasOwnProperty("results")
      ? Articles.results
      : [];
    Newsletters.results = Newsletters.hasOwnProperty("results")
      ? Newsletters.results
      : [];
    this.getHtml(Articles, Newsletters);
    const { pathname } = history.location;
    const Documents = Articles.results.concat(Newsletters.results);

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
      ApiResponse
    });
  };

  getHtml = (Articles, Newsletters) => {
    const emptyArticleHtml = Articles.results.findIndex(
      article => !article.hasOwnProperty("html")
    );
    const emptyNewsletterHtml = Newsletters.results.findIndex(
      newsletter => !newsletter.hasOwnProperty("html")
    );
    if (emptyArticleHtml != -1 && !Articles.loading) {
      return this.props.getArticleHtml(Articles.results[emptyArticleHtml].id);
    }
    if (emptyNewsletterHtml != -1 && !Newsletters.loading) {
      return this.props.getNewsletterHtml(
        Newsletters.results[emptyNewsletterHtml].id
      );
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
        const { User, history } = this.props;
        let click = null;
        let editCard = null;
        let deleteCard = null;
        let className = "CardContainer ";
        if (card.tags.includes("Article")) {
          click = () => history.push(`/articles/${card.id}`);
          editCard = () => {
            history.push(`/article/edit/${card.id}`);
            this.props.getArticle(card.id);
          };
          deleteCard = this.props.deleteArticle;
          className += "CardContainerArticle";
        }
        if (card.tags.includes("Newsletter")) {
          click = () => history.push(`/newsletters/${card.id}`);
          editCard = () => {
            history.push(`/newsletter/edit/${card.id}`);
            this.props.getNewsletter(card.id);
          };
          deleteCard = this.props.deleteNewsLetter;
          className += "CardContainerNewsletter";
        }
        return (
          <Col className={className} md={3} sm={6} xs={12}>
            {Cards({
              ...card,
              Settings: Settings,
              key: card.id,
              User,
              canDelete: hasDeletePermission(User, card.author, card.tags),
              canUpdate: hasUpdatePermission(User, card.author, card.tags),
              click,
              editCard,
              deleteCard,
              summary: true
            })}
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

  paginate = (nextArticles, nextNewsletters) => {
    if (nextArticles) this.props.nextArticles(nextArticles);
    if (nextNewsletters) this.props.nextNewsletters(nextNewsletters);
  };

  render() {
    //console.log("NEWS");
    const { Articles, Newsletters, selectOptions } = this.props;
    const { User, Settings, search, eventKey, history } = this.state;
    let { selectValue } = this.state;
    selectValue = selectValue.length > 0 ? selectValue : selectOptions;
    let { Documents } = this.state;
    Documents = search
      ? matchSorter(Documents, search, {
          keys: ["title", "author_username", "last_modified_by_username"]
        })
      : Documents;
    const filter = selectValue.map(i => i.value);
    const maxlength = selectOptions.length;
    const dontFilter = filter.length == maxlength || filter.length == 0;
    return Documents ? (
      <Grid className="News Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">NEWS</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            md={3}
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(User.is_superuser || User.can_create_article)}
              onClick={() => history.push("/article/new/")}
            >
              <i className="fas fa-plus" /> Article
            </Button>
            <Button
              disabled={!(User.is_superuser || User.can_create_newsletter)}
              onClick={() => history.push("/newsletter/new")}
            >
              <i className="fas fa-plus" /> Newsletter
            </Button>
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
                styles={selectStyles}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                isSearchable={false}
                name="colors"
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
            animation={false}
            mountOnEnter={false}
            unmountOnExit={true}
          >
            <Tab eventKey="/news/latest" title="LATEST" className="fadeIn">
              <Row>
                {Documents.length
                  ? this.renderCards(
                      Settings,
                      Documents,
                      filter,
                      dontFilter,
                      (a, b) =>
                        new Date(b.last_modified) - new Date(a.last_modified),
                      doc => doc
                    )
                  : null}
              </Row>
            </Tab>
            <Tab
              eventKey="/news/suggested"
              title="SUGGESTED"
              className="fadeIn"
            >
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
            <Tab eventKey="/news/popular" title="POPULAR" className="fadeIn">
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
            <Tab eventKey="/news/my-docs" title="MY DOCS" className="fadeIn">
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
                      new Date(b.last_modified) - new Date(a.last_modified),
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
