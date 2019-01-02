import React from "react";

export const _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

const BaseIcon = _ref => {
  const color = _ref.color,
    _ref$pushRight = _ref.pushRight,
    pushRight = _ref$pushRight === undefined ? true : _ref$pushRight,
    children = _ref.children;
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { marginRight: pushRight ? "20px" : "0", minWidth: 24 }
    },
    children
  );
};

export const InfoIcon = () =>
  React.createElement(
    BaseIcon,
    { color: "#2E9AFE" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "8" })
  );

export const SuccessIcon = () =>
  React.createElement(
    BaseIcon,
    { color: "#31B404" },
    React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })
  );

export const ErrorIcon = () =>
  React.createElement(
    BaseIcon,
    { color: "#FF0040" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "16" })
  );

export const CloseIcon = () =>
  React.createElement(
    BaseIcon,
    { color: "#FFFFFF", pushRight: false },
    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  );

export const alertStyle = {
  backgroundColor: "var(--secondaryColor)",
  color: "white",
  padding: "10px",
  textTransform: "uppercase",
  border: "1px solid var(--primaryColor)",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  fontFamily: "Arial",
  width: "350px",
  boxSizing: "border-box"
};

export const buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#FFFFFF"
};
