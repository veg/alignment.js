import React, { Component } from "react";
const d3 = require("phylotree/node_modules/d3");

import "phylotree/phylotree.css";
require("phylotree");

import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import BaseTree from "./BaseTree.jsx";
import fastaParser from "./../helpers/fasta";
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import computeLabelWidth from "../helpers/computeLabelWidth";
import sortFASTAAndNewick from "../helpers/jointSort";

class TreeAlignment extends Component {
  constructor(props) {
    super(props);
    this.column_sizes = [500, 200, 700];
    this.row_sizes = [20, 700];
    this.initialize(props);
  }
  componentWillUpdate(nextProps) {
    console.log("cwu");
    this.initialize(nextProps);
  }
  setScrollingEvents(props) {
    if (props.fasta && props.newick) {
      const width = this.column_sizes[2],
        height = this.row_sizes[1];
      const { full_pixel_width, full_pixel_height, label_width } = this;
      this.scroll_broadcaster = new ScrollBroadcaster({
        width: full_pixel_width,
        height: full_pixel_height,
        x_pad: width,
        y_pad: height,
        x_pixel: this.x_pixel || 0,
        y_pixel: this.y_pixel || 0,
        bidirectional: [
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div",
          "alignmentjs-tree-div"
        ]
      });
    }
  }
  initialize(props) {
    if (props.fasta && props.newick) {
      this.sequence_data = fastaParser(props.fasta);
      this.full_pixel_height = this.props.site_size * this.sequence_data.length;
      this.full_pixel_width =
        this.props.site_size * this.sequence_data[0].seq.length;
      const phylotree_size = [this.full_pixel_height, this.column_sizes[0]];
      const { phylotree, tree_json } = sortFASTAAndNewick(
        this.sequence_data,
        props.newick,
        phylotree_size
      );
      this.phylotree = phylotree;
      const number_of_sequences = this.sequence_data.length;

      this.label_width = computeLabelWidth(
        this.sequence_data,
        this.props.label_padding
      );

      this.column_sizes[2] += this.column_sizes[1] - this.label_width;
      this.column_sizes[1] = this.label_width;
      this.setScrollingEvents(props);
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
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <BaseTree
          phylotree={this.phylotree}
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <SequenceAxis
          width={this.column_sizes[1]}
          height={this.row_sizes[1]}
          sequence_data={this.sequence_data}
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <BaseAlignment
          width={this.column_sizes[2]}
          height={this.row_sizes[1]}
          sequence_data={this.sequence_data}
          scroll_broadcaster={this.scroll_broadcaster}
        />
      </div>
    );
  }
}

TreeAlignment.defaultProps = {
  label_padding: 10,
  site_size: 20,
  axis_height: 20
};

module.exports = TreeAlignment;
