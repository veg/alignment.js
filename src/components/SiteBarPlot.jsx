import React, { Component } from "react";

const d3 = require("d3");
const $ = require("jquery");

class SiteBarPlot extends Component {
  componentDidMount() {
    document
      .getElementById("alignmentjs-siteBarPlot-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-siteBarPlot-div").scrollLeft(e.detail.x_pixel);
      });
    this.initialize();
  }

  componentDidUpdate() {
    this.initialize();
  }

  initialize = () => {
    var siteBarPlot_svg = d3
      .select("#alignmentjs-siteBarPlot")
      .attr("width", this.props.width)
      .attr("height", this.props.height);
    var bars = siteBarPlot_svg
      .selectAll(".bar")
      .data(this.props.siteData)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d, i) => "translate(" + i * 20 + ",0)");
    bars
      .append("rect")
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", 18)
      .attr("height", d => this.barAxisScale(d))
      .attr("fill", "LightPink");
  };

  barAxisScale(d) {
    return d * 60;
  }

  initializeOld() {
    if (this.props.sequence_data) {
      const { width, height, site_size } = this.props;
      d3
        .select("#alignmentjs-axis-div")
        .style("width", width + "px")
        .style("height", height + "px");
      const { number_of_sites } = this.props.sequence_data,
        alignment_width = site_size * number_of_sites;

      var axis_scale = d3
        .scaleLinear()
        .domain([1, number_of_sites])
        .range([site_size / 2, alignment_width - site_size / 2]);

      var axis_svg = d3.select("#alignmentjs-axis");
      axis_svg.html("");
      axis_svg.attr("width", alignment_width).attr("height", height);

      var axis = d3
        .axisTop()
        .scale(axis_scale)
        .tickValues(d3.range(1, number_of_sites, 2));

      axis_svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height - 1})`)
        .call(axis);

      $("#alignmentjs-siteBarPlot-div").scrollLeft(this.props.x_pixel);
    }
  }

  render() {
    return (
      <div
        id="alignmentjs-siteBarPlot-div"
        className="grid-container"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
      >
        {/*
          <svg
            id="alignmentjs-siteBarPlot-Axis"
            width={this.props.sequenceAxisWidth}
            height={this.props.height}
          />
          */}
        <svg
          id="alignmentjs-siteBarPlot"
          width={this.props.width - this.props.sequenceAxisWidth}
          height={this.props.height}
        />
      </div>
    );
  }
}

SiteBarPlot.defaultProps = {
  x_pixel: 0,
  site_size: 20
};

module.exports = SiteBarPlot;
