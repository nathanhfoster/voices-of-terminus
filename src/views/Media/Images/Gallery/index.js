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
import CreatableSelect from "react-select/lib/Creatable";
import { galleryImageTags } from "../../../../helpers/select";
import { selectStyles } from "../../../../helpers/styles";
import { connect as reduxConnect } from "react-redux";
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
import deepEqual from "deep-equal";
import "./styles.css";
import "./stylesM.css";
import ConfirmAction from "../../../../components/ConfirmAction";
import Lightbox from "react-image-lightbox";
import { withAlert } from "react-alert";
import PopOver from "../../../../components/PopOver";
import { UserHasPermissions } from "../../../../helpers/userPermissions";

const mapStateToProps = ({
  AuthenticationAndAuthorization,
  User,
  Galleries
}) => ({
  AuthenticationAndAuthorization,
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
      isOpen: false,
      cardHovered: null
    };
  }

  static propTypes = {};

  static defaultProps = {};

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
    const { AuthenticationAndAuthorization, User, Galleries } = props;
    const GalleryTitleIndex = Galleries.results.findIndex(
      gallery => gallery.id == id
    );
    const GalleryTitle =
      Galleries.results && Galleries.results.length > 0
        ? Galleries.results[GalleryTitleIndex].title
        : null;
    const { Gallery } = Galleries;
    const currentTags = Gallery.results
      .map(e => e.tags.split("|").map(i => (i = { value: i, label: i })))
      .flat(1);
    this.getGalleryImage(Gallery);
    this.setState({
      AuthenticationAndAuthorization,
      User,
      id,
      GalleryTitle,
      Gallery,
      currentTags
    });
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
        selectValue = galleryImageTags.filter(v => v.isFixed);
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
        selectValue = galleryImageTags.filter(v => v.isFixed);
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
    const { updateGalleryImage } = this.props;
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
    updateGalleryImage(image_id, User.token, payload);
    this.setState({ show: false, editing: false });
  };

  renderGalleryImages = (images, filter, dontFilter) => {
    const { AuthenticationAndAuthorization, User } = this.state;
    const canDelete = UserHasPermissions(
      AuthenticationAndAuthorization,
      User,
      "delete_galleryimages"
    );
    const canUpdate = UserHasPermissions(
      AuthenticationAndAuthorization,
      User,
      "change_galleryimages"
    );
    return images
      .filter(img =>
        dontFilter ? img : deepEqual(img.tags.split("|"), filter)
      )
      .map((image, index) => {
        return (
          <Col md={3} xs={12} className="galleryCardContainer">
            <div
              key={image.id}
              className="Clickable galleryCard Hover"
              onClick={() => this.setState({ isOpen: true, photoIndex: index })}
              onMouseEnter={() => this.setState({ cardHovered: image.id })}
              onMouseLeave={() => this.setState({ cardHovered: null })}
            >
              <div className="cardActions">
                <PopOver User={User}>
                  <ConfirmAction
                    Action={e =>
                      this.props.deleteGalleryImage(image.id, User.token)
                    }
                    Disabled={false}
                    Icon={<i className="fas fa-trash" />}
                    hasPermission={canDelete}
                    Size=""
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
                      bsSize=""
                      className="pull-right"
                    >
                      <i className="fa fa-pencil-alt" />
                    </Button>
                  ) : null}
                </PopOver>
              </div>
              {image.image ? (
                <Image src={image.image} />
              ) : (
                <div style={{ position: "absolute", top: "25%", right: "50%" }}>
                  <i className="fa fa-spinner fa-spin" />
                </div>
              )}
              <div className="gallerySummary">
                <h4>{image.title}</h4>
                <span>{image.description}</span>
                <div className="cardInfo">
                  <div
                    className="inlineNoWrap"
                    style={{
                      width: "calc(100% - 64px)%"
                    }}
                  >
                    <Link
                      to={`/profile/${image.author}`}
                      onClick={e => e.stopPropagation()}
                    >
                      {image.author_username}
                    </Link>{" "}
                    <i className="far fa-clock" />
                    <Moment fromNow>{image.date_created}</Moment>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        );
      });
  };

  render() {
    const {
      AuthenticationAndAuthorization,
      User,
      GalleryTitle,
      Gallery,
      title,
      description,
      image,
      search,
      editing,
      photoIndex,
      isOpen,
      show,
      tags,
      currentTags
    } = this.state;
    const canDelete = UserHasPermissions(
      AuthenticationAndAuthorization,
      User,
      "add_gallery"
    );
    const canUpdate = UserHasPermissions(
      AuthenticationAndAuthorization,
      User,
      "change_gallery"
    );
    let images = Gallery ? Gallery.results : [];
    images = search
      ? matchSorter(images, search, {
          keys: ["title", "author_username", "description"]
        })
      : images;
    const selectValue =
      this.state.selectValue.length > 0
        ? this.state.selectValue
        : galleryImageTags;
    const filter = selectValue.map(i => i.value);
    const maxlength = galleryImageTags.length;
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
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(
              AuthenticationAndAuthorization,
              User,
              "add_galleryimages"
            ) && (
              <Button onClick={() => this.setState({ show: true })}>
                <i className="fas fa-plus" /> Image
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
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                isSearchable={false}
                placeholder="Filter by tags..."
                classNamePrefix="select"
                onChange={this.onSelectFilterChange}
                options={galleryImageTags}
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
                  Icon={<i className="fas fa-trash" />}
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
        {show ? (
          <Row>
            <Modal
              backdrop={false}
              {...this.props}
              show={show}
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
                        <CreatableSelect
                          //https://react-select.com/props
                          value={tags}
                          isMulti
                          styles={selectStyles()}
                          onBlur={e => e.preventDefault()}
                          blurInputOnSelect={false}
                          //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                          isSearchable
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
                  <Button onClick={this.updateGalleryImage}>UPDATE</Button>
                ) : (
                  <Button onClick={this.createGalleryImage}>
                    <i className="fas fa-cloud-upload-alt" /> Post
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
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Gallery)
);
