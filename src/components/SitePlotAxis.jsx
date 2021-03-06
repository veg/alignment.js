import React from "react";
const d3 = require("d3");

class SitePlotAxis extends React.Component {
  componentDidMount() {
    if (this.props.data != null) {
      this.createPlotAxis();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data != null) {
      d3.select(".baseSitePlotAxis").html("");
      this.createPlotAxis();
    }
  }

  createPlotAxis() {
    var { data, label_width, padding } = this.props;
    var label_width = this.props.label_width;
    var max_value = this.props.max_value || d3.max(data);
    var padding = this.props.padding;
    var height = this.props.height - padding.bottom;

    var plot_axis = d3.axisLeft().scale(
      d3
        .scaleLinear()
        .domain([max_value, 0])
        .range([0, height])
    );

    var axis = d3
      .select(".baseSitePlotAxis")
      .attr("width", label_width)
      .attr("height", height + padding.bottom);

    axis
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${label_width - 1}, ${padding.top})`)
      .call(plot_axis);

    axis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", label_width / 2)
      .attr("x", -padding.top - height / 2)
      .style("text-anchor", "middle")
      .text(this.props.axis_label);
  }

  render() {
    return (
      <g
        className="baseSitePlotAxis"
        transform={`translate(${this.props.translateX}, ${
          this.props.translateY
        })`}
        width={this.props.label_width}
        height={this.props.height}
        id={this.props.id + "-sitePlotAxis"}
      />
    );
  }
}

SitePlotAxis.defaultProps = {
  id: "alignmentjs",
  padding: { top: 10, right: 0, bottom: 15, left: 5 },
  sender: "main",
  label_width: 30,
  translateX: 0,
  translateY: 0
};

export default SitePlotAxis;
