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

import "./LargeTreeAlignment.css";

class LargeTreeAlignment extends Component {
  constructor(props) {
    super(props);
    this.column_sizes = [700, 700, 200, 700];
    this.row_sizes = [20, 700];
  }
  componentWillUpdate(nextProps) {
    const { site_size } = this.props;
    this.sequence_data = fastaParser(nextProps.fasta);
    const number_of_sequences = this.sequence_data.length;
    this.tree_size = number_of_sequences * site_size;
    this.main_tree = d3.layout
      .phylotree()
      .options({
        "left-right-spacing": "fit-to-size",
        "top-bottom-spacing": "fit-to-size",
        "show-scale": false,
        "align-tips": true,
        "show-labels": false,
        selectable: false
      })
      .size([this.tree_size, this.tree_size])
      .node_circle_size(0);
    this.parsed = d3.layout.newick_parser(nextProps.newick);
    this.main_tree(this.parsed);

    const label_width = computeLabelWidth(
      this.sequence_data,
      this.props.label_padding
    );

    this.column_sizes[3] += this.column_sizes[2] - label_width;
    this.column_sizes[2] = label_width;

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
  }
  componentDidUpdate() {
    this.main_tree.svg(d3.select("#alignmentjs-largeTreeAlignment")).layout();

    const guide_height = this.row_sizes[1],
      guide_width = this.column_sizes[0];

    this.guide_tree = d3.layout
      .phylotree()
      .svg(d3.select("#alignmentjs-guideTree"))
      .options({
        "left-right-spacing": "fit-to-size",
        // fit to given size top-to-bottom
        "top-bottom-spacing": "fit-to-size",
        // fit to given size left-to-right
        collapsible: false,
        // turn off the menu on internal nodes
        transitions: false,
        // turn off d3 animations
        "show-scale": false,
        // disable brush
        brush: false,
        // disable selections on this tree
        selectable: false
      })
      .size([guide_height, guide_width])
      .node_circle_size(0);

    this.guide_tree(this.parsed).layout();

    this.guide_x_scale = d3.scale
      .linear()
      .domain([0, this.tree_size])
      .range([0, guide_width]);
    this.guide_y_scale = d3.scale
      .linear()
      .domain([0, this.tree_size])
      .range([0, guide_height]);
    this.rect = d3
      .select("#alignmentjs-guideTree")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("id", "guide-rect")
      .style("opacity", 0.6)
      .style("stroke-width", "1px")
      .style("stroke", "red")
      .style("fill", "pink")
      .attr("width", this.guide_x_scale(guide_width))
      .attr("height", this.guide_y_scale(guide_height));

    const { sequence_data } = this,
      { site_size } = this.props,
      height = this.row_sizes[1],
      width = this.column_sizes[3],
      full_pixel_width = site_size * sequence_data.number_of_sites,
      full_pixel_height = site_size * sequence_data.number_of_sequences;
    this.scroll_broadcaster = new ScrollBroadcaster(
      { width: full_pixel_width, height: full_pixel_height },
      { width: width, height: height },
      { x_pixel: 0, y_pixel: 0 },
      [
        "alignmentjs-alignment",
        "alignmentjs-labels-div",
        "alignmentjs-largeTreeAlignment-div",
        "alignmentjs-guideTree-div",
        "alignmentjs-axis-div"
      ]
    );

    const { scroll_broadcaster, guide_x_scale, guide_y_scale, rect } = this;
    scroll_broadcaster.setListeners();

    $("#alignmentjs-guideTree-div").off("wheel");
    $("#alignmentjs-guideTree-div").on("wheel", function(e) {
      e.preventDefault();
      const guide_x = +d3.select("#guide-rect").attr("x");
      const new_guide_x = Math.min(
        Math.max(guide_x + guide_x_scale(e.originalEvent.deltaX), 0),
        guide_width - guide_x_scale(guide_width)
      );
      rect.attr("x", new_guide_x);

      const guide_y = +d3.select("#guide-rect").attr("y");
      const new_guide_y = Math.min(
        Math.max(guide_y + guide_y_scale(e.originalEvent.deltaY), 0),
        guide_height - guide_y_scale(guide_height)
      );
      rect.attr("y", new_guide_y);

      const new_x_pixel = guide_x_scale.invert(new_guide_x),
        new_y_pixel = guide_y_scale.invert(new_guide_y);
      $("#alignmentjs-largeTreeAlignment-div").scrollLeft(new_x_pixel);
      $("#alignmentjs-largeTreeAlignment-div").scrollTop(new_y_pixel);

      const e_mock = {
        originalEvent: {
          deltaX: 0,
          deltaY: e.originalEvent.deltaY
        }
      };
      scroll_broadcaster.handleWheel(e_mock, "tree");
    });

    $("#alignmentjs-largeTreeAlignment-div").off("wheel");
    $("#alignmentjs-largeTreeAlignment-div").on("wheel", function(e) {
      const guide_x = +d3.select("#guide-rect").attr("x");
      const new_guide_x = Math.min(
        Math.max(guide_x + guide_x_scale(e.originalEvent.deltaX), 0),
        guide_width - guide_x_scale(guide_width)
      );
      rect.attr("x", new_guide_x);

      const guide_y = +d3.select("#guide-rect").attr("y");
      const new_guide_y = Math.min(
        Math.max(guide_y + guide_y_scale(e.originalEvent.deltaY), 0),
        guide_height - guide_y_scale(guide_height)
      );
      rect.attr("y", new_guide_y);

      const e_mock = {
        originalEvent: {
          deltaX: 0,
          deltaY: e.originalEvent.deltaY
        }
      };
      scroll_broadcaster.handleWheel(e_mock, "tree");
    });

    $("#alignmentjs-alignment").on("wheel", function(e) {
      e.preventDefault();
      const guide_y = +d3.select("#guide-rect").attr("y");
      const new_guide_y = Math.min(
        Math.max(guide_y + guide_y_scale(e.originalEvent.deltaY), 0),
        guide_height - guide_y_scale(guide_height)
      );
      rect.attr("y", new_guide_y);
      scroll_broadcaster.handleWheel(e, "alignment");
    });

    d3.select("#alignmentjs-guideTree").on("click", null);
    d3.select("#alignmentjs-guideTree").on("click", function() {
      const coords = d3.mouse(this),
        new_x_pixel = guide_x_scale.invert(coords[0]),
        new_y_pixel = guide_y_scale.invert(coords[1]),
        current_x_fraction = scroll_broadcaster.x_fraction,
        new_y_fraction = new_y_pixel / scroll_broadcaster.full_pixel_height;
      scroll_broadcaster.broadcast(current_x_fraction, new_y_fraction);
      rect.attr("x", coords[0]);
      rect.attr("y", coords[1]);
      $("#alignmentjs-largeTreeAlignment-div").scrollLeft(new_x_pixel);
      $("#alignmentjs-largeTreeAlignment-div").scrollTop(new_y_pixel);
    });

    document
      .getElementById("alignmentjs-largeTreeAlignment-div")
      .addEventListener("alignmentjs_wheel_event", e => {
        if (e.detail.sender == "alignment") {
          $("#alignmentjs-largeTreeAlignment-div").scrollTop(e.detail.y_pixel);
        }
      });
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
        <div />
        <SiteAxis
          width={this.column_sizes[3]}
          height={this.row_sizes[0]}
          sequence_data={this.sequence_data}
        />
        <div id="alignmentjs-guideTree-div">
          <svg id="alignmentjs-guideTree" />
        </div>
        <div
          id="alignmentjs-largeTreeAlignment-div"
          style={{ overflowX: "scroll", overflowY: "scroll" }}
        >
          <svg id="alignmentjs-largeTreeAlignment" />
        </div>
        <SequenceAxis
          width={this.column_sizes[2]}
          height={this.row_sizes[1]}
          sequence_data={this.sequence_data}
        />
        <BaseAlignment
          width={this.column_sizes[3]}
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
