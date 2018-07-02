import React, { Component } from "react";

const d3 = require("d3");

class TestBarPlot extends Component {
  componentDidMount() {
    this.createBarChart();
  }

  createBarChart() {
    var data = [2, 4, 8, 16, 32];

    var barChartScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 400]);

    d3
      .select(".chart")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function(d) {
        return barChartScale(d) + "px";
      })
      .style("padding", "4px")
      .style("margin", "1px")
      .style("background-color", "blue")
      .style("color", "white")
      .style("text-align", "right")
      .text(function(d) {
        return d;
      });
  }

  render() {
    return (
      <div>
        <p>A Test Bar Plot to Get Familiar with D3</p>
        <div className="manualChart">
          <p>Manually</p>
          <div
            style={{
              width: "20px",
              padding: "4px",
              margin: "1px",
              backgroundColor: "blue",
              color: "white",
              textAlign: "right"
            }}
          >
            2
          </div>
          <div
            style={{
              width: "40px",
              padding: "4px",
              margin: "1px",
              backgroundColor: "blue",
              color: "white",
              textAlign: "right"
            }}
          >
            4
          </div>
          <div
            style={{
              width: "80px",
              padding: "4px",
              margin: "1px",
              backgroundColor: "blue",
              color: "white",
              textAlign: "right"
            }}
          >
            8
          </div>
          <div
            style={{
              width: "160px",
              padding: "4px",
              margin: "1px",
              backgroundColor: "blue",
              color: "white",
              textAlign: "right"
            }}
          >
            16
          </div>
          <div
            style={{
              width: "320px",
              padding: "4px",
              margin: "1px",
              backgroundColor: "blue",
              color: "white",
              textAlign: "right"
            }}
          >
            32
          </div>
        </div>
        <div className="chart">
          <p>with D3 using HTML</p>
        </div>
        <div>
          <p>manually with SVG</p>
          <svg className="chart" style={{ width: "420", height: "120" }}>
            <g transform="translate(0,0)">
              <rect style={{ fill: "blue", width: "40", height: "19" }} />
              <text style={{ fill: "white", x: "37", y: "9.5", dy: ".35em" }}>
                4
              </text>
            </g>
          </svg>
        </div>
        <svg
          id="TestBarPlot"
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

module.exports = TestBarPlot;
