import React from "react";

import { line } from "d3-shape";


function Branch(props) {

  const { xScale, yScale, colorScale, showLabel, setTooltip } = props,
    { source, target } = props.link,
    source_x = xScale(source.data.abstract_x),
    source_y = yScale(source.data.abstract_y),
    target_x = xScale(target.data.abstract_x),
    target_y = yScale(target.data.abstract_y),
    tracer_x2 = props.alignTips == "right" ?
      props.width - (target.data.text_width || 0) :
      target_x,
    data = [
      [source_x, source_y],
      [source_x, target_y],
      [target_x, target_y]
    ],
    branch_line = line()
      .x(d=>d[0])
      .y(d=>d[1]),
    computed_branch_styles = props.branchStyler ?
      props.branchStyler(target.data) :
    target.data.annotation && colorScale ? {
      stroke: colorScale(target.data.annotation)
    } : {},
    all_branch_styles = Object.assign(
      {}, props.branchStyle, computed_branch_styles
    ),
    label_style = target.data.name && props.labelStyler ?
      props.labelStyler(target.data) :
      {} ;
  return (<g className="node"
  >
    <path
      className="rp-branch"
      fill="none"
      d={branch_line(data)}
      onClick={() => props.onClick(props.link)}
      {...all_branch_styles}
      onMouseMove={props.tooltip ? e => {
        setTooltip({
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          data: target.data
        });
      } : undefined}
      onMouseOut={props.tooltip ? e => {
        setTooltip(false);
      } : undefined}
    />
    {showLabel ? <line
      x1={target_x}
      x2={tracer_x2}
      y1={target_y}
      y2={target_y}
      className="rp-branch-tracer"
    /> : null}
    {showLabel ? <text
      x={tracer_x2 + 5}
      y={target_y}
      textAnchor="start"
      alignmentBaseline="middle"
      {...Object.assign({}, props.labelStyle, label_style)}
      className="rp-label"
    >{target.data.name.slice(0, props.maxLabelWidth)}</text> : null}
  </g>);
}

Branch.defaultProps = {
  branchStyle: {
    strokeWidth: 2,
    stroke: "grey"
  },
  labelStyle: {
  }
}

export default Branch;
