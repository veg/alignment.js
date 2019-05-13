import React, { Component } from "react";
import { text } from "d3-fetch";

import fastaParser from "../../helpers/fasta";
import SVGAlignment from "../../SVGAlignment.jsx";
import Button from "../../components/Button.jsx";
import { save as saveSVG } from "d3-save-svg";
import { saveSvgAsPng as savePNG } from "save-svg-as-png";

class SVGAlignmentExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null
    };
  }
  savePNG() {
    savePNG(document.getElementById("alignment-js-svg"), "alignment.png");
  }
  saveSVG() {
    saveSVG.save(document.getElementById("alignment-js-svg"), {
      filename: "alignment.svg"
    });
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
        <div>
          <h1>SVG Alignment</h1>
          <Button label="Save as SVG" onClick={() => this.saveSVG()} />
          <Button label="Save as PNG" onClick={() => this.savePNG()} />
        </div>

        <SVGAlignment sequence_data={this.state.sequence_data} />
      </div>
    );
  }
}

module.exports = SVGAlignmentExample;
