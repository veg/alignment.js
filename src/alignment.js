import React, { Component } from 'react';
const d3 = require('d3');

import fastaParser from './fasta';


class Alignment extends Component {
  constructor(props){
    super(props);
    this.state = { i: 0, j: 0, wheel: 0 };
  }
  increment(val){
    const current = this.state[val],
      new_value = Math.max(current+1, 0);
    if(val=='i') this.setState({i: new_value});
    else  this.setState({j: new_value});
  }
  decrement(val){
    const current = this.state[val],
      new_value = Math.max(current-1, 0);
    if(val=='i') this.setState({i: new_value});
    else  this.setState({j: new_value});
  }
  handleWheel(e){
    const current_i = this.state.i,
    current_j = this.state.j;
    this.setState({
      wheel: e.deltaX,
      i: Math.max(current_i + Math.floor(e.deltaY/10), 0),
      j: Math.max(current_j + Math.floor(e.deltaX/10), 0)
    });
  }
  render(){
    if(!this.props.fasta){
      return <p>Loading...</p>;
    };
    var colors = {
      A: 'LightPink',
      G: 'LightYellow',
      T: 'LightBlue',
      C: 'MediumPurple',
      "-": 'lightgrey'
    };

    if(!this.alignment_data){
      var parsed = fastaParser(this.props.fasta),
        {alignment_data, names} = parsed;
      this.alignment_data = alignment_data;
      this.names = names;
    }

    return (<div>
      <div>
        i: {this.state.i}
        <button onClick={()=>this.increment('i')}>+</button>
        <button onClick={()=>this.decrement('i')}>-</button>
      </div>
      <div>
        j: {this.state.j}
        <button onClick={()=>this.increment('j')}>+</button>
        <button onClick={()=>this.decrement('j')}>-</button>
      </div>
      <div>Wheel: {this.state.wheel}</div>
      <div onWheel={e=>this.handleWheel(e)}>
        <svg id="alignment" width={this.props.width} height={this.props.height}>
          {d3.range(this.state.j+1, this.state.j+50-this.state.j%2, 2).map((d,i) => {
            const x = 2*i+this.state.j%2,
              val = d+this.state.j%2;
            return <text x={20*x+200+10} y={10} textAnchor='middle'>{val}</text>;
          })}
          {this.alignment_data.filter(d => {
            const in_i = this.state.i < d.i && d.i < this.state.i+50,
              in_j = this.state.j < d.j && d.j < this.state.j+50;
            return in_i && in_j;
          }).map(d => {
            return (<g transform={`translate(${200+20*(d.j-1-this.state.j)},${20*(d.i-this.state.i)})`}>
              <rect x={0} y={0} width={20} height={20} fill={colors[d.char] || 'red'} />
              <text x={10} y={10} textAnchor='middle' dy='.25em'>
                {d.char}
              </text>
            </g>);
          }) 
        }</svg>
      </div>
    </div>);
  }
}

module.exports = Alignment;
