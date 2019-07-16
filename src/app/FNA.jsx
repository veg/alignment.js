import React, { Component } from "react";
import { text } from "d3-fetch";
import { saveAs } from "file-saver";

import TreeAlignment from "../TreeAlignment.jsx";
import { fnaParser, fnaToText } from "../helpers/fasta";
import { BaseSVGTreeInstance } from "./Components.jsx";
import Button from "../components/Button.jsx";
import FileUploadButton from "./FileUploadButton.jsx";
import Modal from "./Modal.jsx";
import { nucleotide_color, nucleotide_difference } from "../helpers/colors";

function Immunology(props) {
  return <h1>Immunology example will go here.</h1>;
}

function HIV(props) {
  return <h1>HIV example will go here.</h1>;
}

class FNAViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      site_size: 20,
      show_differences: ""
    };
  }
  componentDidMount() {
    text("data/CD2.fna").then(data => this.loadFNA(data));
  }
  loadFNA(text) {
    this.setState({
      data: fnaParser(text, true),
      show_differences: ""
    });
  }
  saveFNA() {
    const blob = new Blob([fnaToText(this.state.data)], {
      type: "text/plain:charset=utf-8;"
    });
    saveAs(blob, "sequences.fna");
  }
  siteColor() {
    if (!this.state.show_differences) return nucleotide_color;
    const desired_record = this.state.data.sequence_data.filter(
      datum => datum.header == this.state.show_differences
    )[0];
    return nucleotide_difference(desired_record);
  }
  molecule() {
    if (!this.state.show_differences) return molecule => molecule;
    const desired_record = this.state.data.sequence_data.filter(
      datum => datum.header == this.state.show_differences
    )[0];
    return (mol, site, header) => {
      if (mol == "-") return "-";
      if (header == desired_record.header) return mol;
      return mol == desired_record.seq[site - 1] ? "." : mol;
    };
  }
  handleFileChange = e => {
    const files = e.target.files;
    if (files.length == 1) {
      const file = files[0],
        reader = new FileReader();
      reader.onload = e => {
        this.loadFNA(e.target.result);
      };
      reader.readAsText(file);
    }
    document.body.click();
  };
  render() {
    const toolbar_style = {
      display: "flex",
      justifyContent: "space-between",
      width: 960
    };
    const options = this.state.data
      ? this.state.data.sequence_data.map(datum => {
          return (
            <option key={datum.header} value={datum.header}>
              {datum.header}
            </option>
          );
        })
      : null;
    return (
      <div>
        <h1>FNA Viewer Application</h1>
        <div style={toolbar_style}>
          <FileUploadButton label="Import" onChange={this.handleFileChange} />
          <Button label="Export" onClick={() => $("#modal").modal("show")} />
          <span>
            <label>Site size:</label>
            <input
              type="number"
              value={this.state.site_size}
              min={15}
              max={100}
              step={5}
              onChange={e => this.setState({ site_size: e.target.value })}
            />
          </span>
          <span>
            <label>Highlight difference from:</label>
            <select
              value={this.state.show_differences}
              onChange={e =>
                this.setState({ show_differences: e.target.value })
              }
            >
              <option value={""}>None</option>
              {options}
            </select>
          </span>
        </div>
        <TreeAlignment
          {...this.state.data}
          site_size={this.state.site_size}
          molecule={this.molecule()}
          site_color={this.siteColor()}
        />
        <Modal title="Export fasta">
          <Button label="Download" onClick={() => this.saveFNA()} />
          <div style={{ overflowY: "scroll", width: 400, height: 400 }}>
            <p>{this.state.data ? fnaToText(this.state.data) : null}</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export { FNAViewer, Immunology, HIV, BaseSVGTreeInstance };
