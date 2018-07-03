import React from "react";
const d3 = require("d3");

class BaseSequenceBarPlot extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.createBarPlot();
  }

  createBarPlot() {
    var data = this.props.data;
    var height = this.props.height;
    var width = this.props.width;

    var barChartScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);

    var barWidth = height / data.length;

    var chart = d3
      .select(".baseSequencePlot")
      .attr("width", width)
      .attr("height", height);

    var bar = chart
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ",0)";
      });

    bar
      .append("rect")
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return height - barChartScale(d);
      })
      .attr("width", barWidth - 1);
  }

  render() {
    return (
      <div>
        <svg
          className="baseSequenceBarPlot"
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

module.exports = BaseSequenceBarPlot;
