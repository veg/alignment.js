import React, { Component } from "react";
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
      .getElementById("hyphy-chart-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#hyphy-chart-div").scrollLeft(e.detail.x_pixel);
      });
    document
      .getElementById("hyphy-chart-div")
      .addEventListener("select_site", e => {
        this.setState({ emphasizedSite: e.detail });
      });
  }
  render() {
    const { emphasizedSite } = this.state,
      {
        statIndices,
        width,
        height,
        full_pixel_width,
        scale,
        data,
        site_size,
        colors,
        axis_height,
        scrollBroadcaster
      } = this.props,
      number_of_sites = data[0].length,
      axis_scale = scaleLinear()
        .domain([1, number_of_sites])
        .range([site_size / 2, full_pixel_width - site_size / 2]),
      tickValues = range(1, data[0].length, 2),
      plotline = line()
        .x((d, i) => (i + 0.5) * site_size + 0.5)
        .y(d => scale(d));
    return (
      <div
        id="hyphy-chart-div"
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
        <svg width={full_pixel_width} height={height} />
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
