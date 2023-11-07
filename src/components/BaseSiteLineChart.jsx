import React, { Component } from "react";
import { min, max } from "d3-array";
import { AxisBottom } from "d3-react-axis";
import { scaleLinear, line, range } from "d3";
import $ from "jquery";

class SiteLinePlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emphasizedSite: null
    };
  }
  componentDidMount() {
    const { setState } = this;
    document
      .getElementById("alignmentjs-site-line")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-site-line").scrollLeft(e.detail.x_pixel);
      });
  }
  render() {
    const {
        width,
        height,
        full_pixel_width,
        data,
        site_size,
        scrollBroadcaster
      } = this.props,
      number_of_sites = data.length,
      scale = scaleLinear()
        .domain([min(data), max(data)])
        .range([height, 0]),
      plotline = line()
        .x((d, i) => (i + 0.5) * site_size + 0.5)
        .y(d => scale(d));
    return (
      <div
        id="alignmentjs-site-line"
        className="alignmentjs-container"
        style={{
          overflow: "hidden scroll",
          width: width
        }}
        onWheel={e => {
          e.preventDefault();
          scrollBroadcaster.handleWheel(e, "main");
        }}
      >
        <svg width={full_pixel_width} height={height}>
          <path stroke={"red"} strokeWidth={3} d={plotline(data)} fill="none" />
        </svg>
      </div>
    );
  }
}

SiteLinePlot.defaultProps = {
  site_size: 20,
  colors: ["red", "blue", "orange"],
  axis_height: 20
};

export default SiteLinePlot;
