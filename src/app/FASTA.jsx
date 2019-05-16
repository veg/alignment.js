import React, { Component } from "react";
import { text } from "d3-fetch";
import { saveAs } from "file-saver";
import { saveSvgAsPng as savePNG } from "save-svg-as-png";

import fastaParser, { fastaToText } from "../helpers/fasta";
import Alignment from "../Alignment.jsx";
import Button from "../components/Button.jsx";
import FileUploadButton from "./FileUploadButton.jsx";
import Modal from "./Modal.jsx";
import SVGAlignment from "../SVGAlignment.jsx";
import { nucleotide_color, nucleotide_difference } from "../helpers/colors";
import AminoAcid from "./FASTA/amino_acid.jsx";
import Highlight from "./FASTA/highlight.jsx";
import SVGAlignmentExample from "./FASTA/svg_example.jsx";
import StartAtSiteAndSequence from "./FASTA/start_at_site_and_sequence.jsx";
import Lowercase from "./FASTA/lowercase.jsx";

class FASTAViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      site_size: 20,
      show_differences: "",
      saving: false
    };
  }
  componentDidMount() {
    text("data/CD2.fasta").then(data => this.loadFASTA(data));
  }
  loadFASTA(fasta) {
    this.setState({
      data: fastaParser(fasta),
      show_differences: ""
    });
  }
  saveFASTA() {
    const blob = new Blob([fastaToText(this.state.data)], {
      type: "text/plain:charset=utf-8;"
    });
    saveAs(blob, "sequences.fasta");
  }
  siteColor() {
    if (!this.state.show_differences) return nucleotide_color;
    const desired_record = this.state.data.filter(
      datum => datum.header == this.state.show_differences
    )[0];
    return nucleotide_difference(desired_record);
  }
  molecule() {
    if (!this.state.show_differences) return molecule => molecule;
    const data = this.state.saving
        ? this.state.trimmed_sequence_data
        : this.state.data,
      desired_record = data.filter(
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
        this.loadFASTA(e.target.result);
      };
      reader.readAsText(file);
    }
    document.body.click();
  };
  scrollExcavator = () => {
    return this.scrollExcavator.broadcaster.location();
  };
  trimData = (start_site, end_site) => {
    return this.state.data.map(record => {
      const new_record = {
        header: record.header,
        seq: record.seq.slice(start_site, end_site)
      };
      return new_record;
    });
  };
  saveAsPNG = () => {
    const saving = true;
    const { x_pixel, x_pad, x_fraction, y_fraction } = this.scrollExcavator(),
      start_site = Math.floor(x_pixel / this.state.site_size),
      end_site = Math.ceil((x_pixel + x_pad) / this.state.site_size),
      axis_bounds = [start_site, end_site],
      trimmed_sequence_data = this.trimData(start_site, end_site);
    trimmed_sequence_data.number_of_sequences = trimmed_sequence_data.length;
    trimmed_sequence_data.number_of_sites = trimmed_sequence_data[0].seq.length;
    this.setState({ saving, trimmed_sequence_data, axis_bounds }, () => {
      savePNG(document.getElementById("alignment-js-svg"), "alignment.png");
      this.setState({ saving: false }, () => {
        this.scrollExcavator.broadcaster.broadcast(
          x_fraction,
          y_fraction,
          "main"
        );
      });
    });
  };
  render() {
    const toolbar_style = {
      display: "flex",
      justifyContent: "space-between",
      width: 960
    };
    const options = this.state.data
      ? this.state.data.map(datum => {
          return (
            <option key={datum.header} value={datum.header}>
              {datum.header}
            </option>
          );
        })
      : null;
    return (
      <div>
        <h1>FASTA Viewer Application</h1>
        <div style={toolbar_style}>
          <FileUploadButton label="Import" onChange={this.handleFileChange} />
          <Button label="Export" onClick={() => $("#modal").modal("show")} />
          <Button label="Save as PNG" onClick={this.saveAsPNG} />
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
        {this.state.saving ? (
          <SVGAlignment
            sequence_data={this.state.trimmed_sequence_data}
            molecule={this.molecule()}
            site_color={this.siteColor()}
            site_size={this.state.site_size}
            axis_bounds={this.state.axis_bounds}
          />
        ) : (
          <Alignment
            fasta={this.state.data}
            site_size={this.state.site_size}
            molecule={this.molecule()}
            site_color={this.siteColor()}
            excavator={this.scrollExcavator}
          />
        )}
        <Modal title="Export fasta">
          <Button label="Download" onClick={() => this.saveFASTA()} />
          <div style={{ overflowY: "scroll", width: 400, height: 400 }}>
            <p>{this.state.data ? fastaToText(this.state.data) : null}</p>
          </div>
        </Modal>
      </div>
    );
  }
}

module.exports.FASTAViewer = FASTAViewer;
module.exports.AminoAcid = AminoAcid;
module.exports.Highlight = Highlight;
module.exports.StartAtSiteAndSequence = StartAtSiteAndSequence;
module.exports.Lowercase = Lowercase;
module.exports.SVGAlignmentExample = SVGAlignmentExample;
