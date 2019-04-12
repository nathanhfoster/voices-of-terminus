import React from "react";
import { Row, Col, Image, NavItem } from "react-bootstrap";
import Moment from "react-moment";
import { LinkContainer } from "react-router-bootstrap";

const VideoCard = video => {
  const {
    videoId,
    channelId,
    channelTitle,
    description,
    kind,
    liveBroadcastContent,
    publishedAt,
    thumbnail,
    thumbnails,
    title
  } = video;
  const route = `videos/${videoId}/youtube`;
  return (
    <LinkContainer to={route}>
      <NavItem eventKey={videoId}>
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

export default VideoCard;
