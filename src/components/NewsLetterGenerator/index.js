import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Modal,
  Form,
  FormGroup,
  InputGroup,
  FormControl
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import EmailEditor from "react-email-editor";
import {
  postNewsletter,
  getNewsletters,
  getNewsletter,
  deleteNewsLetter,
  updateNewsLetter,
  clearNewsletterApi
} from "../../actions/NewsLetters";
import { clearHtmlDocument } from "../../actions/App";
import { withRouter, Redirect } from "react-router-dom";
import formDesign from "./formDesign.json";
import defaultDesign from "./defaultDesign.json";
import Card from "../Card";
import Select from "react-select";
import { getImageBase64 } from "../../helpers/";
import { selectStyles } from "../../helpers/styles";
import { newsletterSelectOptions } from "../../helpers/select";
import { getFavorites, postStatus } from "../../actions/Twitter";

const mapStateToProps = ({ Newsletters, HtmlDocument, User }) => ({
  Newsletters,
  HtmlDocument,
  User
});

const mapDispatchToProps = {
  postNewsletter,
  getNewsletters,
  getNewsletter,
  deleteNewsLetter,
  updateNewsLetter,
  clearHtmlDocument,
  clearNewsletterApi
};

class NewsLetterGenerator extends PureComponent {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);

    this.state = {
      show: false,
      User: null,
      Newsletters: null,
      HtmlDocument: null,
      author: null,
      tags: null,
      title: null,
      id: null,
      selectValue: null,
      design: null,
      newsletterLoaded: false
    };
  }

  static propTypes = {};

  static defaultProps = {
    selectOptions: newsletterSelectOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { clearNewsletterApi } = this.props;
    clearNewsletterApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { selectOptions } = props;
    const { User, Newsletters, HtmlDocument } = props;
    selectOptions[1].isDisabled = !(User.is_leader || User.is_council);
    const { author, title } = HtmlDocument ? HtmlDocument : "";
    const { id } = props.match.params;
    const tags = HtmlDocument
      ? HtmlDocument.tags
          .split("|")
          .filter(i => i != "Newsletter")
          .map(i => (i = { value: i, label: i }))
      : [];
    const selectValue = [selectOptions[0], ...tags];
    let design = null;
    if (HtmlDocument && HtmlDocument.design)
      design = JSON.parse(HtmlDocument.design);

    this.setState({
      design,
      User,
      Newsletters,
      HtmlDocument,
      author,
      tags,
      title,
      id,
      selectValue: this.orderOptions(selectValue)
    });
  };

  componentWillUnmount() {
    const { clearHtmlDocument, clearNewsletterApi } = this.props;
    this.setState({ HtmlDocument: null });
    clearHtmlDocument();
    clearNewsletterApi();
  }

  postNewsletter = () => {
    const { User, title, selectValue } = this.state;
    let { tags } = this.state;
    tags = tags.length < 1 ? selectValue[0].value : tags;
    this.editor.exportHtml(data => {
      let { design, html } = data;
      design = JSON.stringify(design);
      this.props.postNewsletter(User.token, {
        title,
        slug: "news",
        author: User.id,
        tags,
        html,
        design,
        last_modified_by: User.id
      });
    });
  };

  loadNewsletterDesign = design => {
    this.editor.loadDesign(design);
    this.setState({ newsletterLoaded: true });
  };

  loadFormDesign = () => window.unlayer.loadTemplate(4447);

  onDesignLoad = design => {
    //this.editor.setMergeTags([{name: 'First Name'}])

    // Custom Image Storage in Base64
    window.unlayer.registerCallback("image", async (file, done) => {
      const image = file.attachments[0];
      await getImageBase64(image).then(imageBase64 =>
        done({ progress: 100, url: imageBase64 })
      );
    });
  };

  updateNewsletter = () => {
    const { title, tags, id, User } = this.state;
    this.editor.exportHtml(data => {
      let { design, html } = data;
      design = JSON.stringify(design);
      this.props.updateNewsLetter(id, User.token, {
        last_modified_by: User.id,
        title,
        tags,
        design,
        html
      });
    });
  };

  renderDesigns = Newsletters =>
    Newsletters.sort(
      (a, b) => new Date(b.date_created) - new Date(a.date_created)
    ).map(card => {
      return (
        <Col className="NewsletterCardContainer" md={6}>
          <Card
            {...card}
            summary={false}
            deleteCard={this.props.deleteNewsLetter}
            editCard={this.props.getNewsletter}
            click={() => this.handleHide(card.id)}
          />
        </Col>
      );
    });

  handleShow = () => {
    this.props.getNewsletters();
    this.setState({ show: true });
  };

  // Call back function passed into <Card> as a prop
  handleHide = id => {
    if (id) {
      this.props.getNewsletter(id);
      this.props.history.push("/articles/edit/newsletter/" + id);
    }
    this.setState({ show: false });
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
        selectValue = this.props.selectOptions.filter(v => v.isFixed);
        break;
    }
    selectValue = this.orderOptions(selectValue);
    const tags = selectValue.map(i => i.value).join("|");
    this.setState({ selectValue, tags });
  }

  render() {
    const {
      design,
      User,
      Newsletters,
      HtmlDocument,
      author,
      tags,
      title,
      id,
      selectValue,
      newsletterLoaded
    } = this.state;
    const { posting, posted, updating, updated, error } = Newsletters;
    // Set {id} = HtmlDocument if loaded from redux else set {id} = match.params from the url
    // Set {design} = JSON.parse(HtmlDocument.design) if loaded from redux else set {design} = null because you are not editing an existing one

    // True if there are paramaters in the url, redux updated the state in getstate(), and if the editor has loaded into memory
    const isEditingDesign =
      id && design && this.editor && window.unlayer && !newsletterLoaded;

    const styles = {
      boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.25)",
      width: "100%"
    };
    return !User.token ? (
      <Redirect to="/login" />
    ) : !(User.is_superuser || User.can_create_newsletter) ? (
      <Redirect to={this.props.history.goBack()} />
    ) : (
      <Grid className="NewsLetterGenerator Container fadeIn">
        <Row className="ActionToolbarRow">
          <Col xs={4} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button
              disabled={!selectValue[0].value}
              onClick={this.postNewsletter}
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
            <Button onClick={this.updateNewsletter} disabled={!isEditingDesign}>
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
          <Col xs={4} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={this.loadFormDesign}>
              <i className="fab fa-wpforms" />
            </Button>
            <Button
              onClick={() =>
                navigator.clipboard
                  .readText()
                  .then(text => this.loadNewsletterDesign(JSON.parse(text)))
              }
            >
              <i className="fas fa-paste" />
            </Button>
          </Col>
          <Col xs={4} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={this.handleShow} className="pull-right">
              LOAD
            </Button>
            <Button
              onClick={this.updateNewsletter}
              className="pull-right"
              disabled
            >
              SAVE
            </Button>
            <Button
              onClick={() => this.loadNewsletterDesign(defaultDesign)}
              className="pull-right"
            >
              CLEAR
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
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  name="colors"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={this.props.selectOptions}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <EmailEditor
            id="editor"
            projectId={1558}
            displayMode="web"
            templateId="UVUlFBYAZkRx58DwbDkC3BU4JrEmCW9AN8flo4vYtEAg9h1ULftKMXpu2UIEGDZs"
            minHeight="calc(100vh - 58px)"
            ref={editor => (this.editor = editor)}
            style={styles}
            onDesignLoad={this.onDesignLoad}
            onLoad={isEditingDesign ? this.loadNewsletterDesign(design) : null}
            options={{
              templateId: 4447,
              appearance: {
                theme: "dark",
                panels: {
                  tools: {
                    dock: "left"
                  }
                }
              },
              // customCSS: [
              //   `
              //     body {
              //       background-color: yellow !important;
              //     }
              //     .design-web {
              //       background-color: red !important;
              //     }
              //   `
              // ],
              // customJS: [
              //   `
              //     console.log('I am custom JS!');
              //   `
              // ],
              tools: {
                image: {
                  enabled: true
                  //position: 1
                },
                form: {
                  enabled: true
                },
                "custom#video": {
                  data: {
                    user: User.id
                  }
                }
              }
            }}
          />
        </Row>
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={this.state.show}
            onHide={() => this.handleHide(id)}
            dialogClassName="newsletterModal"
            bsSize="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">
                Load Design
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>{this.renderDesigns(Newsletters.results)}</Row>
              </Form>
            </Modal.Body>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(NewsLetterGenerator)
);
