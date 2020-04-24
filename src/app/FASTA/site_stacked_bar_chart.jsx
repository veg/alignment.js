import React from "react";
import { range } from "d3";

import SiteStackedBarChart from "../../SiteStackedBarChart.jsx";
import fastaParser from "../../helpers/fasta";
import DataFetcher from "../../components/DataFetcher.jsx";

function Spreader(props) {
  // Quick wrapper around DataFetcher for multiple props (potential feature)
  return <SiteStackedBarChart {...props.data} label="Nucleotide frequency" />;
}

export default function() {
  return (
    <div>
      <h1>Site Stacked Bar Chart</h1>
      <DataFetcher
        source="data/CD2.fasta"
        modifier={fasta => {
          const sequence_data = fastaParser(fasta),
            data = range(sequence_data.number_of_sites).map(i => {
              const counts = sequence_data.map(record => record.seq[i]).reduce(
                  (acc, curr) => {
                    acc[curr] += 1;
                    return acc;
                  },
                  { A: 0, C: 0, G: 0, T: 0, "-": 0 }
                ),
                total = counts["A"] + counts["C"] + counts["G"] + counts["T"];
              return [
                counts["A"] / total,
                counts["C"] / total,
                counts["G"] / total,
                counts["T"] / total
              ];
            });
          return { sequence_data, data };
        }}
      >
        <Spreader />
      </DataFetcher>
    </div>
  );
}
