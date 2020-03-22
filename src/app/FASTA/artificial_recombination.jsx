import React, { Component } from "react";
import { text } from "d3-fetch";
import { AxisTop } from "d3-react-axis";
import * as d3 from "d3";

import fastaParser from "../../helpers/fasta";
import BaseSVGAlignment from "../../components/BaseSVGAlignment.jsx";
import { BaseSequenceAxis } from "../../components/SequenceAxis.jsx";
import Button from "../../components/Button.jsx";
import { save as saveSVG } from "d3-save-svg";
import { saveSvgAsPng as savePNG } from "save-svg-as-png";
import { nucleotide_colors } from "../../helpers/colors";

var references = fastaParser(`>89.6
AAGCCGAGGGGAACTAATTA
>HXB2
AGACAAGTATCTACTATTCG
>JRCSF
AGACCGATATCCTCTGTTTA
>NL43
GGATAAATATCTACCATCTG
>YU2
GGACAAATATCCAATATTTA
`),
  superreads = fastaParser(`>superread-1_weight-52
AGACCGATATCCTC------
>superread-2_weight-9
AGACAAGTATCTAC------
>superread-4_weight-10
GGATAAATATCTAC------
>superread-6_weight-13
GGATAAATATCCTC------
>superread-8_weight-26
AGACAAATATCCAA------
>superread-9_weight-46
AGACCGATATCCAA------
>superread-11_weight-14
GGACAAATATCCTC------
>superread-12_weight-13
AGACAAATATCTAC------
>superread-13_weight-30
AGACCGATATCTAC------
>superread-14_weight-7
GGACCGATATCCTC------
>superread-15_weight-7
GGATCGATATCCTC------
>superread-17_weight-15
AGACAAGTATCCTC------
>superread-20_weight-20
GGACAAATATCCAA------
>superread-21_weight-9
AGATAAATATCTAC------
>superread-42_weight-32
GGATAAATAT----------
>superread-43_weight-13
AAGCCGAGGG----------
>superread-45_weight-20
AGACAAGTAT----------
>superread-46_weight-43
AGACCGATAT----------
>superread-48_weight-17
GGACAAATAT----------
>superread-51_weight-11
AGACAAATAT----------
`),
  weights = superreads.map(sr => +sr.header.split("_")[1].split("-")[1]);
superreads.forEach((sr, i) => {
  sr.header = "superread-" + (i + 1);
});

function AR() {
  const site_size = 20,
    number_of_sequences = 25,
    number_of_sites = 20,
    bar_width = 100,
    axis_height = 35,
    reference_width = 110,
    reference_height = 5 * site_size,
    alignment_width = number_of_sites * site_size,
    right_padding = 10,
    width = reference_width + alignment_width + bar_width + right_padding,
    height = axis_height + site_size * number_of_sequences,
    scale = d3
      .scaleLinear()
      .domain([0, d3.max(weights)])
      .range([0, bar_width]),
    chosen_superread_index = 8,
    chosen_superread = superreads[chosen_superread_index],
    label_fills = Array(superreads.length).fill("black");
  label_fills[chosen_superread_index] = "red";
  return (
    <div>
      <div>
        <h1>Artificial Recombination</h1>
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
        <text
          x={reference_width + alignment_width + bar_width / 2}
          y={10}
          textAnchor="middle"
          fontFamily="Courier"
        >
          Weight
        </text>
        <AxisTop
          transform={`translate(${reference_width +
            alignment_width}, ${axis_height})`}
          scale={scale}
          tickValues={[10, 20, 30, 40, 50]}
        />
        {weights.map((weight, i) => {
          return (
            <rect
              key={i}
              x={reference_width + alignment_width}
              y={(i + 5) * site_size + axis_height}
              width={scale(weight)}
              height={site_size}
              stroke="black"
              fill={i == chosen_superread_index ? "red" : "pink"}
            />
          );
        })}
        <g transform={`translate(0, ${axis_height})`}>
          <BaseSequenceAxis
            width={reference_width}
            sequence_data={references}
            site_size={site_size}
            fill={["black", "red", "red", "black", "black"]}
            bold
          />
        </g>
        <g transform={`translate(${reference_width}, ${axis_height})`}>
          <BaseSVGAlignment
            sequence_data={references}
            site_color={(mol, site, header) => {
              return mol == chosen_superread.seq[site]
                ? "#EEE"
                : nucleotide_colors[mol];
            }}
            molecule={(mol, site, header) => {
              return mol == chosen_superread.seq[site] ? "." : mol;
            }}
          />
        </g>
        <g transform={`translate(0, ${reference_height + axis_height})`}>
          <BaseSequenceAxis
            width={reference_width}
            sequence_data={superreads}
            site_size={site_size}
            fill={label_fills}
          />
        </g>
        <g
          transform={`translate(${reference_width}, ${reference_height +
            axis_height})`}
        >
          <BaseSVGAlignment
            sequence_data={superreads}
            site_color={(mol, site, header) => {
              if (header == "superread-9") return nucleotide_colors[mol];
              if (mol == "-") return nucleotide_colors["-"];
              return mol == chosen_superread.seq[site]
                ? "#EEE"
                : nucleotide_colors[mol];
            }}
            molecule={(mol, site, header) => {
              if (header == "superread-9") return mol;
              if (mol == "-") return "-";
              return mol == chosen_superread.seq[site] ? "." : mol;
            }}
          />
        </g>
      </svg>
    </div>
  );
}

export default AR;
