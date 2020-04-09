import React from "react";
import { AxisTop } from "d3-react-axis";

function AlignmentJSAxisTop(props) {
  return (
    <div style={{ width: props.width, height: props.height }}>
      <svg width={props.width} height={props.height}>
        <text
          x={props.width / 2}
          y={props.height / 4}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {props.label}
        </text>
        <AxisTop
          scale={props.scale}
          ticks={props.ticks}
          transform={`translate(0, ${props.height - 1})`}
        />
      </svg>
    </div>
  );
}

AxisTop.defaultProps = {
  ticks: [5]
};

export default AlignmentJSAxisTop;
