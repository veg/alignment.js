import React, { Component } from "react";
import { text } from "d3-fetch";

import fastaParser from "../../helpers/fasta";
import BaseSVGAlignment from "../../components/BaseSVGAlignment.jsx";
import { BaseSequenceAxis } from "../../components/SequenceAxis.jsx";
import Button from "../../components/Button.jsx";
import { save as saveSVG } from "d3-save-svg";
import { saveSvgAsPng as savePNG } from "save-svg-as-png";
import { nucleotide_colors } from "../../helpers/colors";

const desired_fasta = fastaParser(`>Reference
GTCACAATAAAGATAGGGGGGCAACTAAAGGAAGTTCTATTAGATACAGGAGCAGAT
>Red strain
GTCACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCAGAT
>Blue strain
GTCACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCAGAT `),
  given_fasta = fastaParser(`>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-42723
--CACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATA-AGGAG-----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-77746
--CACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAG-----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-53928
--CACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAG-----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-85956
--CACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAG-----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-69431
--CACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAG-----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-104273+B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-121232
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-133528+B.US.2008.HIV_US_BID-V4123_2008.JQ403034-149880
---ACAGTAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-95752+B.US.2008.HIV_US_BID-V4123_2008.JQ403034-12964
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-126702
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-66696
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-71718
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-84187
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-7743
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-117729
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-63877
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-149880
---ACAATAAAGGTAGGAGGGCAATTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-132961
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-18355
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-1660
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-104273
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-108114
---ACAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-148504
---ACAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGC----
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-68385+B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-7246
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-138624+B.US.2008.HIV_US_BID-V4123_2008.JQ403034-47215
----CAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-135888
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-45220
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-103700
----CAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-88614
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-8325
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-588
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-135913
----CAATAAAGGGAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.CH.2002.HIV_CH_BID-V3527_2002.JQ403021-127315
----CAGTAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
>B.US.2008.HIV_US_BID-V4123_2008.JQ403034-109382
----CAATAAAGGTAGGAGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCA---
  `).map((record, i) => {
    record.header = "Read " + (i + 1);
    return record;
  });

function Quasispecies() {
  const site_size = 15,
    reference_width = 100,
    label_height = 60,
    padding = 5,
    width = reference_width + 57 * site_size,
    height = label_height + 3 * site_size + padding + 33 * site_size;
  return (
    <div>
      <div>
        <h1>Quasispecies</h1>
        <Button
          label="Save as PNG"
          onClick={() =>
            savePNG(
              document.getElementById("alignment-js-svg"),
              "alignment.png"
            )
          }
        />
      </div>

      <svg id="alignment-js-svg" width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="white" />
        <g transform={`translate(${reference_width + 6.5 * site_size}, 20)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Covariable
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(${reference_width + 12.5 * site_size}, 40)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Covariable
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(${reference_width + 17.5 * site_size}, 20)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Covariable
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(${reference_width + 24.5 * site_size}, 40)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Base error
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(${reference_width + 34.5 * site_size}, 20)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Variable
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(${reference_width + 46.5 * site_size}, 40)`}>
          <text textAnchor="middle" fontFamily="Courier">
            Deletion
          </text>
          <line
            x1={0}
            x2={0}
            y1={5}
            y2={40}
            stroke="lightgrey"
            strokeWidth={2}
          />
          <circle cx={0} cy={5} fill="black" r={2} />
        </g>
        <g transform={`translate(0, ${2 + label_height})`}>
          <BaseSequenceAxis
            site_size={site_size}
            width={reference_width}
            sequence_data={desired_fasta}
            fill={["black", "red", "blue"]}
          />
        </g>
        <g transform={`translate(${reference_width}, ${label_height})`}>
          <BaseSVGAlignment
            site_size={site_size}
            sequence_data={desired_fasta}
            site_color={(mol, site, header) => {
              if (header == "Reference") return nucleotide_colors[mol];
              return mol == desired_fasta[0].seq[site]
                ? "#EEE"
                : nucleotide_colors[mol];
            }}
            molecule={(mol, site, header) => {
              if (header == "Reference") return mol;
              return mol == desired_fasta[0].seq[site] ? "." : mol;
            }}
          />
        </g>
        <g
          transform={`translate(0, ${3 * site_size +
            padding +
            label_height +
            2})`}
        >
          <BaseSequenceAxis
            site_size={site_size}
            width={reference_width}
            sequence_data={given_fasta}
          />
        </g>
        <g
          transform={`translate(${reference_width}, ${3 * site_size +
            padding +
            label_height})`}
        >
          <BaseSVGAlignment
            site_size={site_size}
            sequence_data={given_fasta}
            site_color={(mol, site, header) => {
              if (header == "Reference") return nucleotide_colors[mol];
              return mol == desired_fasta[0].seq[site]
                ? "#EEE"
                : nucleotide_colors[mol];
            }}
            molecule={(mol, site, header) => {
              if (header == "Reference") return mol;
              return mol == desired_fasta[0].seq[site] ? "." : mol;
            }}
          />
        </g>
      </svg>
    </div>
  );
}

export default Quasispecies;
