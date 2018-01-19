import React, { Component } from 'react';
const d3 = require('d3');

import fastaParser from './fasta';


class Alignment extends Component {
  renderAlignment(){
    var sequences = fastaParser(this.props.fasta);
    var margin = {top: 20, right: 10, bottom: 20, left: 10},
        number_of_characters = sequences[0].seq.length,
        number_of_sequences = sequences.length,
        character_size = 20,
        labels_width = 200,
        width = labels_width + number_of_characters*character_size - margin.left - margin.right,
        height = number_of_sequences*character_size - margin.top - margin.bottom,
        colors = {
          A: 'red',
          G: 'yellow',
          T: 'blue',
          C: 'purple',
          "-": 'lightgrey'
        }
    
    var svg = d3.select('#alignment')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    var labels = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    var characters = svg.append('g')
        .attr('transform', 'translate(' + (labels_width + margin.left) + ',' + margin.top + ')')
        .style('width', '500px')
        .style('overflow-x', 'scroll');
    
    var site_scale = d3.scaleLinear()
        .domain([0, number_of_characters])
        .range([0, width-labels_width]);
    
    var label_scale = d3.scaleLinear()
        .domain([0, number_of_sequences])
        .range([0, height]);
    
    var axis = d3.axisTop()
      .scale(site_scale)
      .tickValues(d3.range(0, number_of_characters, 2));
    
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + (margin.left+labels_width+site_scale(.5)) + ',' + margin.top + ')')
      .call(axis)
    
    for(var i=0; i < number_of_sequences; i++){
      labels.append('text')
        .attr('transform', 'translate(0,' + label_scale(i+.75) + ')')
        .text(sequences[i].name);
      for(var j=0; j < number_of_characters; j++){
        var g_character = characters.append("g")
          .attr('transform', 'translate(' + site_scale(j) + ',' + label_scale(i) + ')');
        var character = sequences[i].seq[j];
         
        g_character.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', site_scale(1))
          .attr('height', site_scale(1))
          .attr('fill', colors[character] || 'red')
        
        g_character.append('text')
          .attr('transform', 'translate(' + site_scale(.5) + ',' + site_scale(.5) + ')')
          .attr('text-anchor', 'middle')
          .attr('dy', '.25em')
          .text(character)
      }
    }
  }
  componentDidMount(){
    if(this.props.fasta){
      this.renderAlignment();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.fasta.slice(0, 100) != nextProps.fasta.slice(0, 100);
  }
  componentDidUpdate(){
    if(this.props.fasta){
      document.getElementById('alignment').innerHTML = '';
      this.renderAlignment();
    }
  }
  render(){
    return (<div style={{width: "100%", "overflowX": "scroll"}}>
      <svg id="alignment"></svg>
    </div>);
  }
}

module.exports = Alignment;
