import React, { Component } from "react";
import { BamFile } from "@gmod/bam";

import Alignment from "../Alignment.jsx";
import ScaffoldViewer from "../components/ScaffoldViewer.jsx";
import { DataFetcher } from "./Components.jsx";
import BAMReader from "../helpers/bam.js";
import { nucleotide_color, nucleotide_difference } from "../helpers/colors";

function VariantCaller(props) {
  return <h1>Variant calling example will go here.</h1>;
}

function ScaffoldExample() {
  return (
    <div>
      <h1>Scaffold viewer</h1>
      <ul>
        <li>The reference sequence stays fixed to the top.</li>
        <li>
          Click the scaffold to navigate to that portion of the alignment.
        </li>
      </ul>
      <DataFetcher child_prop="fasta" source="data/scaffold.fasta">
        <ScaffoldViewer />
      </DataFetcher>
    </div>
  );
}

class BAMViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window_start: 0,
      window_width: 200,
      site_size: 15,
      fasta: [],
      label: null,
      molecule: mol => mol,
      site_color: nucleotide_color
    };
  }
  componentDidMount() {
    const bam_file = new BamFile({
      bamUrl: this.props.data_url,
      baiUrl: this.props.data_url + ".bai"
    });
    this.bam = new BAMReader(bam_file);
    const { window_start, window_width } = this.state;
    this.loadBamWindow(window_start, window_width);
  }
  loadBamWindow(window_start, window_width) {
    const window_end = window_start + window_width;
    this.bam
      .fasta_window(window_start, window_end)
      .then(fasta => this.setState({ fasta, window_start, window_width }));
  }
  handleStartChange(e) {
    const window_start = +e.target.value,
      { window_width } = this.state;
    this.loadBamWindow(window_start, window_width);
  }
  handleWidthChange(e) {
    const { window_start } = this.state,
      window_width = +e.target.value;
    this.loadBamWindow(window_start, window_width);
  }
  scrollExcavator = () => {
    return this.scrollExcavator.broadcaster.location();
  };
  onSequenceClick = (label, i) => {
    return () => {
      const { x_fraction, y_fraction } = this.scrollExcavator(),
        scroll_corrector = () => {
          this.scrollExcavator.broadcaster.broadcast(
            x_fraction,
            y_fraction,
            "main"
          );
        };
      if (label == this.state.label) {
        this.setState(
          {
            label: null,
            molecule: mol => mol,
            site_color: nucleotide_color
          },
          scroll_corrector
        );
      } else {
        const desired_record = this.state.fasta.filter(
            datum => datum.header == label
          )[0],
          molecule = (mol, site, header) => {
            if (mol == "-") return "-";
            if (header == desired_record.header) return mol;
            return mol == desired_record.seq[site - 1] ? "." : mol;
          };

        this.setState(
          {
            label: label,
            molecule: molecule,
            site_color: nucleotide_difference(desired_record)
          },
          scroll_corrector
        );
      }
    };
  };
  render() {
    const width = 1140,
      toolbar_style = {
        display: "flex",
        justifyContent: "space-around",
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
              step={25}
              onChange={e => this.handleStartChange(e)}
            />
          </span>
          <span>
            <label>Window width:</label>
            <input
              type="number"
              value={this.state.window_width}
              min={100}
              max={1000}
              step={10}
              onChange={e => this.handleWidthChange(e)}
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
          <span>Number of reads in window: {this.state.fasta.length}</span>
        </div>
        <Alignment
          width={width}
          height={1000}
          site_size={this.state.site_size}
          fasta={this.state.fasta}
          start_site={this.state.window_start}
          molecule={this.state.molecule}
          site_color={this.state.site_color}
          onSequenceClick={this.onSequenceClick}
          excavator={this.scrollExcavator}
        />
      </div>
    );
  }
}

BAMViewer.defaultProps = {
  data_url: "data/sorted.bam"
};

export default BAMViewer;
export { BAMViewer, VariantCaller, ScaffoldExample };
