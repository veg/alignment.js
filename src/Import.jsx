import React, { Component } from "react";
const $ = require("jquery");

import Modal from "./Modal.jsx";

class Import extends Component {
  constructor(props) {
    super(props);
  }

  showImportModal() {
    $("#importModal").modal("show");
  }

  render() {
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
                Import
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdown"
              >
                <a
                  className="dropdown-item"
                  onClick={() => this.showImportModal()}
                >
                  Input Text
                </a>
                <a className="dropdown-item" href="#">
                  <input
                    type="file"
                    onChange={event => this.props.handleFileChange(event)}
                  />
                </a>
              </div>
            </li>
          </ul>

          <Modal
            id="importModal"
            title="Paste sequence data"
            body={
              <textarea
                type="text"
                id="input_textarea"
                type="text"
                cols={45}
                rows={25}
                style={{ fontFamily: "Courier" }}
              />
            }
            bottomButton={
              <button onClick={() => this.props.handleTextUpdate()}>
                Save changes
              </button>
            }
          />
        </div>
      </div>
    );
  }
}

module.exports = Import;
