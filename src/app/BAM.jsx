import React, { Component } from "react";
import { BamFile } from "@gmod/bam";

import Alignment from "../Alignment.jsx";
import BAMReader from "../helpers/bam.js";

function VariantCaller(props) {
  return <h1>Variant calling example will go here.</h1>;
}

class BAMViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window_start: 0,
      window_width: 200,
      site_size: 15,
      fasta: null
    };
  }
  componentDidMount() {
    const bam_file = new BamFile({
      bamUrl: "data/sorted.bam",
      baiUrl: "data/sorted.bam.bai"
    });
    this.bam = new BAMReader(bam_file);
    const { window_start, window_width } = this.state,
      window_end = window_start + window_width;
    this.bam
      .fasta_window(window_start, window_end)
      .then(fasta => this.setState({ fasta }));
  }
  render() {
    const width = 1400,
      toolbar_style = {
        display: "flex",
        justifyContent: "space-between",
        width: width
      };
    return (
      <div>
        <h1>BAM viewer</h1>
        <div style={toolbar_style}>
          <span>
            <label>Window start:</label>
            <input
              type="number"
              value={this.state.window_start}
              min={0}
              max={100}
              step={5}
              onChange={e => this.setState({ window_start: e.target.value })}
            />
          </span>
          <span>
            <label>Window width:</label>
            <input
              type="number"
              value={this.state.window_width}
              min={100}
              max={1000}
              step={5}
              onChange={e => this.setState({ window_width: e.target.value })}
            />
          </span>
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
        </div>
        <Alignment
          width={width}
          height={1000}
          site_size={this.state.site_size}
          fasta={this.state.fasta}
        />
      </div>
    );
  }
}

module.exports.BAMViewer = BAMViewer;
module.exports.VariantCaller = VariantCaller;
