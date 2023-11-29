import React, { Component } from "react";
import _ from "underscore";

import fastaParser from "./helpers/fasta";
import { text_column_width } from "./helpers/computeLabelWidth";
import BaseAlignment from "./components/BaseAlignment.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import Placeholder from "./components/Placeholder.jsx";
import SequenceAxis from "./components/SequenceAxis.jsx";
import ScrollBroadcaster from "./helpers/scroll_broadcaster";
import { nucleotide_color, nucleotide_text_color } from "./helpers/colors";

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
          "alignmentjs-alignment-div",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div"
        ]
      });
      if (props.excavator) {
        props.excavator.broadcaster = this.scroll_broadcaster;
      }
    }
  }
  performCentering() {
    const { centerOnSite, width, site_size } = this.props;
    this.x_pixel = site_size * centerOnSite - width / 2 || 0;
    const { centerOnHeader, height } = this.props;
    this.y_pixel = centerOnHeader
      ? site_size *
          this.sequence_data
            .map(record => record.header)
            .indexOf(centerOnHeader) -
        height / 2
      : 0;
  }
  shouldComponentUpdate(nextProps) {
    const same_fasta = _.isEqual(this.props.fasta, nextProps.fasta),
      different_coloring =
        !_.isEqual(this.props.molecule, nextProps.molecule) ||
        !_.isEqual(this.props.site_color, nextProps.site_color) ||
        !_.isEqual(this.props.text_color, nextProps.text_color),
      should_update = !same_fasta || different_coloring;
    if (should_update) {
      this.initialize(nextProps);
      return true;
    }
    return false;
  }
  initialize(props) {
    if (props.fasta) {
      const { fasta, site_size, width, height } = props;
      this.sequence_data = fastaParser(fasta);
      const { sequence_data } = this;
      const { label_padding } = this.props;
      console.log(this.sequence_data);
      this.label_width = text_column_width(sequence_data) + label_padding;
      this.full_pixel_width = site_size * this.sequence_data.number_of_sites;
      this.full_pixel_height =
        site_size * this.sequence_data.number_of_sequences;
      this.performCentering();
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
          width={width - this.label_width}
          height={this.props.axis_height}
          site_size={this.props.site_size}
          sequence_data={this.sequence_data}
          x_pixel={this.x_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
          start_site={this.props.start_site}
        />
        <SequenceAxis
          width={this.label_width}
          height={height - this.props.axis_height}
          sequence_data={this.sequence_data}
          site_size={this.props.site_size}
          y_pixel={this.y_pixel}
          scroll_broadcaster={this.scroll_broadcaster}
          onClick={this.props.onSequenceClick}
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
          molecule={this.props.molecule}
          onSiteClick={this.props.onSiteClick}
          onSiteHover={this.props.onSiteHover}
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
  axis_height: 25,
  width: 960,
  height: 500,
  sender: "main",
  molecule: mol => mol,
  start_site: 0,
  onSequenceClick: (label, i) => () => null,
  onSiteHover: () => null,
  onSiteClick: () => null
};

export default Alignment;
