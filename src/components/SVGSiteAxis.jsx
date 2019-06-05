import React, { Component } from "react";
import { range } from "d3";

function Tick(props) {
  const translateX =
    props.site_size / 2 + (props.site - 1 - props.offset) * props.site_size;
  return (
    <g className="tick" opacity={1} transform={`translate(${translateX},0)`}>
      <line stroke="currentColor" y2={-6} />
      <text fill="currentColor" y={-9} dy="0em">
        {props.site}
      </text>
    </g>
  );
}

function SVGSiteAxis(props) {
  const site_start = props.axis_bounds[0] + 1 || 1,
    offset = site_start - 1,
    sites = range(
      site_start,
      props.axis_bounds[1] || props.number_of_sites + 1,
      2
    ),
    half_site_size = props.site_size / 2,
    x2 = props.number_of_sites * props.site_size - half_site_size;
  return (
    <g
      className="axis"
      transform={`translate(${props.translateX}, ${props.translateY})`}
      fill="none"
      fontSize={10}
      fontFamily="sans-serif"
      textAnchor="middle"
    >
      <line
        x1={half_site_size}
        x2={x2}
        y1={-0.5}
        y2={-0.5}
        style={{ stroke: "black", strokeWidth: 1 }}
      />
      {sites.map(site => (
        <Tick
          key={site}
          site={site}
          site_size={props.site_size}
          offset={offset}
        />
      ))}
    </g>
  );
}

SVGSiteAxis.defaultProps = {
  axis_bounds: [null, null]
};

export default SVGSiteAxis;
