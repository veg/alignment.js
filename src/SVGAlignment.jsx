import React, { Component } from "react";

import BaseSVGAlignment from "./components/BaseSVGAlignment.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import { BaseSequenceAxis } from "./components/SequenceAxis.jsx";
import computeLabelWidth from "./helpers/computeLabelWidth";

function SVGAlignment(props) {
  const { sequence_data, label_padding, site_size } = props;
  if (!sequence_data) {
    return <svg />;
  }
  const label_width = computeLabelWidth(sequence_data, label_padding),
    width = label_width + site_size * sequence_data[0].seq.length,
    height = label_width + site_size * sequence_data.length;

  return (
    <svg style={{ width, height }}>
      <BaseSequenceAxis width={label_width} {...props} />
      <BaseSVGAlignment {...props} translateX={label_width} />
    </svg>
  );
}

SVGAlignment.defaultProps = {
  label_padding: 10,
  site_size: 20
};

module.exports = SVGAlignment;
