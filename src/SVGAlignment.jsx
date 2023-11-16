import React from "react";

import BaseSVGAlignment from "./components/BaseSVGAlignment.jsx";
import SVGSiteAxis from "./components/SVGSiteAxis.jsx";
import { BaseSequenceAxis } from "./components/SequenceAxis.jsx";
import { text_column_width } from "./helpers/computeLabelWidth";

function SVGAlignment(props) {
  const { sequence_data, label_padding, site_size } = props;
  if (!sequence_data) {
    return <svg />;
  }
  const { number_of_sites, number_of_sequences } = sequence_data,
    label_width = text_column_width(sequence_data) + label_padding,
    width = label_width + site_size * number_of_sites,
    height = props.axis_height + site_size * number_of_sequences;

  return (
    <svg id="alignment-js-svg" style={{ width, height }}>
      <rect x={0} y={0} width={width} height={height} fill="white" />
      <SVGSiteAxis
        {...props}
        number_of_sites={number_of_sites}
        translateX={label_width}
        translateY={props.axis_height}
      />
      <BaseSequenceAxis
        {...props}
        width={label_width}
        translateY={props.axis_height}
      />
      <BaseSVGAlignment
        {...props}
        translateX={label_width}
        translateY={props.axis_height}
      />
    </svg>
  );
}

SVGAlignment.defaultProps = {
  label_padding: 10,
  site_size: 20,
  axis_height: 25
};

export default SVGAlignment;
