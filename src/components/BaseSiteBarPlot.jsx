import React from "react";
const d3 = require("d3");
const $ = require("jquery");

class BaseSiteBarPlot extends React.Component {
  constructor(props) {
    super(props);

    // d3 variables used by multiple methods
    this.max_value = this.props.max_value && d3.max(this.props.data);
    this.padding_bottom = 15;
    this.chart_height = this.props.height - this.padding_bottom;
  }

  componentDidMount() {
    this.createBarPlot();
    this.setListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    this.transitionBarPlot();
  }

  createBarPlot() {
    var data = this.props.data;
    var displayWidth = this.props.displayWidth;
    var chart_height = this.chart_height;

    var barChartScale = d3
      .scaleLinear()
      .domain([this.max_value, 0])
      .range([0, this.chart_height]);

    var barWidth = this.props.siteSize;

    var chart = d3
      .select(".baseSiteBarPlot")
      .attr("width", displayWidth)
      .attr("height", this.chart_height + this.padding_bottom);

    var bar = chart
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ", 10)";
      })
      .append("rect")
      .attr("class", "bars")
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return chart_height - barChartScale(d);
      })
      .attr("width", barWidth - 2)
      .attr("fill", this.props.fillColor)
      .attr("stroke", this.props.outlineColor);
  }

  transitionBarPlot() {
    var data = this.props.data;
    var chart_height = this.chart_height;

    var barChartScale = d3
      .scaleLinear()
      .domain([this.max_value, 0])
      .range([0, this.chart_height]);

    var barChartTransition = d3
      .transition()
      .duration(500)
      .ease(d3.easeSin);

    d3
      .selectAll(".bars")
      .data(this.props.data)
      .transition(barChartTransition)
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return chart_height - barChartScale(d);
      })
      .style("fill", this.props.fillColor)
      .style("stroke", this.props.outlineColor);
  }

  setListeners() {
    $("#alignmentjs-siteBarPlot-div").scrollLeft(this.props.x_pixel);

    document
      .getElementById("alignmentjs-siteBarPlot-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-siteBarPlot-div").scrollLeft(e.detail.x_pixel);
      });
  }

  render() {
    return (
      <div
        id={this.props.id + "-siteBarPlot-div"}
        className="-container"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
      >
        <svg
          className="baseSiteBarPlot"
          width={this.props.displayWidth}
          height={this.props.height}
          id={this.props.id + "siteBarPlot"}
        />
      </div>
    );
  }
}

BaseSiteBarPlot.defaultProps = {
  id: "alignmentjs"
};

module.exports = BaseSiteBarPlot;
