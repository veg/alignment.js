import React, { Component } from "react";
import { text } from "d3";

import Alignment from "../../Alignment.jsx";
import fastaParser from "../../helpers/fasta.js";

class Lowercase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence_data: null
    };
  }
  componentDidMount() {
    text("data/CVF.fasta").then(data => {
      const sequence_data = fastaParser(data);
      this.setState({ sequence_data });
    });
  }
  render() {
    return (
      <div>
        <div>
          <h1>Display an alignment with lower case letters</h1>
        </div>
        <Alignment fasta={this.state.sequence_data} />
      </div>
    );
  }
}

export default Lowercase;
