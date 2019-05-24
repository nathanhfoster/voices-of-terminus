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
import { Redirect } from "react-router-dom";
import formDesign from "./formDesign.json";
import votLogoBlock from "./BlockTemplates/votLogo.json";
import defaultDesign from "./defaultDesign.json";
import Cards from "../Cards";
import CreatableSelect from "react-select/lib/Creatable";
import { getImageBase64 } from "../../helpers/";
import { selectStyles } from "../../helpers/styles";
import { newsletterSelectOptions } from "../../helpers/options";
import { UserHasPermissions } from "../../helpers/userPermissions";
import {
  removeAttributeDuplicates,
  joinStrings,
  splitString
} from "../../helpers";
import PendingAction from "../PendingAction";
const { REACT_APP_UNLAYER_API_KEY } = process.env;

const mapStateToProps = ({ Newsletters, HtmlDocument, User, Settings }) => ({
  Newsletters,
  HtmlDocument,
  User,
  Settings
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
      title: null,
      id: null,
      tags: [newsletterSelectOptions[0]],
      design: null,
      newsletterLoaded: false
    };
  }

  static propTypes = {};

  static defaultProps = {
    postNewsletter: PropTypes.func.isRequired,
    getNewsletters: PropTypes.func.isRequired,
    getNewsletter: PropTypes.func.isRequired,
    deleteNewsLetter: PropTypes.func.isRequired,
    updateNewsLetter: PropTypes.func.isRequired,
    clearHtmlDocument: PropTypes.func.isRequired,
    clearNewsletterApi: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { match, getNewsletter, clearNewsletterApi } = this.props;
    const { id } = match.params;
    if (id) getNewsletter(id);
    clearNewsletterApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Newsletters, HtmlDocument } = props;
    const { author, title } = HtmlDocument.author ? HtmlDocument : this.state;
    const { id } = props.match.params;
    let { tags } = this.state;
    if (HtmlDocument.tags) tags = splitString(HtmlDocument.tags);
    const currentTags = Newsletters.results
      .map(e => splitString(e.tags))
      .flat(1);
    const TagOptions = removeAttributeDuplicates(
      [...newsletterSelectOptions, ...currentTags],
      "value"
    );
    let design = null;
    if (HtmlDocument.design) design = JSON.parse(HtmlDocument.design);

    this.setState({
      design,
      User,
      Newsletters,
      HtmlDocument,
      author,
      title,
      id,
      tags: this.orderOptions(tags),
      TagOptions
    });
  };

  componentWillUnmount() {
    const { clearHtmlDocument, clearNewsletterApi } = this.props;
    clearHtmlDocument();
    clearNewsletterApi();
  }

  postNewsletter = () => {
    const { postNewsletter } = this.props;
    const { User, title, tags } = this.state;
    this.editor.exportHtml(data => {
      let { design, html } = data;
      design = JSON.stringify(design);
      postNewsletter(User.token, {
        title,
        slug: "news",
        author: User.id,
        tags: joinStrings(tags),
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
    const { updateNewsLetter } = this.props;
    const { title, tags, id, User } = this.state;
    this.editor.exportHtml(data => {
      let { design, html } = data;
      design = JSON.stringify(design);
      updateNewsLetter(id, User.token, {
        last_modified_by: User.id,
        title,
        tags: joinStrings(tags),
        design,
        html
      });
    });
  };

  renderDesigns = Newsletters =>
    Newsletters.sort(
      (a, b) => new Date(b.date_created) - new Date(a.date_created)
    ).map(card => {
      const { deleteNewsLetter, getNewsletter, User, Settings } = this.props;
      return (
        <Col className="NewsletterCardContainer" md={6}>
          {Cards({
            ...card,
            Settings,
            key: card.id,
            User,
            // canDelete: hasDeletePermission(User, card.author, card.tags),
            // canUpdate: hasUpdatePermission(User, card.author, card.tags),
            click: () => this.handleHide(card.id),
            editCard: getNewsletter,
            deleteCard: deleteNewsLetter,
            summary: false
          })}
        </Col>
      );
    });

  handleShow = () => {
    this.props.getNewsletters();
    this.setState({ show: true });
  };

  // Call back function passed into <Card> as a prop
  handleHide = id => {
    const { getNewsletter, history } = this.props;
    if (id) {
      getNewsletter(id);
      history.push(`/edit/newsletter/${id}`);
    }
    this.setState({ show: false });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  orderOptions = values =>
    values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));

  onSelectChange(tags, { action, removedValue }) {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        tags = newsletterSelectOptions.filter(v => v.isFixed);
        break;
    }
    tags = this.orderOptions(tags);
    this.setState({ tags });
  }

  render() {
    const { history } = this.props;
    const {
      design,
      User,
      Newsletters,
      HtmlDocument,
      author,
      title,
      id,
      tags,
      newsletterLoaded,
      show,
      TagOptions
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
    return !UserHasPermissions(User, "add_newsletter") ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="NewsLetterGenerator Container fadeIn">
        <Row className="ActionToolbarRow">
          <Col
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <PendingAction
              Disabled={!title}
              Click={this.postNewsletter}
              ActionPending={posting}
              ActionComplete={posted}
              ActionError={error}
              ActionName={"POST"}
            />
            <PendingAction
              ShouldShow={id ? true : false}
              Disabled={!(title && design)}
              Click={this.updateNewsletter}
              ActionPending={updating}
              ActionComplete={updated}
              ActionError={error}
              ActionName={"UPDATE"}
            />
          </Col>
          <Col
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
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
                  onChange={e => this.onChange(e)}
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
                <CreatableSelect
                  //https://react-select.com/props
                  value={tags}
                  isMulti
                  styles={selectStyles()}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  isClearable
                  placeholder="Add tags..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={TagOptions}
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
            templateId={REACT_APP_UNLAYER_API_KEY}
            minHeight="calc(100vh - 58px)"
            ref={editor => (this.editor = editor)}
            style={styles}
            onDesignLoad={this.onDesignLoad}
            onLoad={isEditingDesign ? this.loadNewsletterDesign(design) : null}
            options={{
              templateId: !id ? 4447 : null,
              appearance: {
                theme: "dark",
                panels: {
                  tools: {
                    dock: "left"
                  }
                }
              },
              blocks: [votLogoBlock],
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
        {show ? (
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={show}
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
        ) : null}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(
  NewsLetterGenerator
);
