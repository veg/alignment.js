import React, { Component } from "react";
import { text } from "d3-fetch";

import fastaParser from "../../helpers/fasta";
import SVGAlignment from "../../SVGAlignment.jsx";

class SVGAlignmentExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null
    };
  }
  componentDidMount() {
    text("data/CD2-slim.fasta").then(data => {
      const sequence_data = fastaParser(data);
      this.setState({ sequence_data });
    });
  }
  render() {
    return (
      <div>
        <h1>SVG Alignment</h1>
        <SVGAlignment sequence_data={this.state.sequence_data} />
      </div>
    );
  }
}

module.exports = SVGAlignmentExample;
