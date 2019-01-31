import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  PageHeader,
  Row,
  Col,
  Image,
  ButtonToolbar,
  InputGroup,
  FormControl,
  Button,
  Modal,
  Form,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import { newsSelectOptions } from "../../../../helpers/select";
import { selectStyles } from "../../../../helpers/styles";
import { connect as reduxConnect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  viewGalleryImages,
  viewGalleryImage,
  postGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  clearGalleryImages
} from "../../../../actions/Media";
import Moment from "react-moment";
import matchSorter from "match-sorter";
import { isSubset } from "../../../../helpers";
import "./styles.css";
import "./stylesM.css";
import ConfirmAction from "../../../../components/ConfirmAction";
import Lightbox from "react-image-lightbox";
import { withAlert } from "react-alert";

const mapStateToProps = ({ User, Galleries }) => ({
  User,
  Galleries
});

const mapDispatchToProps = {
  viewGalleryImages,
  viewGalleryImage,
  postGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  clearGalleryImages
};

class Gallery extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: [],
      search: "",
      show: false,
      editing: false,
      title: "",
      description: "",
      image: null,
      image_id: null,
      photoIndex: 0,
      isOpen: false
    };
  }

  static propTypes = {};

  static defaultProps = {
    selectOptions: newsSelectOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { viewGalleryImages, match } = this.props;
    const { id } = match.params;
    viewGalleryImages(id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { id } = props.match.params;
    const { User, Galleries } = props;
    const GalleryTitleIndex = Galleries.results.findIndex(
      gallery => gallery.id == id
    );
    const GalleryTitle =
      Galleries.results && Galleries.results.length > 0
        ? Galleries.results[GalleryTitleIndex].title
        : null;
    const { Gallery } = Galleries;
    this.getGalleryImage(Gallery);
    this.setState({ User, id, GalleryTitle, Gallery });
  };

  componentWillUnmount() {
    const { clearGalleryImages } = this.props;
    clearGalleryImages();
  }

  getGalleryImage = Gallery => {
    const { loading, results } = Gallery;
    const emptyGalleryImage = results.findIndex(
      gallery => !gallery.hasOwnProperty("image")
    );
    if (emptyGalleryImage != -1 && !loading)
      return this.props.viewGalleryImage(results[emptyGalleryImage].id);
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
        selectValue = this.props.selectOptions.filter(v => v.isFixed);
        break;
    }

    this.setState({ tags: selectValue });
  };

  onSelectFilterChange = (selectValue, { action, removedValue }) => {
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

    this.setState({ selectValue });
  };

  onChange = (filter, Galleries) => {
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
      reader.onloadend = () => this.setState({ image: reader.result });
    }
  };

  createGalleryImage = e => {
    e.preventDefault();
    const { User } = this.props;
    const { id } = this.state;
    const { image, title, description } = this.state;
    let { tags } = this.state;
    tags = tags.map(i => i.value).join("|");
    const payload = {
      gallery_id: id,
      author: User.id,
      tags,
      image,
      title,
      description,
      last_modified_by: User.id
    };
    this.props.postGalleryImage(User.token, payload);
    this.setState({ show: false });
  };

  updateGalleryImage = e => {
    e.preventDefault();
    const { User, title, description, image, image_id } = this.state;
    let { tags } = this.state;
    tags = tags.map(i => i.value).join("|");
    const payload = {
      title,
      description,
      image,
      slug: "gallery",
      author: User.id,
      tags,
      last_modified_by: User.id
    };
    this.props.updateGalleryImage(image_id, User.token, payload);
    this.setState({ show: false, editing: false });
  };

  renderGalleryImages = (images, filter, dontFilter) => {
    const { User } = this.state;
    const canDelete = User.is_superuser || User.can_create_galleries;
    const canUpdate = User.is_superuser || User.can_create_galleries;
    return images
      .filter(img => (dontFilter ? img : isSubset(img.tags.split("|"), filter)))
      .map((image, index) => (
        <Col md={4} xs={12} className="galleryCardContainer">
          <div
            key={image.id}
            className="Clickable galleryCard Hover"
            onClick={() => this.setState({ isOpen: true, photoIndex: index })}
          >
            {image.image ? (
              <Image src={image.image} />
            ) : (
              <div style={{ position: "absolute", top: "25%", right: "50%" }}>
                <i className="fa fa-spinner fa-spin" />
              </div>
            )}
            <div className="gallerySummary">
              <h4>
                <i className="fas fa-heading" /> {image.title}
              </h4>
              <p>
                <i className="fas fa-clipboard" /> {image.description}
              </p>
              <div className="cardActions">
                <ConfirmAction
                  Action={e => {
                    e.stopPropagation();
                    this.props.deleteGalleryImage(image.id, User.token);
                  }}
                  Disabled={false}
                  Icon={<i className="fa fa-trash-alt" />}
                  hasPermission={canDelete}
                  Size="small"
                  Class="pull-right"
                  Title={image.title}
                />
                {canUpdate ? (
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      this.setState({
                        show: true,
                        editing: true,
                        image_id: image.id,
                        title: image.title,
                        description: image.description,
                        tags: image.tags
                          .split("|")
                          .map(i => (i = { value: i, label: i })),
                        image: image.image
                      });
                    }}
                    bsSize="small"
                    className="pull-right"
                  >
                    <i className="fa fa-pencil-alt" />
                  </Button>
                ) : null}
              </div>
              <div className="cardInfo">
                <div
                  className="inlineNoWrap"
                  style={{
                    width: "calc(100% - 64px)%"
                  }}
                >
                  <i className="fas fa-user" />
                  <Link
                    to={`/profile/${image.author}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {image.author_username}
                  </Link>{" "}
                  <i className="far fa-clock" />
                  <Moment fromNow>{image.date_created}</Moment>
                </div>
                <div className="inlineNoWrap">
                  <i className="fas fa-pencil-alt" />
                  <Link
                    to={`/profile/${image.last_modified_by}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {image.last_modified_by_username}
                  </Link>{" "}
                  <i className="far fa-clock" />
                  <Moment fromNow>{image.last_modified}</Moment>
                </div>
                <div>
                  <i className="fas fa-tags" /> [{image.tags}]
                </div>
              </div>
            </div>
          </div>
        </Col>
      ));
  };

  render() {
    const {
      GalleryTitle,
      Gallery,
      title,
      description,
      image,
      search,
      editing,
      photoIndex,
      isOpen,
      User
    } = this.state;
    const canDelete = User.is_superuser || User.can_create_galleries;
    const canUpdate = User.is_superuser || User.can_create_galleries;
    let images = Gallery ? Gallery.results : [];
    images = search
      ? matchSorter(images, search, {
          keys: ["title", "author_username", "description"]
        })
      : images;
    const selectValue =
      this.state.selectValue.length > 0
        ? this.state.selectValue
        : this.props.selectOptions;
    const filter = selectValue.map(i => i.value);
    const maxlength = this.props.selectOptions.length;
    const dontFilter = filter.length == maxlength || filter.length == 0;
    return (
      <Grid className="Gallery Container">
        <Row>
          <PageHeader className="pageHeader">Gallery</PageHeader>
        </Row>
        <Row className="Center">
          <Col xs={12}>
            <h1>{GalleryTitle}</h1>
          </Col>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            md={3}
            xs={12}
            className="ActionToolbar"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(User.is_superuser || User.can_create_galleries)}
              onClick={() => this.setState({ show: true })}
            >
              <i className="fas fa-plus" /> Image
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
                onChange={filter => this.onChange(filter, Gallery)}
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
                onChange={this.onSelectFilterChange}
                options={this.props.selectOptions}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>{this.renderGalleryImages(images, filter, dontFilter)}</Row>
        <Row>
          {isOpen && (
            <Lightbox
              toolbarButtons={[
                canUpdate ? (
                  <Button
                    className="LightboxButton"
                    onClick={e => {
                      e.stopPropagation();
                      this.setState({
                        show: true,
                        editing: true,
                        image_id: images[photoIndex].id,
                        title: images[photoIndex].title,
                        description: images[photoIndex].description,
                        tags: images[photoIndex].tags
                          .split("|")
                          .map(i => (i = { value: i, label: i })),
                        image: images[photoIndex].image
                      });
                    }}
                  >
                    <i className="fa fa-pencil-alt" />
                  </Button>
                ) : null,
                <ConfirmAction
                  Action={e => {
                    e.stopPropagation();
                    this.props.deleteGalleryImage(
                      images[photoIndex].id,
                      User.token
                    );
                    this.setState({
                      isOpen: false,
                      images: images.filter(
                        img => img.id != images[photoIndex].id
                      )
                    });
                  }}
                  Disabled={false}
                  Icon={<i className="fa fa-trash-alt" />}
                  hasPermission={canDelete}
                  Size=""
                  Class="LightboxButton"
                  Title={images[photoIndex].title}
                />
              ]}
              imageTitle={images[photoIndex].title}
              imageCaption={images[photoIndex].description}
              mainSrc={images[photoIndex].image}
              mainSrcThumbnail={images[photoIndex].image}
              nextSrc={images[(photoIndex + 1) % images.length].image}
              nextSrcThumbnail={images[(photoIndex + 1) % images.length].image}
              prevSrc={
                images[(photoIndex + images.length - 1) % images.length].image
              }
              prevSrcThumbnail={
                images[(photoIndex + images.length - 1) % images.length].image
              }
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + images.length - 1) % images.length
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % images.length
                })
              }
              nextLabel={<i className="fas fa-caret-right fa-2x">NEXT</i>}
              // prevLabel={}
              // zoomInLabel={}
              // zoomOutLabel={}
              // closeLabel={}
            />
          )}
        </Row>
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
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
                      <Select
                        //https://react-select.com/props
                        value={this.state.tags}
                        isMulti
                        styles={selectStyles}
                        onBlur={e => e.preventDefault()}
                        blurInputOnSelect={false}
                        //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                        isSearchable={false}
                        name="colors"
                        placeholder="Tags..."
                        classNamePrefix="select"
                        onChange={this.onSelectTagChange}
                        options={this.props.selectOptions}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="Center">
                  <Col md={12}>
                    <Image
                      src={image}
                      className="ProfileImages"
                      responsive
                      rounded
                    />
                    <ControlLabel>Gallery Picture</ControlLabel>
                    <FormControl
                      style={{ margin: "auto" }}
                      type="file"
                      label="File"
                      name="image"
                      onChange={this.setImage}
                    />
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {editing ? (
                <Button onClick={this.updateGalleryImage}>Update</Button>
              ) : (
                <Button onClick={this.createGalleryImage}>Create</Button>
              )}
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  withAlert(reduxConnect(mapStateToProps, mapDispatchToProps)(Gallery))
);
