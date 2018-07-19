import React, { Component } from "react";
const d3 = require("phylotree/node_modules/d3");

require("phylotree");

import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import LargeTree from "./LargeTree.jsx";
import fastaParser from "./../helpers/fasta";
import computeLabelWidth from "../helpers/computeLabelWidth";

class LargeTreeAlignment extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
    this.initialize(props);
  }
  componentDidMount() {
    this.setScrollingEvents(this.props);
  }
  componentWillUpdate(nextProps) {
    this.initialize(nextProps);
    this.setScrollingEvents(nextProps);
  }
  setScrollingEvents(props) {}
  initialize(props) {
    const { fasta, newick } = props;
    if (fasta && newick) {
      this.sequence_data = fastaParser(fasta);
      const { sequence_data } = this;
      const { label_padding } = this.props;
      this.label_width = computeLabelWidth(sequence_data, label_padding);
      this.column_sizes = [500, this.label_width, 700 - this.label_width];
      this.row_sizes = [20, 500];

      this.parsed_newick = d3.layout.newick_parser(newick);
    }
  }
  render() {
    if (!this.props.fasta) {
      return <div />;
    }
    const template_css = {
      display: "grid",
      gridTemplateColumns: this.column_sizes.join("px ") + "px",
      gridTemplateRows: this.row_sizes.join("px ") + "px"
    };
    return (
      <div style={template_css}>
        <div />
        <div />
        <SiteAxis
          width={this.column_sizes[2]}
          height={this.row_sizes[0]}
          sequence_data={this.sequence_data}
        />
        <LargeTree width={this.column_sizes[0]} height={this.row_sizes[1]} />
        <SequenceAxis
          width={this.column_sizes[1]}
          height={this.row_sizes[1]}
          sequence_data={this.sequence_data}
        />
        <BaseAlignment
          width={this.column_sizes[2]}
          height={this.row_sizes[1]}
          sequence_data={this.sequence_data}
        />
      </div>
    );
  }
}

LargeTreeAlignment.defaultProps = {
  label_padding: 10
};

module.exports = LargeTreeAlignment;
