import React, { Component } from "react";
import { scaleLinear } from "d3-scale";

import { vertical_scroll, handle_wheel } from "../helpers/scroll_events";

function SVGSequenceBarPlot(props) {
  const { width, site_size, data, scale, color, outline } = props;
  return (
    <svg width={width} height={site_size * data.length}>
      {data
        ? data.map((datum, i) => {
            return (
              <rect
                x={scale(0)}
                y={i * site_size}
                width={scale(datum) - scale(0)}
                height={site_size}
                fill={color}
                stroke={outline}
                key={i}
              />
            );
          })
        : null}
    </svg>
  );
}

class BaseSequenceBarPlot extends Component {
  componentDidMount() {
    vertical_scroll.call(this);
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
        overflowY: "scroll"
      };
    return (
      <div
        id={div_id}
        className="alignmentjs-container"
        style={container_style}
        onWheel={e => this.handleWheel(e)}
      >
        <SVGSequenceBarPlot {...this.props} />
      </div>
    );
  }
}

BaseSequenceBarPlot.defaultProps = {
  width: 500,
  height: 500,
  color: "red",
  outline: "black",
  div_id: "alignmentjs-bar",
  site_size: 20,
  sender: "main"
};

export default BaseSequenceBarPlot;
export { SVGSequenceBarPlot };
