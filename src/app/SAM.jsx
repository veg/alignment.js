import React, { Component } from "react";

function VariantCaller(props) {
  return <h1>Variant calling example will go here.</h1>;
}

class SAMViewer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h1>SAM viewer will go here.</h1>;
  }
}

module.exports.SAMViewer = SAMViewer;
module.exports.VariantCaller = VariantCaller;
