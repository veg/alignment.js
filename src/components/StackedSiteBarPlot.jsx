import React from "react";
const d3 = require("d3");
const $ = require("jquery");

class StackedSiteBarPlot extends React.Component {
  constructor(props) {
    super(props);
    this.chart_height = this.props.height - this.props.padding.bottom;
    $("#alignmentjs-siteBarPlot-div").scrollLeft(this.props.x_pixel);
  }

  componentDidMount() {
    if (this.props.data != null) {
      this.createBarPlot();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    document
      .getElementById("alignmentjs-siteBarPlot-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-siteBarPlot-div").scrollLeft(e.detail.x_pixel);
      });
    this.createBarPlot();
  }

  createBarPlot() {
    var data = this.props.data;
    var chart_height = this.chart_height;
    var max_value = this.props.max_value || d3.max(data);
    var bar_spacing = 2;
    var padding = this.props.padding;
    var barWidth = this.props.siteSize;

    var barChartScale = d3
      .scaleLinear()
      .domain([0, max_value])
      .range([0, chart_height]);

    var chart = d3
      .select("#alignmentjs-siteBarPlot")
      .attr("width", this.props.width)
      .attr("height", chart_height + padding.bottom);

    var bars = chart
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return (
          "translate(" +
          (i * barWidth + bar_spacing / 2) +
          ", " +
          padding.top +
          ")"
        );
      });

    bars
      .append("rect")
      .attr("x", 2)
      .attr("width", barWidth - bar_spacing)
      .attr("height", d => barChartScale(d["A"][1]))
      .attr("fill", "LightPink");

    bars
      .append("rect")
      .attr("x", 2)
      .attr("y", d => barChartScale(d["A"][1]))
      .attr("width", barWidth - bar_spacing)
      .attr("height", d => barChartScale(d["G"][1]))
      .attr("fill", "LemonChiffon");

    bars
      .append("rect")
      .attr("x", 2)
      .attr("y", d => barChartScale(d["A"][1] + d["G"][1]))
      .attr("width", barWidth - bar_spacing)
      .attr("height", d => barChartScale(d["C"][1]))
      .attr("fill", "MediumPurple");

    bars
      .append("rect")
      .attr("x", 2)
      .attr("y", d => barChartScale(d["A"][1] + d["G"][1] + d["C"][1]))
      .attr("width", barWidth - bar_spacing)
      .attr("height", d => barChartScale(d["T"][1]))
      .attr("fill", "LightBlue");
  }

  render() {
    return (
      <div
        id={"alignmentjs-siteBarPlot-div"}
        className="-container"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
      >
        <svg
          width={this.props.width}
          height={this.props.height}
          id={"alignmentjs-siteBarPlot"}
        />
      </div>
    );
  }
}

StackedSiteBarPlot.defaultProps = {
  id: "alignmentjs",
  padding: { top: 10, bottom: 15 }
};

module.exports = StackedSiteBarPlot;
