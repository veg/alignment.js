import React from "react";

import SequenceBarChart from "../../SequenceBarChart.jsx";
import fastaParser from "../../helpers/fasta";
import DataFetcher from "../../components/DataFetcher.jsx";

function Spreader(props) {
  // Quick wrapper around DataFetcher for multiple props (potential feature)
  return <SequenceBarChart {...props.data} label="Quasispecies frequency" />;
}

export default function() {
  return (
    <div>
      <h1>Sequence Bar Chart</h1>
      <DataFetcher
        source="data/quasispecies.fasta"
        modifier={fasta => {
          const sequence_data = fastaParser(fasta),
            data = sequence_data.map(
              record => +record.header.split("_")[1].split("-")[1]
            );
          sequence_data.forEach(record => {
            record.header = record.header.split("_")[0];
          });
          return { sequence_data, data };
        }}
      >
        <Spreader />
      </DataFetcher>
    </div>
  );
}
