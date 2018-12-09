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
import { viewGalleryImages, postGalleryImage } from "../../../../actions/Media";
import Moment from "react-moment";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User, Galleries }) => ({
  User,
  Galleries
});

const mapDispatchToProps = {
  viewGalleryImages,
  postGalleryImage
};

class Gallery extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: [],
      search: "",
      show: false,
      title: "",
      description: "",
      image: null
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
    const { id } = this.props.match.params;
    this.props.viewGalleryImages(id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { id } = props.match.params;
    const { Galleries } = props;
    const GalleryTitleIndex = Galleries.results.findIndex(
      gallery => gallery.id == id
    );
    const GalleryTitle = Galleries.results[GalleryTitleIndex].title;
    const { Gallery } = Galleries;
    this.setState({ id, GalleryTitle, Gallery });
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
      description
    };
    this.props.postGalleryImage(User.token, payload);
    this.setState({ show: false });
  };

  renderGalleryImages = images =>
    images.map(image => (
      <Col xs={6} className="galleryCardContainer">
        <div className="Clickable galleryCard Hover" onClick={null}>
          <Image src={image.image} />
          <div className="gallerySummary">
            <h4>{image.title}</h4>
            <p>{image.description}</p>
            <div className="cardInfo">
              <div
                className="inlineNoWrap"
                style={{
                  width: "calc(100% - 64px)%"
                }}
              >
                <i className="fas fa-user" />
                <Link
                  to={"/profile/" + image.author}
                  onClick={e => e.stopPropagation()}
                >
                  {image.author_username}
                </Link>{" "}
                <i className="far fa-clock" />
                <Moment fromNow>{image.date_created}</Moment>
              </div>
              <div>
                <i className="fas fa-tags" /> [{image.tags}]
              </div>
            </div>
          </div>
        </div>
      </Col>
    ));

  render() {
    const { User } = this.props;
    const {
      GalleryTitle,
      Gallery,
      title,
      description,
      image,
      search
    } = this.state;
    const images = Gallery ? Gallery.results : [];
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
        <Row>
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
                style={{ fontSize: "medium" }}
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
                className="FilterMultiSelect"
                classNamePrefix="select"
                onChange={this.onSelectFilterChange}
                options={this.props.selectOptions}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>{this.renderGalleryImages(images)}</Row>
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
              <Form className="Container fadeIn-2">
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
                        className="FilterMultiSelect"
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
              <Button onClick={this.createGalleryImage}>Create</Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Gallery)
);
