import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import CreatableSelect from "react-select/lib/Creatable";
import Select from "react-select";
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
  FormGroup,
  Image,
  ControlLabel
} from "react-bootstrap";
import "./styles.css";
import { joinStrings, splitString, isEquivalent } from "../../../helpers";
import { UserHasPermissions } from "../../../helpers/userPermissions";
import { galleryImageTags } from "../../../helpers/options";
import { selectStyles } from "../../../helpers/styles";
import {
  getGalleries,
  getGalleryImage,
  postGallery,
  updateGallery,
  deleteGallery
} from "../../../actions/Media";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import matchSorter from "match-sorter";
import ConfirmAction from "../../../components/ConfirmAction";
import PopOver from "../../../components/PopOver";

const mapStateToProps = ({ User, Galleries }) => ({
  User,
  Galleries
});

const mapDispatchToProps = {
  getGalleries,
  getGalleryImage,
  postGallery,
  updateGallery,
  deleteGallery
};

class Galleries extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: [],
      search: "",
      show: false,
      editing: false,
      title: "",
      description: "",
      gallery_image: null,
      gallery_id: null
    };
  }

  static propTypes = {
    selectValue: PropTypes.array,
    search: PropTypes.string,
    show: PropTypes.bool,
    editing: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    gallery_image: PropTypes.string,
    gallery_id: PropTypes.number
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }
  componentDidMount() {
    const { getGalleries } = this.props;
    getGalleries();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Galleries } = props;
    const currentTags =
      Galleries.results.map(e => splitString(e.tags)).flat(1) || [];
    this.getGalleryImage(Galleries);
    this.setState({
      User,
      Galleries,
      currentTags
    });
  };

  getGalleryImage = Galleries => {
    const { loading, results } = Galleries;
    const emptyGalleryImage = results.findIndex(
      gallery => !gallery.hasOwnProperty("image")
    );
    if (emptyGalleryImage != -1 && !loading)
      return this.props.getGalleryImage(results[emptyGalleryImage].id);
    return null;
  };

  onSelectTagChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = galleryImageTags.filter(v => v.isFixed);
        break;
    }

    this.setState({ tags: selectValue });
  };

  onSelectFilterChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue && removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        selectValue = galleryImageTags.filter(v => v.isFixed);
        break;
    }

    this.setState({ selectValue });
  };

  onChange = filter => {
    const { name, value } = filter.target;
    this.setState({ [name]: value ? value : undefined });
  };

  setImage = e => {
    const { alert } = this.props;
    var file = e.target.files[0];
    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => this.setState({ gallery_image: reader.result });
    }
  };

  postGallery = e => {
    const { postGallery } = this.props;
    e.preventDefault();
    const { User, title, description, gallery_image } = this.state;
    let { tags } = this.state;
    tags = joinStrings(tags);
    const payload = {
      title,
      description,
      image: gallery_image,
      slug: "gallery",
      author: User.id,
      tags,
      last_modified_by: User.id
    };
    postGallery(User.token, payload);
    this.setState({ show: false });
  };

  updateGallery = e => {
    const { updateGallery } = this.props;
    e.preventDefault();
    const { User, title, description, gallery_image, gallery_id } = this.state;
    let { tags } = this.state;
    tags = joinStrings(tags);
    const payload = {
      title,
      description,
      image: gallery_image,
      slug: "gallery",
      author: User.id,
      tags,
      last_modified_by: User.id
    };
    updateGallery(gallery_id, User.token, payload);
    this.setState({ show: false, editing: false });
  };

  renderGalleries = (galleries, filter, dontFilter) => {
    const { User } = this.state;
    const { history } = this.props;
    return galleries
      .filter(gal =>
        dontFilter ? gal : isEquivalent(gal.tags.split("|"), filter)
      )
      .map(gallery => (
        <Col md={3} xs={12} className="galleryCardContainer">
          <div
            key={gallery.id}
            className="Clickable galleryCard Hover"
            onClick={() =>
              history.push(`/media/galleries/images/${gallery.id}`)
            }
          >
            <div className="cardActions">
              <PopOver User={User}>
                <ConfirmAction
                  hasPermission={UserHasPermissions(
                    User,
                    "delete_gallery",
                    gallery.author
                  )}
                  Action={e => this.props.deleteGallery(gallery.id, User.token)}
                  Disabled={false}
                  Icon={<i className="fas fa-trash" />}
                  Size=""
                  Class="pull-right"
                  Title={gallery.title}
                />
                {UserHasPermissions(User, "change_gallery", gallery.author) && (
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      this.setState({
                        show: true,
                        editing: true,
                        gallery_id: gallery.id,
                        title: gallery.title,
                        description: gallery.description,
                        tags: gallery.tags
                          .split("|")
                          .map(i => (i = { value: i, label: i })),
                        gallery_image: gallery.image
                      });
                    }}
                    bsSize=""
                    className="pull-right"
                  >
                    <i className="fa fa-pencil-alt" />
                  </Button>
                )}
              </PopOver>
            </div>
            {gallery.image ? (
              <Image src={gallery.image} />
            ) : (
              <div style={{ position: "absolute", top: "25%", right: "50%" }}>
                <i className="fa fa-spinner fa-spin" />
              </div>
            )}
            <div className="gallerySummary">
              <h4 className="inlineNoWrap">{gallery.title}</h4>
              <p className="inlineNoWrap">{gallery.description}</p>
              <div className="cardInfo">
                <div
                  className="inlineNoWrap"
                  style={{
                    width: "calc(100% - 64px)%"
                  }}
                >
                  <Link
                    to={`/profile/${gallery.author}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {gallery.author_username}
                  </Link>{" "}
                  <i className="far fa-clock" />
                  <Moment fromNow>{gallery.date_created}</Moment>
                </div>
              </div>
            </div>
          </div>
        </Col>
      ));
  };

  render() {
    const {
      User,
      search,
      title,
      description,
      gallery_image,
      editing,
      show,
      currentTags
    } = this.state;
    const { Galleries } = this.state;
    let galleries = Galleries.results ? Galleries.results : [];
    galleries = search
      ? matchSorter(galleries, search, {
          keys: ["title", "author_username", "description"]
        })
      : galleries;
    const selectValue =
      this.state.selectValue.length > 0
        ? this.state.selectValue
        : galleryImageTags;
    const filter = selectValue.map(i => i.value);
    const maxlength = galleryImageTags.length;
    const dontFilter = filter.length == maxlength || filter.length == 0;
    return (
      <Grid className="Galleries Container">
        <Row className="ActionToolbarRow">
          <Col
            md={3}
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(User, "add_gallery") && (
              <Button onClick={() => this.setState({ show: true })}>
                <i className="fas fa-plus" /> Gallery
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
                onChange={filter => this.onChange(filter)}
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
                isSearchable
                placeholder="Filter by tags..."
                classNamePrefix="select"
                onChange={this.onSelectFilterChange}
                options={currentTags}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>{this.renderGalleries(galleries, filter, dontFilter)}</Row>
        {show ? (
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={show}
              onHide={() => this.setState({ show: false, editing: false })}
              dialogClassName="loginModal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">
                  Gallery Creation
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="Container fadeIn">
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl
                          value={title}
                          type="text"
                          name="title"
                          placeholder="Title"
                          onChange={this.onChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                          value={description}
                          type="text"
                          name="description"
                          placeholder="Description"
                          onChange={this.onChange}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <InputGroup>
                        <InputGroup.Addon>
                          <i className="fas fa-tags" />
                        </InputGroup.Addon>
                        <CreatableSelect
                          //https://react-select.com/props
                          value={this.state.tags}
                          isMulti
                          styles={selectStyles()}
                          onBlur={e => e.preventDefault()}
                          blurInputOnSelect={false}
                          isClearable
                          placeholder="Add tags..."
                          classNamePrefix="select"
                          onChange={this.onSelectTagChange}
                          options={currentTags}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="Center">
                    <Col md={12}>
                      <Image
                        src={gallery_image}
                        className="ProfileImages"
                        responsive
                        rounded
                      />
                      <ControlLabel>Gallery Picture</ControlLabel>
                      <FormControl
                        style={{ margin: "auto" }}
                        type="file"
                        label="File"
                        name="gallery_image"
                        onChange={this.setImage}
                      />
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                {editing ? (
                  <Button onClick={this.updateGallery}>UPDATE</Button>
                ) : (
                  <Button onClick={this.postGallery}>
                    <i className="fas fa-cloud-upload-alt" /> POST
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
          </Row>
        ) : null}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Galleries);
