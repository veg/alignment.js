import React, { Component } from "react";
import { text } from "d3";

import Alignment from "../../Alignment.jsx";
import fastaParser from "../../helpers/fasta.js";

class StartAtSiteAndSequence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null
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
          <h1>Begin centered on a given sequence (CY010004) and site (100).</h1>
        </div>
        <Alignment
          fasta={this.state.sequence_data}
          centerOnSite={100}
          centerOnHeader={"CY010004"}
        />
      </div>
    );
  }
}

module.exports = StartAtSiteAndSequence;
