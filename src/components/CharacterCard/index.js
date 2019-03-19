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
    name && (
      <Row className="CharacterCard">
        <Col xs={8}>
          <div className="CharacterName">{name}</div>
        </Col>
        {character_class && (
          <Col xs={4}>
            <div className="CharacterClassImage pull-right">
              <Image src={roleClassIcon(character_class || role)} />
              <b>{` (${level})`}</b>
            </div>
          </Col>
        )}
        {race && (
          <Col xs={12}>
            {role && character_class ? (
              <em>{`${race}: ${role} - ${character_class}`}</em>
            ) : (
              <em>{`${race}: ${role}`}</em>
            )}
          </Col>
        )}
        {profession && (
          <Col xs={12}>
            {profession_specialization ? (
              <span>{`${profession} - ${profession_specialization}`}</span>
            ) : (
              <span>{profession}</span>
            )}
          </Col>
        )}
      </Row>
    )
  );
};
