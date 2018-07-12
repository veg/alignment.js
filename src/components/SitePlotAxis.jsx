import React from "react";
const d3 = require("d3");

class SitePlotAxis extends React.Component {
  componentDidMount() {
    if (this.props.data != null) {
      this.createBarPlotAxis();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data == null) {
      this.createBarPlotAxis();
    }
  }

  createBarPlotAxis() {
    var { data, label_width, padding } = this.props;
    var label_width = this.props.label_width;
    var max_value = this.props.max_value && d3.max(data);
    var padding = this.props.padding;
    var height = this.props.height - padding.bottom;

    var bar_axis = d3.axisLeft().scale(
      d3
        .scaleLinear()
        .domain([max_value, 0])
        .range([0, height])
    );

    var axis = d3
      .select(".baseSiteBarPlotAxis")
      .attr("width", label_width)
      .attr("height", height + padding.bottom);

    axis
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${label_width - 1}, ${padding.top})`)
      .call(bar_axis);

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
      <div
        id={this.props.id + "-siteBarPlotAxis-div"}
        className="alignmentjs-container"
        style={{ width: this.props.label_width, height: this.props.height }}
      >
        <svg
          className="baseSiteBarPlotAxis"
          width={this.props.label_width}
          height={this.props.height}
          id={this.props.id + "siteBarPlotAxis"}
        />
      </div>
    );
  }
}

SitePlotAxis.defaultProps = {
  id: "alignmentjs",
  padding: { top: 10, right: 0, bottom: 15, left: 5 }
};

module.exports = SitePlotAxis;
