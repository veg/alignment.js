import React, { Component } from "react";
import { scaleLinear, range } from "d3";
import { AxisTop } from "d3-react-axis";

const $ = require("jquery");

function BaseSiteAxis(props) {
  if (!props.sequence_data) return <g />;
  const { site_size } = props,
    { number_of_sites } = props.sequence_data,
    alignment_width = site_size * number_of_sites,
    scale = scaleLinear()
      .domain([1, number_of_sites])
      .range([site_size / 2, alignment_width - site_size / 2]),
    tickValues = range(1, number_of_sites, 2);
  return (
    <AxisTop
      scale={scale}
      tickValues={tickValues}
      transform={props.transform}
    />
  );
}

class SiteAxis extends Component {
  componentDidMount() {
    document
      .getElementById("alignmentjs-axis-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-axis-div").scrollLeft(e.detail.x_pixel);
      });
    $("#alignmentjs-axis-div").scrollLeft(this.props.x_pixel);
  }
  componentDidUpdate(nextProps) {
    $("#alignmentjs-axis-div").scrollLeft(this.props.x_pixel);
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    if (!this.props.sequence_data) return <div id="alignmentjs-axis-div" />;
    const { site_size } = this.props,
      { number_of_sites } = this.props.sequence_data,
      alignment_width = site_size * number_of_sites;
    return (
      <div
        id="alignmentjs-axis-div"
        className="alignmentjs-container"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          width: this.props.width
        }}
        onWheel={e => this.handleWheel(e)}
      >
        <svg
          id="alignmentjs-axis"
          width={alignment_width}
          height={this.props.height}
        >
          <BaseSiteAxis
            sequence_data={this.props.sequence_data}
            site_size={this.props.site_size}
            transform={`translate(0,${this.props.height - 1})`}
          />
        </svg>
      </div>
    );
  }
}

SiteAxis.defaultProps = {
  x_pixel: 0,
  site_size: 20,
  sender: "main",
  start_site: 0
};

export default SiteAxis;
export { BaseSiteAxis };
