import React, { Component } from "react";

function FileUploadButton(props) {
  const button_style = {
    position: "relative",
    overflow: "hidden"
  };
  const input_style = {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: "100%",
    minHeight: "100%",
    fontSize: "100px",
    textAlign: "right",
    filter: "alpha(opacity=0)",
    opacity: 0,
    outline: "none",
    background: "white",
    cursor: "inherit",
    display: "block"
  };
  return (
    <button type="button" className="btn btn-dark" style={button_style}>
      <input type="file" style={input_style} onChange={props.onChange} />
      {props.label}
    </button>
  );
}

export default FileUploadButton;
