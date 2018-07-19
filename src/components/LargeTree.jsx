import React, { Component } from "react";
import "phylotree/phylotree.css";

const d3 = require("phylotree/node_modules/d3");

require("phylotree");

class LargeTree extends Component {
  render() {
    return <svg id="main_tree" />;
  }
}

module.exports = LargeTree;
