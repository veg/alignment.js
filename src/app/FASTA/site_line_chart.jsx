import React from "react";
import { range } from "d3";

import SiteLineChart from "../../SiteLineChart.jsx";
import fastaParser from "../../helpers/fasta";
import DataFetcher from "../../components/DataFetcher.jsx";

function Spreader(props) {
  // Quick wrapper around DataFetcher for multiple props (potential feature)
  return <SiteLineChart {...props.data} label="Nucleotide frequency" />;
}

export default function() {
  return (
    <div>
      <h1>Line Chart</h1>
      <DataFetcher
        source="data/Flu-alignmentviewer.txt"
        modifier={text => {
          const split_lines = text.split("\n"),
            data = JSON.parse(split_lines[0]),
            fasta = split_lines.slice(1).join("\n"),
            sequence_data = fastaParser(fasta);
          return { sequence_data, data };
        }}
      >
        <Spreader />
      </DataFetcher>
    </div>
  );
}
