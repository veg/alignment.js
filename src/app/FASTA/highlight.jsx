import React, { Component } from "react";
import { text } from "d3";

import Alignment from "../../Alignment.jsx";
import fastaParser from "../../helpers/fasta.js";
import { nucleotide_color } from "../../helpers/colors.js";

function highlight_codon_color(character, position, header) {
  if (header == "DUCK_VIETNAM_272_2005" && Math.floor((position - 1) / 3) == 3)
    return "red";
  return character == "-" ? "white" : "GhostWhite";
}

function highlight_codon_text_color(character, position, header) {
  return character == "G" ? "Gold" : nucleotide_color(character);
}

class Highlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null
    };
  }
  componentDidMount() {
    text("data/Flu.fasta").then(data => {
      const sequence_data = fastaParser(data);
      this.setState({ sequence_data });
    });
  }
  render() {
    return (
      <div>
        <div>
          <h1>Highlighting specific sites</h1>
        </div>
        <Alignment
          fasta={this.state.sequence_data}
          site_color={highlight_codon_color}
          text_color={highlight_codon_text_color}
        />
      </div>
    );
  }
}

module.exports = Highlight;
