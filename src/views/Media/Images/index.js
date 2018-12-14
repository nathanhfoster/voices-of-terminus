import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
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
import "./stylesM.css";
import { newsSelectOptions } from "../../../helpers/select";
import { selectStyles } from "../../../helpers/styles";
import {
  getGalleries,
  postGallery,
  updateGallery,
  deleteGallery
} from "../../../actions/Media";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import matchSorter from "match-sorter";
import { isSubset } from "../../../helpers";

const mapStateToProps = ({ User, Galleries }) => ({
  User,
  Galleries
});

const mapDispatchToProps = {
  getGalleries,
  postGallery,
  updateGallery,
  deleteGallery
};

class Images extends PureComponent {
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
      gallery_id: null,
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
    this.props.getGalleries();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Galleries } = props;
    this.setState({ User, Galleries });
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
      reader.onloadend = () => this.setState({ gallery_image: reader.result });
    }
  };

  createGallery = e => {
    e.preventDefault();
    const { User, title, description, gallery_image } = this.state;
    let { tags } = this.state;
    tags = tags.map(i => i.value).join("|");
    const payload = {
      title,
      description,
      image: gallery_image,
      slug: "gallery",
      author: User.id,
      tags,
      last_modified_by: User.id
    };
    this.props.postGallery(User.token, payload);
    this.setState({ show: false });
  };

  updateGallery = e => {
    e.preventDefault();
    const { User, title, description, gallery_image, gallery_id } = this.state;
    let { tags } = this.state;
    tags = tags.map(i => i.value).join("|");
    const payload = {
      title,
      description,
      image: gallery_image,
      slug: "gallery",
      author: User.id,
      tags,
      last_modified_by: User.id
    };
    this.props.updateGallery(gallery_id, User.token, payload);
    this.setState({ show: false, editing: false });
  };

  renderGalleries = (galleries, filter, dontFilter) => {
    const { User } = this.state;
    const canDelete = User.is_superuser || User.can_create_galleries;
    const canUpdate = User.is_superuser || User.can_create_galleries;
    return galleries
      .filter(gal => (dontFilter ? gal : isSubset(gal.tags.split("|"), filter)))
      .map(gallery => (
        <Col md={4} xs={12} className="galleryCardContainer">
          <div
            className="Clickable galleryCard Hover"
            onClick={() =>
              this.props.history.push(`/media/images/gallery/${gallery.id}`)
            }
          >
            <Image src={gallery.image} />
            <div className="gallerySummary">
              <h4>{gallery.title}</h4>
              <p>{gallery.description}</p>
              <div className="cardActions">
                {canDelete ? (
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      this.props.deleteGallery(gallery.id, User.token);
                    }}
                    bsSize="small"
                    className="pull-right"
                  >
                    <i className="fa fa-trash-alt" />
                  </Button>
                ) : null}
                {canUpdate ? (
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
                    to={"/profile/" + gallery.author}
                    onClick={e => e.stopPropagation()}
                  >
                    {gallery.author_username}
                  </Link>{" "}
                  <i className="far fa-clock" />
                  <Moment fromNow>{gallery.date_created}</Moment>
                </div>

                <div>
                  <i className="fas fa-tags" /> [{gallery.tags}]
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
      editing
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
        : this.props.selectOptions;
    const filter = selectValue.map(i => i.value);
    const maxlength = this.props.selectOptions.length;
    const dontFilter = filter.length == maxlength || filter.length == 0;
    return (
      <Grid className="Images Container">
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
              <i className="fas fa-plus" /> Gallery
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
                onChange={filter => this.onChange(filter, Galleries)}
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
        <Row>{this.renderGalleries(galleries, filter, dontFilter)}</Row>
        <Row>
          <Modal
            backdrop={false}
            {...this.props}
            show={this.state.show}
            onHide={() => this.setState({ show: false, editing: false })}
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
                <Button onClick={this.updateGallery}>Update</Button>
              ) : (
                <Button onClick={this.createGallery}>Create</Button>
              )}
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Images)
);
