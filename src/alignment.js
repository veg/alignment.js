import React, { Component } from 'react';
const d3 = require('d3');
const _ = require('underscore');

import fastaParser from './fasta';


class Alignment extends Component {
  constructor(props){
    super(props);
    this.state = { i: 0, j: 0 };
  }
  componentWillReceiveProps(nextProps){
    const fasta = fastaParser(nextProps.fasta),
      label_width = this.props.label_padding + 8.4 * fasta.map(d=>d.header.length)
        .reduce((a,b)=>Math.max(a,b));

    this.setState({
      fasta: fasta,
      label_width: label_width,
      i: 0,
      j: 0
    });
  }
  handleWheel(e){
    const current_i = this.state.i,
      current_j = this.state.j,
      number_of_sequences = this.state.fasta.length,
      number_of_sites = this.state.fasta[0].seq.length,
      upper_i_bound = number_of_sequences-this.props.height_in_characters,
      upper_j_bound = number_of_sites-this.props.width_in_characters,
      i_move = current_i + Math.floor(e.deltaY/10),
      j_move = current_j + Math.floor(e.deltaX/10);
    this.setState({
      i: Math.max(Math.min(i_move, upper_i_bound), 0),
      j: Math.max(Math.min(j_move, upper_j_bound), 0)
    });
  }
  render(){
    if(!this.props.fasta){
      return <div><p>Loading...</p></div>;
    };

    const munged_seqs = _.flatten(
      this.state.fasta.slice(this.state.i, this.state.i+this.props.height_in_characters)
        .map((row, i) => {
          return row.seq.slice(this.state.j, this.state.j+this.props.width_in_characters)
            .split('')
            .map((mol, j) => {return {mol: mol, i: i, j: j};});
        })
    );

    const svg_width = this.state.label_width + this.props.character_size * this.props.width_in_characters,
      svg_height = this.props.character_size*(this.props.height_in_characters+1);
    console.log(this.state.i, this.state.j);
    return (<div>

      <div onWheel={e=>this.handleWheel(e)}>
        <svg id="alignment" width={svg_width} height={svg_height}>
          {this.state.fasta.slice(this.state.i, this.state.i+this.props.height_in_characters)
            .map((d,i) => {
              return (<text
                x={this.state.label_width-this.props.label_padding}
                y={this.props.character_size*(i+1.5)}
                textAnchor='end'
                className='seq-label'
                key={i}
                dominantBaseline='middle'
              >
                {d.header}
              </text>);
            })}
          {d3.range(this.state.j+1, this.state.j+this.props.width_in_characters-this.state.j%2+1, 2).map((d,i) => {
            const x = 2*i+this.state.j%2,
              val = d+this.state.j%2;
            return <text
              x={this.props.character_size*x+this.state.label_width+this.props.character_size/2}
              y={10}
              textAnchor='middle'
              key={i}
            >
              {val}
            </text>;
          })}
          {munged_seqs.map(d => {
            const x = this.state.label_width+this.props.character_size*d.j,
              y = this.props.character_size*(d.i+1);
            return (<g
              transform={`translate(${x},${y})`}
              key={`${d.i}-${d.j}`}
            >
              <rect
                x={0}
                y={0}
                width={this.props.character_size}
                height={this.props.character_size}
                fill={this.props.color(d)}
              />
              <text
                x={this.props.character_size/2}
                y={this.props.character_size/2}
                textAnchor='middle'
                dy='.25em'
              >
                {d.mol}
              </text>
            </g>);
          }) 
        }</svg>
      </div>

    </div>);
  }
}

Alignment.defaultProps = {
  color: d => {
    var colors = {
      A: 'LightPink',
      G: 'LightYellow',
      T: 'LightBlue',
      C: 'MediumPurple',
      "-": 'lightgrey'
    };
    return colors[d.mol] || 'red';
  },
  character_size: 20,
  width_in_characters: 50,
  height_in_characters: 20,
  label_padding: 20
}

module.exports = Alignment;
