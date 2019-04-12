import React from "react";
import { Row, Col, Image, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "react-moment";

const PodcastCard = podcast => {
  const {
    videoId,
    playlistItemId,
    publishedAt,
    channelId,
    title,
    description,
    thumbnails
  } = podcast;

  const route = `podcasts/${videoId}/youtube`;

  return (
    <LinkContainer to={route}>
      <NavItem eventKey={playlistItemId}>
        <Row className="youTubeContainer">
          <Col md={3} className="videoImageContainer Center">
            <Image src={thumbnails.high} />
          </Col>
          <Col md={9} className="videoTitleContainer">
            <h3>{title}</h3>
            <i className="far fa-clock" />{" "}
            <Moment fromNow>{publishedAt}</Moment>
            <p>{description}</p>
          </Col>
        </Row>
      </NavItem>
    </LinkContainer>
  );
};

export default PodcastCard;
