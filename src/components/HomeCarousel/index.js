import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, Carousel, Image, Button } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { carouselImages } from "../../helpers/backgrounds";
import Lightbox from "react-image-lightbox";
import ConfirmAction from "../../components/ConfirmAction";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class HomeCarousel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { photoIndex: 0, isOpen: false };
  }

  static propTypes = {};

  static defaultProps = {
    images: carouselImages
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, images } = props;
    this.setState({ User, images });
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  renderImages = Images =>
    Images.map((img, i) => (
      <Carousel.Item
        animateIn={true}
        animateOut={true}
        onClick={() => this.setState({ photoIndex: i, isOpen: true })}
      >
        <img className="CarouselImage Center" src={img.image} />
        <Carousel.Caption>
          <h3> {img.title} </h3> <p> {img.description} </p>
        </Carousel.Caption>
      </Carousel.Item>
    ));

  render() {
    const { deleteGalleryImage } = this.props;
    const {
      images,
      GalleryTitle,
      Gallery,
      title,
      description,
      image,
      search,
      editing,
      photoIndex,
      isOpen,
      User,
      show
    } = this.state;
    const canDelete = User.is_superuser;
    const canUpdate = User.is_superuser;
    return [
      <Carousel className="HomeCarousel Container" interval={10000}>
        {this.renderImages(images)}
      </Carousel>,
      isOpen && (
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
              Action={() => {
                deleteGalleryImage(images[photoIndex].id, User.token);
                this.setState({
                  isOpen: false,
                  images: images.filter(img => img.id != images[photoIndex].id)
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
      )
    ];
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HomeCarousel);
