import React, { Component } from "react";
const d3 = require("d3");

class Scaffold extends Component {
  componentDidMount() {
    document
      .getElementById("alignmentjs-scaffold-div")
      .addEventListener("alignmentjs_wheel_event", e => {
        d3
          .select("#alignmentjs-guide-rect")
          .attr("x", e.detail.x_fraction * this.props.width)
          .attr("y", e.detail.y_fraction * this.props.height);
      });
    const { width, height, scroll_broadcaster, sender } = this.props,
      guide_svg = d3.select("#alignmentjs-scaffold");
    guide_svg.on("click", function() {
      const coords = d3.mouse(this),
        x_fraction = coords[0] / width,
        y_fraction = coords[1] / height;
      scroll_broadcaster.broadcast(x_fraction, y_fraction, sender);
    });
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    if (!this.props.sequence_data) {
      return <div id="alignmentjs-scaffold-div" />;
    }
    const {
        sequence_data,
        scroll_broadcaster,
        width,
        height,
        sender
      } = this.props,
      {
        x_pad,
        y_pad,
        width: alignment_width,
        height: alignment_height
      } = scroll_broadcaster[sender],
      number_of_sites = sequence_data[0].seq.length,
      number_of_sequences = sequence_data.length,
      guide_width = this.props.width * x_pad / alignment_width,
      guide_height = this.props.height * y_pad / alignment_height,
      line_style = { stroke: "red", strokeWidth: "1px" };
    return (
      <div id="alignmentjs-scaffold-div" onWheel={e => this.handleWheel(e)}>
        <svg width={width} height={height} id="alignmentjs-scaffold">
          <rect x={0} y={0} width={width} height={height} fill="WhiteSmoke" />
          {sequence_data.map((row, index) => {
            const y = height * index / number_of_sequences;
            var start = false,
              end = false;
            for (let i = 0; !start || !end; i++) {
              if (!start && row.seq[i] != "-") {
                start = i;
              }
              if (!end && row.seq[row.seq.length - i - 1] != "-") {
                end = row.seq.length - i - 1;
              }
            }
            return (
              <line
                x1={width * start / number_of_sites}
                x2={width * end / number_of_sites}
                y1={y}
                y2={y}
                key={index}
                style={line_style}
              />
            );
          })}
          <rect
            id="alignmentjs-guide-rect"
            x={0}
            y={0}
            width={guide_width}
            height={guide_height}
            fill="darkgrey"
            fillOpacity={0.8}
            stroke="white"
            strokeWidth={1}
          />
        </svg>
      </div>
    );
  }
}

Scaffold.defaultProps = {
  sender: "main"
};

export default Scaffold;
