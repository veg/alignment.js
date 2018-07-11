import React, { Component } from "react";

const $ = require("jquery");

class SequenceAxis extends Component {
  constructor(props) {
    super(props);
    this.div_id = props.id + "-labels-div";
  }
  componentDidMount() {
    const { div_id } = this;
    document
      .getElementById(div_id)
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $(`#${div_id}`).scrollTop(e.detail.y_pixel);
      });
  }
  componentDidUpdate(nextProps) {
    $(`#${this.div_id}`).scrollTop(this.props.y_pixel);
  }
  render() {
    if (!this.props.sequence_data) {
      return <div id={this.div_id} className="alignmentjs-container" />;
    }
    const { width, height, site_size } = this.props,
      number_of_sequences = this.props.sequence_data.length,
      styles = {
        overflowX: "scroll",
        overflowY: "hidden",
        width: width,
        height: height
      },
      alignment_height = site_size * number_of_sequences,
      labels = this.props.sequence_data.map(record => record.header);
    return (
      <div id={this.div_id} className="alignmentjs-container" style={styles}>
        <svg id="alignmentjs-labels" width={width} height={alignment_height}>
          {labels.map((label, i) => {
            return (
              <text
                x={width - this.props.label_padding}
                y={(i + 1) * site_size}
                textAnchor="end"
                dy={-site_size / 3}
                key={i}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  }
}

SequenceAxis.defaultProps = {
  label_padding: 10,
  id: "alignmentjs"
};

module.exports = SequenceAxis;
