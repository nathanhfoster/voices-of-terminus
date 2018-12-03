import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";

import "./styles.css";
import "./stylesM.css";

export const ExperienceBar = experience_points => (
  <div className="ExperienceBar Container">
    <div className="experienceText">
      {" "}
      <span> {experience_points} </span> / 10000 EXP{" "}
    </div>{" "}
  </div>
);
