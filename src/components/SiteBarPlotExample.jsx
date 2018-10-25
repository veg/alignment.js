import React, { Component } from "react";
const $ = require("jquery");

import fastaParser from "../helpers/fasta";
import computeLabelWidth from "../helpers/computeLabelWidth";
import BaseAlignment from "./BaseAlignment.jsx";
import SiteAxis from "./SiteAxis.jsx";
import Placeholder from "./Placeholder.jsx";
import SequenceAxis from "./SequenceAxis.jsx";
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import { nucleotide_color, nucleotide_text_color } from "./../helpers/colors";
import { siteComposition } from "./../helpers/nucleotideComposition";
import BaseSiteBarPlot from "./BaseSiteBarPlot.jsx";
import SitePlotAxis from "./SitePlotAxis.jsx";

class SiteBarPlotExample extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
    this.state = {
      nucleotideInView: "A",
      siteNucleotideData: null
    };
    this.initialize(this.props);
  }

  componentDidMount() {
    this.getSiteNucleotideData(this.sequence_data);
  }

  componentWillUpdate(nextProps, prevState) {
    //TODO: replace componentWillUpdate as this is deprecated in future versions of react.
    this.setScrollingEvents(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.siteNucleotideData == null) {
      this.getSiteNucleotideData(this.sequence_data);
    }
  }

  setScrollingEvents(props) {
    if (props.fasta) {
      const { width, height, axis_height } = props;
      this.scroll_broadcaster = new ScrollBroadcaster({
        width: this.full_pixel_width,
        height: this.full_pixel_height,
        x_pad: width - this.label_width,
        y_pad: height - axis_height,
        x_pixel: this.x_pixel,
        y_pixel: this.y_pixel,
        bidirectional: [
          "alignmentjs-siteBarPlot-div",
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div"
        ]
      });

      // Update this.x_pixel on scroll events so that the alignment and plots will render to the correct scroll location on re-renders.
      document
        .getElementById("alignmentjs-alignment")
        .addEventListener("alignmentjs_wheel_event", e => {
          this.x_pixel = e.detail.x_pixel;
        });
    }
  }

  initialize(props) {
    if (props.fasta) {
      const { fasta, site_size, width, height } = props;
      this.sequence_data = fastaParser(props.fasta);
      const { sequence_data } = this;
      const { label_padding } = this.props;
      this.label_width = computeLabelWidth(sequence_data, label_padding);
      this.full_pixel_width = site_size * sequence_data.number_of_sites;
      this.full_pixel_height = site_size * sequence_data.number_of_sequences;

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

  getSiteNucleotideData = sequence_data => {
    siteComposition(sequence_data, this.setSiteNucleotideDataToState);
  };

  setSiteNucleotideDataToState = siteNucleotideData => {
    this.setState({ siteNucleotideData: siteNucleotideData });
  };

  switchNucleotide = nucleotide => {
    this.setState({ nucleotideInView: nucleotide });
  };

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
    const barPlotHeight = 120;
    var bar_plot_data =
      this.state.siteNucleotideData == null
        ? null
        : this.state.siteNucleotideData[this.state.nucleotideInView];

    return (
      <div>
        <SwitchNucleotideButtons switchNucleotide={this.switchNucleotide} />

        <div id="alignmentjs-main-div" style={{ width: width, height: height }}>
          <SitePlotAxis
            label_width={this.label_width}
            data={bar_plot_data}
            height={barPlotHeight}
            max_value={1}
            axis_label={"Nucleotide %"}
            scroll_broadcaster={this.scroll_broadcaster}
          />
          <BaseSiteBarPlot
            data={bar_plot_data}
            siteSize={this.props.site_size}
            width={full_pixel_width}
            height={barPlotHeight}
            fillColor={this.props.site_color(this.state.nucleotideInView)}
            outlineColor={this.props.text_color(this.state.nucleotideInView)}
            x_pixel={this.x_pixel}
            max_value={1}
            scroll_broadcaster={this.scroll_broadcaster}
          />

          <Placeholder
            width={this.label_width}
            height={this.props.axis_height}
          />
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
      </div>
    );
  }
}

SiteBarPlotExample.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  site_size: 20,
  axis_height: 20,
  sender: "main"
};

class SwitchNucleotideButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className="btn btn-light active"
          onClick={() => this.props.switchNucleotide("A")}
        >
          <input type="radio" />
          A
        </label>
        <label
          className="btn btn-light"
          onClick={() => this.props.switchNucleotide("C")}
        >
          <input type="radio" />
          C
        </label>
        <label
          className="btn btn-light"
          onClick={() => this.props.switchNucleotide("G")}
        >
          <input type="radio" />
          G
        </label>
        <label
          className="btn btn-light"
          onClick={() => this.props.switchNucleotide("T")}
        >
          <input type="radio" />
          T
        </label>
      </div>
    );
  }
}

module.exports = SiteBarPlotExample;
