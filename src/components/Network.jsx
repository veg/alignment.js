import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { path } from "d3-path";
import _ from "underscore";

import { bidirectional_scroll, handle_wheel } from "../helpers/scroll_events";

class Network extends Component {
  componentDidMount() {
    bidirectional_scroll.call(this);
  }
  handleWheel(e) {
    handle_wheel.call(this, e);
  }
  render() {
    if (!this.props.nodes || !this.props.links) return <div />;
    const { full_width } = this.props;
    const container_style = {
        width: this.props.width,
        height: this.props.height,
        overflow: "scroll"
      },
      node_map = _.object(this.props.nodes.map(node => [node.id, node]));
    return (
      <div
        id={this.props.div_id}
        style={container_style}
        onWheel={e => this.handleWheel(e)}
      >
        <svg width={full_width} height={this.props.full_height}>
          <defs>
            <marker
              id="triangle"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerUnits="strokeWidth"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f00" />
            </marker>
          </defs>
          {this.props.nodes.map(node => {
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  fill={node.fill || "LightGrey"}
                  stroke={node.stroke || "Grey"}
                  strokeWidth={2}
                  r={5}
                />
                <line
                  x1={node.x}
                  x2={full_width}
                  y1={node.y}
                  y2={node.y}
                  stroke="grey"
                  strokeWidth={1}
                  strokeDasharray={4}
                />
              </g>
            );
          })}
          {this.props.links.map((link, i) => {
            const source_x = node_map[link.source].x,
              source_y = node_map[link.source].y,
              target_x = node_map[link.target].x,
              target_y = node_map[link.target].y,
              control_x = Math.max(Math.min(source_x, target_x) - 75, 0),
              control_y = (source_y + target_y) / 2,
              link_path = path();
            link_path.moveTo(source_x, source_y);
            link_path.quadraticCurveTo(
              control_x,
              control_y,
              target_x,
              target_y
            );
            return (
              <path
                key={i}
                d={link_path}
                fill="none"
                stroke="black"
                strokeWidth={2}
                opacity={0.5}
                markerEnd="url(#triangle)"
              />
            );
          })}
        </svg>
      </div>
    );
  }
}

Network.defaultProps = {
  sender: "main",
  div_id: "alignmentjs-network"
};

export default Network;
