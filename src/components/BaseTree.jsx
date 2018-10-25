import React, { Component } from "react";
const d3 = require("phylotree/node_modules/d3");
const $ = require("jquery");

import "phylotree/phylotree.css";
require("phylotree");

class BaseTree extends Component {
  componentDidMount() {
    document
      .getElementById("alignmentjs-tree-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-tree-div").scrollTop(e.detail.y_pixel);
      });
    if (this.props.phylotree) {
      this.renderTree(this.props);
    }
  }
  componentDidUpdate() {
    if (this.props.phylotree) {
      this.renderTree(this.props);
    }
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  renderTree(props) {
    this.props.phylotree.svg(d3.select("#alignmentjs-tree")).layout();
  }
  render() {
    return (
      <div
        id={this.props.divID}
        style={{ overflowY: "scroll" }}
        onWheel={e => this.handleWheel(e)}
      >
        <svg id="alignmentjs-tree" />
      </div>
    );
  }
}

BaseTree.defaultProps = {
  sender: "main",
  divID: "alignmentjs-tree-div"
};

module.exports = BaseTree;
