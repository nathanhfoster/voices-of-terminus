import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { roleClassIcon } from "../../helpers";
import "./styles.css";

export const CharacterCard = chracter => {
  let {
    id,
    name,
    level,
    race,
    role,
    character_class,
    profession,
    profession_specialization,
    main,
    alt,
    date_created,
    last_modified
  } = chracter;
  return (
    <Row className="CharacterCard">
      <Col xs={3}>
        <Image src={roleClassIcon(character_class || role)} />
        <span>{` (${level})`}</span>
      </Col>
      <Col xs={3}>
        <span>{name}</span>
      </Col>
      <Col xs={3}>
        <span>{profession}</span>
      </Col>
      <Col xs={3}>
        <span>{profession_specialization}</span>
      </Col>
      <Col xs={4}>
        <span>{race}</span>
      </Col>
      <Col xs={4}>
        <span>{role}</span>
      </Col>
      <Col xs={4}>
        <span>{character_class}</span>
      </Col>
    </Row>
  );
};
