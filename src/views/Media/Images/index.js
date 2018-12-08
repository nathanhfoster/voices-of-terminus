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
import { postGallery } from "../../../actions/Media";

const mapStateToProps = ({ User, Galleries }) => ({
  User,
  Galleries
});

const mapDispatchToProps = {
  postGallery
};

class Images extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectValue: [],
      search: "",
      show: false,
      title: "",
      description: "",
      gallery_image: null
    };
  }

  static propTypes = {};

  static defaultProps = {
    selectOptions: newsSelectOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }
  componentDidMount() {}

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
    const { User, title, description } = this.state;
    let { tags } = this.state;
    tags = tags.map(i => i.value).join("|");
    console.log(User.id);
    let payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("slug", "gallery");
    payload.append("author", User.id);
    payload.append("tags", tags);
    payload.append("last_modified_by", User.id);

    this.props.postGallery(User.token, payload);
  };

  render() {
    const { User, search, title, description, gallery_image } = this.state;
    let { Galleries } = this.state;
    const selectValue =
      this.state.selectValue.length > 0
        ? this.state.selectValue
        : this.props.selectOptions;
    return (
      <Grid className="Images Container">
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
                      name="profile_image"
                      onChange={this.setImage}
                    />
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.createGallery}>Create</Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Images);
