import React from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";

import BaseAlignment from "./components/BaseAlignment.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import SequenceAxis from "./components/SequenceAxis.jsx";
import Placeholder from "./components/Placeholder.jsx";
import BaseSequenceBarPlot from "./components/BaseSequenceBarPlot.jsx";
import fastaParser from "./helpers/fasta";
import ScrollBroadcaster from "./helpers/scroll_broadcaster";
import AxisTop from "./components/AxisTop.jsx";
import { nucleotide_color, nucleotide_text_color } from "./helpers/colors";
import computeLabelWidth from "./helpers/computeLabelWidth";
import css_grid_format from "./helpers/format";

function SequenceBarChart(props) {
  const has_sequence_data = props.fasta || props.sequence_data;
  if (!has_sequence_data || !props.data) return <div />;
  const sequence_data = props.sequence_data || fastaParser(props.fasta),
    { width, bar_width, height, axis_height, site_size, label_padding } = props,
    label_width = computeLabelWidth(sequence_data, label_padding),
    full_pixel_width = sequence_data[0].seq.length * site_size,
    full_pixel_height = sequence_data.length * site_size,
    base_alignment_width = width - bar_width - label_width,
    base_alignment_height = height - axis_height,
    alignment_width = Math.min(full_pixel_width, base_alignment_width),
    alignment_height = Math.min(full_pixel_height, height - axis_height),
    scale = scaleLinear()
      .domain([0, max(props.data)])
      .range([props.left_bar_padding, bar_width - props.right_bar_padding]),
    container_style = {
      display: "grid",
      gridTemplateColumns: css_grid_format([
        label_width,
        base_alignment_width,
        bar_width
      ]),
      gridTemplateRows: css_grid_format([axis_height, base_alignment_height])
    },
    scroll_broadcaster = new ScrollBroadcaster({
      width: full_pixel_width,
      height: full_pixel_height,
      x_pad: base_alignment_width,
      y_pad: base_alignment_height,
      bidirectional: [
        "alignmentjs-alignment",
        "alignmentjs-axis-div",
        "alignmentjs-bar"
      ]
    });

  return (
    <div id="alignmentjs-main-div" style={container_style}>
      <Placeholder width={label_width} height={axis_height} />
      <SiteAxis
        width={alignment_width}
        height={axis_height}
        sequence_data={sequence_data}
        scroll_broadcaster={scroll_broadcaster}
      />
      <AxisTop
        width={bar_width}
        height={axis_height}
        scale={scale}
        label={props.label}
      />
      <SequenceAxis
        width={label_width}
        height={alignment_height}
        sequence_data={sequence_data}
        site_size={site_size}
        scroll_broadcaster={scroll_broadcaster}
      />
      <BaseAlignment
        sequence_data={sequence_data}
        width={alignment_width}
        height={alignment_height}
        site_color={props.site_color}
        text_color={props.text_color}
        site_size={props.site_size}
        molecule={props.molecule}
        scroll_broadcaster={scroll_broadcaster}
      />
      <BaseSequenceBarPlot
        data={props.data}
        width={bar_width}
        height={alignment_height}
        scroll_broadcaster={scroll_broadcaster}
        scale={scale}
      />
    </div>
  );
}

SequenceBarChart.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  left_bar_padding: 10,
  right_bar_padding: 20,
  site_size: 20,
  axis_height: 50,
  bar_width: 300,
  width: 960,
  height: 500,
  sender: "main",
  molecule: mol => mol
};

export default SequenceBarChart;
