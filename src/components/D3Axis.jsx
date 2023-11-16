import React from "react";

var top = 1,
  right = 2,
  bottom = 3,
  left = 4;

function identity(x) {
  return x;
}

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function Tick(props) {
  const { value, x, k, tickSizeInner, spacing, orient, transform, position, format } = props,
    dy = orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em",
    line_props = {},
    text_props = { dy: dy };
  line_props[x + "2"] = k * tickSizeInner;
  text_props[x] = k * spacing;
  return (<g
    className="tick"
    transform={transform(position(value))}
  >
    <line stroke="currentColor" {...line_props} />
    <text fill="currentColor" {...text_props}>{format(value)}</text>
  </g>);
}

function Axis(props) {
  const { scale, orient, ticks, tickValues, tickFormat, tickSizeInner, tickSizeOuter, tickPadding } = props;

  var k = orient === top || orient === left ? -1 : 1,
    x = orient === left || orient === right ? "x" : "y",
    transform = orient === top || orient === bottom ? translateX : translateY,
    values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, ticks) : scale.domain()) : tickValues,
    format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, ticks) : identity) : tickFormat,
    spacing = Math.max(tickSizeInner, 0) + tickPadding,
    range = scale.range(),
    range0 = +range[0] + 0.5,
    range1 = +range[range.length - 1] + 0.5,
    position = (scale.bandwidth ? center : number)(scale.copy()),
    d = orient === left || orient == right
      ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
      : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1);
  return (<g
    transform={props.transform}
    fill="none"
    fontSize={10}
    fontFamily="sans-serif"
    textAnchor={orient === right ? "start" : orient === left ? "end" : "middle"}
  >
    <path className="domain" stroke="currentColor" d={d} />
    {values.map((value, index) => {
      return (<Tick
        key={"tick-"+index}
        value={value}
        x={x}
        k={k}
        tickSizeInner={tickSizeInner}
        spacing={spacing}
        orient={orient}
        transform={transform}
        position={position}
        format={format}
      />);
    })}
  </g>);
}

Axis.defaultProps = {
  tickArguments: [],
  tickValues: null,
  tickFormat: null,
  tickSizeInner: 6,
  tickSizeOuter: 6,
  tickPadding: 3,
  transform: "translate(0, 0)"
};

function AxisTop(props) {
  return <Axis orient={top} {...props} />;
}

function AxisRight(props) {
  return <Axis orient={right} {...props} />;
}

function AxisBottom(props) {
  return <Axis orient={bottom} {...props} />;
}

function AxisLeft(props) {
  return <Axis orient={left} {...props} />;
}

export {
  AxisTop,
  AxisRight,
  AxisBottom,
  AxisLeft
};
