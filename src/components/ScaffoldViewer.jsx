import React, { Component } from "react";
const d3 = require("d3");
const $ = require("jquery");
const _ = require("underscore");
const text_width = require("text-width");

import fastaParser from "./../helpers/fasta";
import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import Placeholder from "./Placeholder.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import Scaffold from "./Scaffold.jsx";
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import { nucleotide_color, nucleotide_text_color } from "./../helpers/colors";

class ScaffoldViewer extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
    this.initialize(this.props);
  }
  componentDidMount() {
    this.setScrollingEvents(this.props);
  }
  setScrollingEvents(props) {
    if (props.fasta) {
      const { scroll_broadcaster } = this;
      scroll_broadcaster.setListeners();
      $("#alignmentjs-main-div").off("wheel");
      $("#alignmentjs-main-div").on("wheel", function(e) {
        e.preventDefault();
        scroll_broadcaster.handleWheel(e);
      });
    }
  }
  componentWillUpdate(nextProps) {
    this.initialize(nextProps);
    this.setScrollingEvents(nextProps);
  }
  initialize(props) {
    if (props.fasta) {
      const { fasta, site_size, width, height, axis_height } = props;
      this.sequence_data = fastaParser(fasta);
      this.label_width =
        props.label_padding +
        this.sequence_data
          .map(record =>
            text_width(record.header, { family: "Courier", size: 14 })
          )
          .reduce((a, b) => Math.max(a, b), 0);
      this.full_pixel_width = site_size * this.sequence_data.number_of_sites;
      this.full_pixel_height =
        site_size * (this.sequence_data.number_of_sequences - 1);

      const { centerOnSite, centerOnHeader } = props;
      this.x_pixel = site_size * centerOnSite - width / 2 || 0;
      this.y_pixel = centerOnHeader
        ? site_size *
            this.sequence_data
              .map(record => record.header)
              .indexOf(centerOnHeader) -
          height / 2
        : 0;

      this.scroll_broadcaster = new ScrollBroadcaster(
        { width: this.full_pixel_width, height: this.full_pixel_height },
        {
          width: this.props.alignment_width,
          height: this.props.alignment_height
        },
        { x_pixel: this.x_pixel, y_pixel: this.y_pixel },
        [
          "alignmentjs-reference-alignment",
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div",
          "alignmentjs-scaffold-div"
        ]
      );
    }
  }
  render() {
    if (!this.sequence_data) {
      return <div style={container_style} id="alignmentjs-main-div" />;
    }
    const { alignment_width, alignment_height, scaffold_width } = this.props,
      gridTemplateColumns = `${
        this.label_width
      }px ${alignment_width}px ${scaffold_width}px`,
      container_style = {
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        gridTemplateRows: `20px 20px ${alignment_height}px`
      },
      reference_sequence_data = this.sequence_data.slice(0, 1),
      remaining_sequence_data = this.sequence_data.slice(1);
    return (
      <div style={container_style} id="alignmentjs-main-div">
        <div id="alignmentjs-axis-placeholder1" />
        <SiteAxis
          width={alignment_width}
          height={20}
          sequence_data={this.sequence_data}
        />
        <div id="alignmentjs-axis-placeholder2" />
        <SequenceAxis
          width={this.label_width}
          height={this.props.site_size}
          sequence_data={reference_sequence_data}
          site_size={this.props.site_size}
          y_pixel={this.y_pixel}
          id="alignmentjs-reference"
        />
        <BaseAlignment
          width={alignment_width}
          height={this.props.site_size}
          sequence_data={reference_sequence_data}
          site_size={this.props.site_size}
          x_pixel={this.x_pixel}
          y_pixel={this.y_pixel}
          id="alignmentjs-reference"
          disableVerticalScrolling
        />
        <div id="alignmentjs-reference-placeholder" />
        <SequenceAxis
          width={this.label_width}
          height={800}
          sequence_data={remaining_sequence_data}
          site_size={this.props.site_size}
          y_pixel={this.y_pixel}
        />
        <BaseAlignment
          width={alignment_width}
          height={800}
          sequence_data={remaining_sequence_data}
          site_size={this.props.site_size}
          x_pixel={this.x_pixel}
          y_pixel={this.y_pixel}
        />
        <Scaffold
          width={scaffold_width}
          height={800}
          sequence_data={remaining_sequence_data}
          scroll_broadcaster={this.scroll_broadcaster}
        />
      </div>
    );
  }
}

ScaffoldViewer.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  site_size: 20,
  label_padding: 10,
  axis_height: 20,
  alignment_width: 600,
  alignment_height: 800,
  scaffold_width: 400
};

module.exports = ScaffoldViewer;
