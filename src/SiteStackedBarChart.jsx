import React from "react";
import { AxisLeft } from "d3-react-axis";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";

import BaseAlignment from "./components/BaseAlignment.jsx";
import SequenceAxis from "./components/SequenceAxis.jsx";
import BaseSiteStackedBarChart from "./components/BaseSiteStackedBarChart.jsx";
import fastaParser from "./helpers/fasta";
import ScrollBroadcaster from "./helpers/ScrollBroadcaster";
import { nucleotide_color, nucleotide_text_color } from "./helpers/colors";
import computeLabelWidth from "./helpers/computeLabelWidth";
import css_grid_format from "./helpers/format";

function SiteStackedBarChart(props) {
  const has_sequence_data = props.fasta || props.sequence_data;
  if (!has_sequence_data || !props.data) return <div />;
  const sequence_data = props.sequence_data || fastaParser(props.fasta),
    { width, bar_height, height, site_size, label_padding, data } = props,
    label_width = computeLabelWidth(sequence_data, label_padding),
    full_pixel_width = sequence_data[0].seq.length * site_size,
    full_pixel_height = sequence_data.length * site_size,
    base_alignment_width = width - label_width,
    base_alignment_height = height - bar_height,
    alignment_width = Math.min(full_pixel_width, base_alignment_width),
    alignment_height = Math.min(full_pixel_height, height - bar_height),
    scale = scaleLinear()
      .domain([0, max(data)])
      .range([props.left_bar_padding, bar_height - props.right_bar_padding]),
    container_style = {
      display: "grid",
      gridTemplateColumns: css_grid_format([label_width, base_alignment_width]),
      gridTemplateRows: css_grid_format([bar_height, base_alignment_height])
    },
    scroll_broadcaster = new ScrollBroadcaster({
      width: full_pixel_width,
      height: full_pixel_height,
      x_pad: base_alignment_width,
      y_pad: base_alignment_height,
      bidirectional: [
        "alignmentjs-alignment",
        "alignmentjs-stacked-bar",
        "alignmentjs-labels-div"
      ]
    });

  return (
    <div id="alignmentjs-main-div" style={container_style}>
      <AxisLeft scale={scale} transform={`translate(${label_width - 1}, 0)`} />
      <BaseSiteStackedBarChart
        width={alignment_width}
        height={bar_height}
        data={data}
        scroll_broadcaster={scroll_broadcaster}
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
    </div>
  );
}

SiteStackedBarChart.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  left_bar_padding: 10,
  right_bar_padding: 20,
  site_size: 20,
  bar_height: 50,
  bar_height: 100,
  width: 960,
  height: 500,
  sender: "main",
  molecule: mol => mol
};

export default SiteStackedBarChart;
