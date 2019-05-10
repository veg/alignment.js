import React, { Component } from "react";
import { flatten } from "underscore";
import {
  nucleotide_color,
  nucleotide_text_color,
  amino_acid_color,
  amino_acid_text_color
} from "./../helpers/colors";

function BaseSVGAlignment(props) {
  const { sequence_data, site_size } = props;
  if (!sequence_data) return <g />;
  const characters = flatten(
    sequence_data.map((sequence, i) => {
      return sequence.seq.split("").map((character, j) => {
        const x = site_size * j,
          y = site_size * i,
          half_site_size = site_size / 2,
          g_translate = `translate(${x},${y})`,
          text_translate = `translate(${half_site_size}, ${half_site_size})`;
        return (
          <g transform={g_translate} key={[i, j]}>
            <rect
              x={0}
              y={0}
              width={site_size + 1}
              height={site_size + 1}
              fill={nucleotide_color(character)}
            />
            <text
              transform={text_translate}
              fill={nucleotide_text_color(character)}
              textAnchor="middle"
              dy=".25em"
            >
              {character}
            </text>
          </g>
        );
      });
    })
  );
  return (
    <g
      style={{
        width: site_size * sequence_data[0].seq.length,
        height: site_size * sequence_data.length,
        fontFamily: "Courier"
      }}
      transform={`translate(${props.translateX},0)`}
    >
      {characters}
    </g>
  );
}

BaseSVGAlignment.defaultProps = {
  site_size: 20
};

module.exports = BaseSVGAlignment;
