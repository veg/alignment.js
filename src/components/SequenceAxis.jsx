import React, { Component } from "react";
const $ = require("jquery");

function BaseSequenceAxis(props) {
  const { sequence_data, label_padding, site_size, width } = props,
    labels = sequence_data.map(record => record.header);
  return (
    <g
      style={{
        fontFamily: "Courier",
        fontSize: 14
      }}
      transform={`translate(${props.translateX}, ${props.translateY})`}
    >
      {labels.map((label, i) => {
        return (
          <text
            x={width - label_padding}
            y={(i + 1) * site_size}
            textAnchor="end"
            dy={-site_size / 3}
            key={i}
            fill={props.fill ? props.fill[i] : "black"}
            onClick={props.onClick(label, i)}
            fontWeight={props.bold ? "bold" : "normal"}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
}

BaseSequenceAxis.defaultProps = {
  translateX: 0,
  translateY: 0,
  label_padding: 5,
  site_size: 20,
  onClick: (label, i) => () => null
};

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
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
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
      alignment_height = site_size * number_of_sequences;
    return (
      <div
        id={this.div_id}
        className="alignmentjs-container"
        style={styles}
        onWheel={e => this.handleWheel(e)}
      >
        <svg id="alignmentjs-labels" width={width} height={alignment_height}>
          <BaseSequenceAxis {...this.props} />
        </svg>
      </div>
    );
  }
}

SequenceAxis.defaultProps = {
  label_padding: 10,
  site_size: 20,
  id: "alignmentjs",
  sender: "main",
  onClick: (label, i) => () => null
};

export default SequenceAxis;
export { BaseSequenceAxis };
