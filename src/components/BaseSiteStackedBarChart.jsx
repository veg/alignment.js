import React, { Component } from "react";
import { flatten } from "underscore";
import { max } from "d3";
import { scaleLinear } from "d3-scale";

import { horizontal_scroll, handle_wheel } from "../helpers/scroll_events";

function SVGSiteStackedBarPlot(props) {
  const { site_size, data, color, outline, height } = props;
  if (!data) return <svg />;
  const stacked_data = data.map(datum => {
      const stacked_datum = [];
      datum.reduce((acc, curr, di) => {
        return (stacked_datum[di] = acc + curr);
      }, 0);
      return stacked_datum;
    }),
    scale = scaleLinear()
      .domain([0, max(flatten(stacked_data))])
      .range([height, 0]),
    width = data.length * site_size;
  return (
    <svg width={width} height={height}>
      {stacked_data.map((stacked_datum, i) => {
        return (
          <g key={i}>
            {stacked_datum.map((datum, j) => {
              const bottom = j == 0 ? 0 : stacked_datum[j - 1];
              return (
                <rect
                  key={i + "," + j}
                  x={i * site_size}
                  y={scale(datum)}
                  width={site_size}
                  height={scale(bottom) - scale(datum)}
                  fill={color[j]}
                  stroke={outline[j]}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

class BaseSiteStackedBarPlot extends Component {
  componentDidMount() {
    horizontal_scroll.call(this);
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    const { width, height, div_id } = this.props,
      container_style = {
        width: width,
        height: height,
        overflow: "hidden scroll"
      };
    return (
      <div
        id={div_id}
        style={container_style}
        onWheel={e => this.handleWheel(e)}
      >
        <SVGSiteStackedBarPlot {...this.props} />
      </div>
    );
  }
}

BaseSiteStackedBarPlot.defaultProps = {
  width: 500,
  height: 500,
  color: ["pink", "MediumPurple", "yellow", "LightBlue"],
  outline: ["red", "purple", "GoldenRod", "blue"],
  div_id: "alignmentjs-stacked-bar",
  site_size: 20,
  sender: "main"
};

export default BaseSiteStackedBarPlot;
export { SVGSiteStackedBarPlot };
