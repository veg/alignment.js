import React, { Component } from "react";

function AminoAcid(props) {
  return <h1>Amino acid example will go here.</h1>;
}

function Highlight(props) {
  return <h1>Highlight example will go here.</h1>;
}

function StartAtSiteAndSequence(props) {
  return <h1>Starting at site and sequence example will go here.</h1>;
}

function Lowercase(props) {
  return <h1>Lower case example will go here.</h1>;
}

class FASTAViewer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h1>FASTA viewer will go here.</h1>;
  }
}

module.exports.FASTAViewer = FASTAViewer;
module.exports.AminoAcid = AminoAcid;
module.exports.Highlight = Highlight;
module.exports.StartAtSiteAndSequence = StartAtSiteAndSequence;
module.exports.Lowercase = Lowercase;
