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
import ScrollBroadcaster from "./../helpers/ScrollBroadcaster";
import { nucleotide_color, nucleotide_text_color } from "./../helpers/colors";
import { siteComposition } from "./../helpers/nucleotideComposition";
import BaseSiteBarPlot from "./BaseSiteBarPlot.jsx";
import BaseSiteBarPlotAxis from "./BaseSiteBarPlotAxis.jsx";

class SiteBarPlotExample extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
    this.state = {
      nucleotideInView: "A",
      siteNucleotideData: null
    };
  }

  componentDidMount() {
    this.initialize(this.props);
    this.getSiteNucleotideData(this.sequence_data);
    this.setScrollingEvents(this.props);
  }

  componentWillUpdate(nextProps, prevState) {
    //TODO: replace componentWillUpdate as this is deprecated in future versions of react.
    this.initialize(nextProps);
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
      this.scroll_broadcaster = new ScrollBroadcaster(
        { width: this.full_pixel_width, height: this.full_pixel_height },
        { width: width - this.label_width, height: height - axis_height },
        { x_pixel: this.x_pixel, y_pixel: this.y_pixel },
        [
          "alignmentjs-siteBarPlot-div",
          "alignmentjs-alignment",
          "alignmentjs-axis-div",
          "alignmentjs-labels-div"
        ]
      );
      const { scroll_broadcaster } = this;
      scroll_broadcaster.setListeners();
      $("#alignmentjs-main-div").off("wheel");
      $("#alignmentjs-main-div").on("wheel", function(e) {
        e.preventDefault();
        scroll_broadcaster.handleWheel(e);
      });
    }
  }

  initialize(props) {
    if (props.fasta) {
      const { fasta, site_size, width, height, axis_height } = props;
      this.sequence_data = fastaParser(props.fasta);
      this.label_width =
        props.label_padding +
        this.sequence_data
          .map(record =>
            text_width(record.header, { family: "Courier", size: 14 })
          )
          .reduce((a, b) => Math.max(a, b), 0);
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
    if (this.state.siteNucleotideData == null) {
      return <div>Loading Data...</div>;
    }

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

    return (
      <div>
        <SwitchNucleotideButtons switchNucleotide={this.switchNucleotide} />

        <div id="alignmentjs-main-div" style={{ width: width, height: height }}>
          <BaseSiteBarPlotAxis
            label_width={this.label_width}
            data={this.state.siteNucleotideData[this.state.nucleotideInView]}
            height={barPlotHeight}
            max_value={1}
            axis_label={"Nucleotide %"}
          />
          <BaseSiteBarPlot
            data={this.state.siteNucleotideData[this.state.nucleotideInView]}
            displayWidth={width - this.label_width}
            siteSize={this.props.site_size}
            height={barPlotHeight}
            fillColor={this.props.site_color(this.state.nucleotideInView)}
            outlineColor={this.props.text_color(this.state.nucleotideInView)}
            x_pixel={this.x_pixel}
            max_value={1}
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
          />

          <SequenceAxis
            width={this.label_width}
            height={height - this.props.axis_height}
            sequence_data={this.sequence_data}
            site_size={this.props.site_size}
            y_pixel={this.y_pixel}
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
  axis_height: 20
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
