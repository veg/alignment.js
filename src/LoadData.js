import React, { Component } from "react";
import "bootstrap";

function LoadData(props) {
  return (
    <div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sequences
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a
                className="dropdown-item"
                onClick={() => props.handleTextInput()}
              >
                Input Text
              </a>
              <a className="dropdown-item" href="#">
                <input
                  type="file"
                  onChange={event => props.handleFileChange(event)}
                />
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" onClick={() => props.handleExport()}>
                Export
              </a>
            </div>
          </li>
        </ul>

        <div
          className="modal fade"
          id="myModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {props.modal == "input"
                    ? "Paste sequence data"
                    : "Export sequence data"}
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {props.modal == "input" ? (
                  <textarea
                    type="text"
                    id="input_textarea"
                    type="text"
                    cols={45}
                    rows={25}
                    style={{ fontFamily: "Courier" }}
                  />
                ) : (
                  <div style={{ overflow: "auto" }}>{props.fasta}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn.btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                {props.modal == "input" ? (
                  <button onClick={() => props.handleTextUpdate()}>
                    Save changes
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

module.exports = LoadData;
