import React, { Component } from "react";
import { text } from "d3";

import Alignment from "../../Alignment.jsx";
import fastaParser from "../../helpers/fasta.js";
import {
  amino_acid_color,
  amino_acid_text_color
} from "../../helpers/colors.js";

function Display(props) {
  return (
    <span style={{ marginLeft: 10 }}>
      <b>{props.message}:</b> {props.value}
    </span>
  );
}

class AminoAcid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null,
      clicked_site: null,
      clicked_sequence: null,
      hovered_site: null,
      hovered_sequence: null
    };
  }
  componentDidMount() {
    text("data/H3trunk.fasta").then(data => {
      const sequence_data = fastaParser(data);
      this.setState({ sequence_data });
    });
  }
  render() {
    return (
      <div>
        <div>
          <h1>Click handler</h1>
          <Display
            message="Clicked site"
            value={this.state.clicked_site || "None"}
          />
          <Display
            message="Clicked sequence"
            value={this.state.clicked_sequence || "None"}
          />
          <Display
            message="Hovered site"
            value={this.state.hovered_site || "None"}
          />
          <Display
            message="Hovered sequence"
            value={this.state.hovered_sequence || "None"}
          />
        </div>
        <Alignment
          fasta={this.state.sequence_data}
          onSiteClick={(site, sequence) => {
            this.setState({
              clicked_site: site + 1,
              clicked_sequence: sequence.header
            });
          }}
          onSiteHover={(site, sequence) => {
            this.setState({
              hovered_site: site + 1,
              hovered_sequence: sequence.header
            });
          }}
        />
      </div>
    );
  }
}

export default AminoAcid;
