import React, { Component } from "react";
const d3 = require("phylotree/node_modules/d3");

import "phylotree/phylotree.css";
require("phylotree");

import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import fastaParser from "./../helpers/fasta";
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import computeLabelWidth from "../helpers/computeLabelWidth";

class LargeTreeAlignment extends Component {
  constructor(props) {
    super(props);
    this.column_sizes = [700, 200, 700];
    this.row_sizes = [20, 700];
  }
  componentWillUpdate(nextProps) {
    console.log("lta cwu");
    const { site_size } = this.props;
    this.sequence_data = fastaParser(nextProps.fasta);
    const number_of_sequences = this.sequence_data.length;
    const tree_size = number_of_sequences * site_size;
    this.main_tree = d3.layout
      .phylotree()
      .options({
        "left-right-spacing": "fit-to-size",
        "top-bottom-spacing": "fit-to-size",
        "show-scale": false,
        "align-tips": true,
        "show-labels": false
      })
      .size([tree_size, tree_size]);
    this.main_tree(nextProps.newick);

    const label_width = computeLabelWidth(
      this.sequence_data,
      this.props.label_padding
    );

    this.column_sizes[2] += this.column_sizes[1] - label_width;
    this.column_sizes[1] = label_width;

    var i = 0;
    this.main_tree.traverse_and_compute(function(n) {
      var d = 1;
      if (!n.name) {
        n.name = "Node" + i++;
      }
      if (n.children && n.children.length) {
        d += d3.max(n.children, function(d) {
          return d["count_depth"];
        });
      }
      n["count_depth"] = d;
    });

    this.main_tree.resort_children(function(a, b) {
      return a["count_depth"] - b["count_depth"];
    }, true);

    const ordered_leaf_names = this.main_tree
      .get_nodes(true)
      .filter(d3.layout.phylotree.is_leafnode)
      .map(d => d.name);

    this.sequence_data.sort((a, b) => {
      const a_index = ordered_leaf_names.indexOf(a.header),
        b_index = ordered_leaf_names.indexOf(b.header);
      return a_index - b_index;
    });

    /*
    const height = this.row_sizes[1],
      width = this.column_sizes[2],
      full_pixel_width = site_size*this.sequence_data.number_of_sites,
      full_pixel_height = site_size*this.sequence_data.number_of_sequences;

    this.scroll_broadcaster = new ScrollBroadcaster(
      { width: full_pixel_width, height: full_pixel_height },
      { width: width, height: height },
      { x_pixel: 0, y_pixel: 0 },
      ['alignmentjs-alignment', 'alignmentjs-axis-div']
    );
    const { scroll_broadcaster } = this;
    $('#phyalign-container').off('wheel');
    $('#phyalign-container').on('wheel', function (e) {
      e.preventDefault();
      scroll_broadcaster.handleWheel(e);
    });
*/
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
