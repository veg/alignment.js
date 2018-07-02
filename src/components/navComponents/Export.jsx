import React, { Component } from "react";
const $ = require("jquery");

import Modal from "./Modal.jsx";

class Export extends Component {
  constructor(props) {
    super(props);
  }

  showExportModal() {
    $("#exportModal").modal("show");
  }

  render() {
    return (
      <div>
        <li>
          <a className="nav-link" onClick={() => this.showExportModal()}>
            Export
          </a>
        </li>
        <Modal
          id="exportModal"
          title="Export sequence data"
          body={<div style={{ overflow: "auto" }}>{this.props.fasta}</div>}
        />
      </div>
    );
  }
}

module.exports = Export;
