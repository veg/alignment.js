import React from "react";
const d3 = require("d3");

class BaseSiteBarPlotAxis extends React.Component {
  constructor(props) {
    super(props);
  }

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
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data == null) {
      this.createBarPlotAxis();
    }
  }

  createBarPlotAxis() {
    var data = this.props.data;
    var label_width = this.props.label_width;
    var max_value = this.props.max_value && d3.max(data);
    var padding_bottom = 15;
    var height = this.props.height - padding_bottom;

    var bar_axis = d3.axisLeft().scale(
      d3
        .scaleLinear()
        .domain([max_value, 0])
        .range([0, height])
    );

    var axis = d3
      .select(".baseSiteBarPlotAxis")
      .attr("width", label_width)
      .attr("height", height + padding_bottom);

    axis
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${label_width - 1}, 10)`)
      .call(bar_axis);

    axis
      .append("text")
      .attr("x", 11)
      .attr("y", label_width - 20)
      .attr("transform", `rotate(270 ${0.75 * label_width}, 70)`)
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

BaseSiteBarPlotAxis.defaultProps = {
  id: "alignmentjs"
};

module.exports = BaseSiteBarPlotAxis;
