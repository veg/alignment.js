import React, { Component } from "react";

function Immunology(props) {
  return <h1>Immunology example will go here.</h1>;
}

function HIV(props) {
  return <h1>HIV example will go here.</h1>;
}

class FNAViewer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h1>FNA viewer will go here.</h1>;
  }
}

module.exports.FNAViewer = FNAViewer;
module.exports.Immunology = Immunology;
module.exports.HIV = HIV;
