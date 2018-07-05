import React from "react";
const d3 = require("d3");
const $ = require("jquery");

class BaseSiteBarPlot extends React.Component {
  constructor(props) {
    super(props);
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
    var max_value = this.props.max_value && d3.max(data);
    var padding_bottom = 15;
    var height = this.props.height - padding_bottom;

    var barChartScale = d3
      .scaleLinear()
      .domain([max_value, 0])
      .range([0, height]);

    var barWidth = this.props.siteSize;

    var chart = d3
      .select(".baseSiteBarPlot")
      .attr("width", displayWidth)
      .attr("height", height + padding_bottom);

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
        return height - barChartScale(d);
      })
      .attr("width", barWidth - 2)
      .attr("fill", this.props.fillColor)
      .attr("stroke", this.props.outlineColor);
  }

  transitionBarPlot() {
    var data = this.props.data;
    var height = this.props.height;
    var max_value = this.props.max_value && d3.max(data);

    var barChartScale = d3
      .scaleLinear()
      .domain([max_value, 0])
      .range([0, height]);

    var changeHeight = d3
      .transition()
      .duration(500)
      .ease(d3.easeSin);

    d3
      .selectAll(".bars")
      .data(this.props.data)
      .transition(changeHeight)
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return height - barChartScale(d);
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
