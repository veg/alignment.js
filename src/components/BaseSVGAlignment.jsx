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
  const site_color = props.amino_acid ? amino_acid_color : props.site_color,
    text_color = props.amino_acid ? amino_acid_text_color : props.text_color;
  const characters = flatten(
    sequence_data.map((sequence, i) => {
      return sequence.seq.split("").map((character, j) => {
        const x = site_size * j,
          y = site_size * i,
          half_site_size = site_size / 2,
          g_translate = `translate(${x}, ${y})`,
          text_translate = `translate(${half_site_size}, ${half_site_size})`;
        return (
          <g transform={g_translate} key={[i, j]}>
            <rect
              x={0}
              y={0}
              width={site_size + 1}
              height={site_size + 1}
              fill={site_color(character, j, sequence.header)}
            />
            <text
              transform={text_translate}
              fill={text_color(character)}
              textAnchor="middle"
              dy=".25em"
            >
              {props.molecule(character, j, sequence.header)}
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
      transform={`translate(${props.translateX},${props.translateY})`}
    >
      {characters}
    </g>
  );
}

BaseSVGAlignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  molecule: mol => mol,
  site_size: 20,
  translateX: 0,
  translateY: 0
};

module.exports = BaseSVGAlignment;
