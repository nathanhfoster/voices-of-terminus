import React from "react";
import { Row, Col, Image, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "react-moment";
import BrandImage from "../../../../images/brand.png";

const StreamCard = stream => {
  const {
    _id,
    title,
    description,
    description_html,
    broadcast_id,
    broadcast_type,
    status,
    language,
    tag_list,
    views,
    created_at,
    published_at,
    url,
    recorded_at,
    game,
    length,
    preview,
    animated_preview_url,
    thumbnails,
    fps,
    resolutions,
    channel,
    _links
  } = stream;
  const route = `videos/${_id.split("v")[1]}/twitch`;

  return (
    <LinkContainer to={route}>
      <NavItem eventKey={_id}>
        <Row className="youTubeContainer">
          <Col md={3} className="videoImageContainer Center">
            <Image
              src={thumbnails.length > 0 ? thumbnails[0].url : BrandImage}
            />
          </Col>
          <Col md={9} className="videoTitleContainer">
            <h3>{title}</h3>
            <p>{description}</p>
          </Col>
          <Col md={3} xs={6}>
            <i className="far fa-clock" /> <Moment fromNow>{created_at}</Moment>
          </Col>
          <Col md={3} xs={6}>
            <i className="far fa-eye"> {views}</i>
          </Col>
          <Col md={3} xs={6}>
            {broadcast_type === "archive"
              ? [<span>Type: </span>, <i className="fas fa-archive" />]
              : [<span>Type: </span>, <i className="fas fa-headset" />]}
          </Col>
          <Col md={3} xs={6}>
            {status === "recorded"
              ? [<span>Status: </span>, <i className="fas fa-microphone-alt" />]
              : [
                  <span>Status: </span>,
                  <i className="fas fa-microphone-alt-slash" />
                ]}
          </Col>
        </Row>
      </NavItem>
    </LinkContainer>
  );
};
export default StreamCard;
