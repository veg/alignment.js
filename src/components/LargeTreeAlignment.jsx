import React, { Component } from "react";
const d3 = require("phylotree/node_modules/d3");

import "phylotree/phylotree.css";
require("phylotree");

import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import fastaParser from "./../helpers/fasta";
import computeLabelWidth from "../helpers/computeLabelWidth";

class LargeTreeAlignment extends Component {
  constructor(props) {
    super(props);
    this.column_sizes = [700, 200, 700];
    this.row_sizes = [20, 700];
  }
  componentWillUpdate(nextProps) {
    console.log("lta cwu");
    this.sequence_data = fastaParser(nextProps.fasta);
    const number_of_sequences = this.sequence_data.length;
    const tree_size = number_of_sequences * this.props.site_size;
    this.main_tree = d3.layout
      .phylotree()
      .options({
        "left-right-spacing": "fit-to-size",
        "top-bottom-spacing": "fit-to-size",
        "show-scale": false,
        "align-tips": true
      })
      .size([tree_size, tree_size]);
    this.main_tree(nextProps.newick);

    const label_width = computeLabelWidth(
      this.sequence_data,
      this.props.label_padding
    );

    this.column_sizes[2] += this.column_sizes[1] - label_width;
    this.column_sizes[1] = label_width;
    const ordered_leaf_names = this.main_tree
      .get_nodes()
      .filter(d3.layout.phylotree.is_leafnode)
      .map(d => d.name);
    this.sequence_data.sort((a, b) => {
      const a_index = ordered_leaf_names.indexOf(a.header),
        b_index = ordered_leaf_names.indexOf(b.header);
      return a_index - b_index;
    });
  }
  componentDidUpdate() {
    console.log("lta cdu");

    this.main_tree.svg(d3.select("#alignmentjs-largeTreeAlignment")).layout();
  }
  render() {
    console.log("lta render");
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
        <div style={{ overfloxX: "scroll", overflowY: "scroll" }}>
          <svg id="alignmentjs-largeTreeAlignment" />
        </div>
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
  label_padding: 10,
  site_size: 20
};

module.exports = LargeTreeAlignment;
