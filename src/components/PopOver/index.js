import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import "./styles.css";

const PopOver = props => {
  const { User, children } = props;
  const { token } = User;

  const popover = (
    <Popover id="popover-basic" title={null}>
      {React.Children.map(children, child => (
        <div className="PopRow">{child}</div>
      ))}
    </Popover>
  );
  return token ? (
    <OverlayTrigger
      rootClose
      trigger={["click"]}
      placement="left"
      overlay={popover}
    >
      <div
        variant="success"
        className="ActionDots pull-right"
        onClick={e => e.stopPropagation()}
      >
        <i className="fas fa-ellipsis-v pull-left" variant="success" />
      </div>
    </OverlayTrigger>
  ) : null;
};
export default PopOver;
