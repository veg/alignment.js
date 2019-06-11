import React, { Component } from "react";

import fastaParser from "./../helpers/fasta";
import computeLabelWidth from "../helpers/computeLabelWidth";
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
  setScrollingEvents(props) {
    if (props.fasta) {
      const {
        width,
        height,
        axis_height,
        alignment_width,
        alignment_height
      } = props;
      const { full_pixel_width, full_pixel_height, label_width } = this;
      this.scroll_broadcaster = new ScrollBroadcaster({
        width: full_pixel_width,
        height: full_pixel_height,
        x_pad: alignment_width,
        y_pad: alignment_height,
        x_pixel: this.x_pixel,
        y_pixel: this.y_pixel,
        bidirectional: [
          "alignmentjs-reference-alignment",
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div",
          "alignmentjs-scaffold-div"
        ]
      });
    }
  }
  componentWillUpdate(nextProps) {
    this.initialize(nextProps);
  }
  initialize(props) {
    if (props.fasta) {
      const { fasta, site_size, width, height, axis_height } = props;
      this.sequence_data = fastaParser(fasta);
      const { sequence_data } = this;
      const { label_padding } = this.props;
      this.label_width = computeLabelWidth(sequence_data, label_padding);
      this.full_pixel_width = site_size * sequence_data.number_of_sites;
      this.full_pixel_height =
        site_size * (sequence_data.number_of_sequences - 1);
    }
    this.setScrollingEvents(props);
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
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <div id="alignmentjs-axis-placeholder2" />
        <SequenceAxis
          width={this.label_width}
          height={this.props.site_size}
          sequence_data={reference_sequence_data}
          site_size={this.props.site_size}
          id="alignmentjs-reference"
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <BaseAlignment
          width={alignment_width}
          height={this.props.site_size}
          sequence_data={reference_sequence_data}
          site_size={this.props.site_size}
          id="alignmentjs-reference"
          disableVerticalScrolling
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <div id="alignmentjs-reference-placeholder" />
        <SequenceAxis
          width={this.label_width}
          height={800}
          sequence_data={remaining_sequence_data}
          site_size={this.props.site_size}
          y_pixel={this.y_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <BaseAlignment
          width={alignment_width}
          height={800}
          sequence_data={remaining_sequence_data}
          site_size={this.props.site_size}
          scroll_broadcaster={this.scroll_broadcaster}
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

export default ScaffoldViewer;
