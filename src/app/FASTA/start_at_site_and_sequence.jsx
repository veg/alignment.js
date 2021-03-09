import React, { Component } from "react";
import { text } from "d3";

import Alignment from "../../Alignment.jsx";
import fastaParser from "../../helpers/fasta.js";

class StartAtSiteAndSequence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null,
      site: 100,
      header: "CY010004"
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
        <input
          type="number"
          value={this.state.site}
          onChange={e => this.setState({ site: e.target.value })}
        />
        <Alignment
          fasta={this.state.sequence_data}
          centerOnSite={this.state.site}
          centerOnHeader={this.state.header}
        />
      </div>
    );
  }
}

export default StartAtSiteAndSequence;
