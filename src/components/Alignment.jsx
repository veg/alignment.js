import React, { Component } from "react";

import fastaParser from "./../helpers/fasta";
import computeLabelWidth from "../helpers/computeLabelWidth";
import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import Placeholder from "./Placeholder.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import { nucleotide_color, nucleotide_text_color } from "./../helpers/colors";

class Alignment extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
    this.initialize(this.props);
  }
  setScrollingEvents(props) {
    if (props.fasta) {
      const { width, height, axis_height } = props;
      const { full_pixel_width, full_pixel_height, label_width } = this;
      this.scroll_broadcaster = new ScrollBroadcaster({
        width: full_pixel_width,
        height: full_pixel_height,
        x_pad: width - label_width,
        y_pad: height - axis_height,
        x_pixel: this.x_pixel || 0,
        y_pixel: this.y_pixel || 0,
        bidirectional: [
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div"
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
      this.full_pixel_width = site_size * this.sequence_data.number_of_sites;
      this.full_pixel_height =
        site_size * this.sequence_data.number_of_sequences;

      const { centerOnSite, centerOnHeader } = props;
      this.x_pixel = site_size * centerOnSite - width / 2 || 0;
      this.y_pixel = centerOnHeader
        ? site_size *
            this.sequence_data
              .map(record => record.header)
              .indexOf(centerOnHeader) -
          height / 2
        : 0;
    }
    this.setScrollingEvents(props);
  }
  render() {
    const { full_pixel_width, full_pixel_height, label_width } = this,
      width = full_pixel_width
        ? Math.min(label_width + full_pixel_width, this.props.width)
        : this.props.width,
      height = full_pixel_height
        ? Math.min(
            full_pixel_height + this.props.axis_height,
            this.props.height
          )
        : this.props.height;
    return (
      <div id="alignmentjs-main-div" style={{ width: width, height: height }}>
        <Placeholder width={this.label_width} height={this.props.axis_height} />
        <SiteAxis
          height={this.props.axis_height}
          site_size={this.props.site_size}
          sequence_data={this.sequence_data}
          x_pixel={this.x_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <SequenceAxis
          width={this.label_width}
          height={height - this.props.axis_height}
          sequence_data={this.sequence_data}
          site_size={this.props.site_size}
          y_pixel={this.y_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
        />
        <BaseAlignment
          width={width - this.label_width}
          height={height - this.props.axis_height}
          sequence_data={this.sequence_data}
          site_color={this.props.site_color}
          text_color={this.props.text_color}
          site_size={this.props.site_size}
          x_pixel={this.x_pixel}
          y_pixel={this.y_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
        />
      </div>
    );
  }
}

Alignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  site_size: 20,
  axis_height: 20,
  sender: "main"
};

module.exports = Alignment;
