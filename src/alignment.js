import React, { Component } from 'react';
const d3 = require('d3');

import fastaParser from './fasta';


class Alignment extends Component {
  renderAlignment(){
    var parsed = fastaParser(this.props.fasta),
      {alignment_data, names} = parsed;

    var margin = {top: 20, right: 0, bottom: 0, left: 0},
        number_of_sequences = names.length,
        number_of_sites = alignment_data.length/number_of_sequences,
        site_size = 20,
        width = number_of_sites*site_size,
        height = number_of_sequences*site_size,
        colors = {
          A: 'LightPink',
          G: 'LightYellow',
          T: 'LightBlue',
          C: 'MediumPurple',
          "-": 'lightgrey'
        }
    
    var alignment_svg = d3.select('#alignment')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    var labels = alignment_svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    var character_group = alignment_svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    var site_scale = d3.scaleLinear()
        .domain([1, number_of_sites])
        .rangeRound([0, width]);
    
    var label_scale = d3.scaleLinear()
        .domain([1, number_of_sequences])
        .range([0, height]);

    var axis_scale = d3.scaleLinear()
      .domain([1, number_of_sites])
      .range([site_size/2, width-site_size/2]);
    
    var axis = d3.axisTop()
      .scale(axis_scale)
      .tickValues(d3.range(1, number_of_sites, 2));
   
    alignment_svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(axis);
    
    var character_gs = character_group.selectAll('g')
      .data(alignment_data.filter(d=>d.i<100 && d.j < 100))
      .enter()
      .append('g')
        .attr('transform', d => {
          const x = site_size*(d.j-1),
            y = site_size*(d.i-1);
          return 'translate(' + x + ',' + y + ')'
        });

    character_gs.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', site_size)
      .attr('height', site_size)
      .attr('fill', d=>colors[d.char] || 'red');
        
    character_gs.append('text')
      .attr('x', site_size/2)
      .attr('y', site_size/2)
      .attr('text-anchor', 'middle')
      .attr('dy', '.25em')
      .text(d=>d.char);

    var labels_svg = d3.select('#labels')
      .attr('height', height + margin.top + margin.bottom);

    var labels_g = labels_svg.append('g')
        .attr('transform', 'translate(0,' + margin.top + ')');

    var labels = labels_g.selectAll('text')
      .data(names)
      .enter()
      .append('text')
        .attr('y', (d,i) => (i+1)*site_size)
        .attr('text-anchor', 'end')
        .attr('dy', -site_size/3)
        .text(d=>d);

    var max_label_width = 0;
    labels.each(function(d) { 
      max_label_width = Math.max(max_label_width, this.getComputedTextLength());
    });

    labels_svg.attr('width', max_label_width+5);
    labels.attr('x', max_label_width);
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
      document.getElementById('labels').innerHTML = '';
      this.renderAlignment();
    }
  }
  render(){
    return (<div style={{width: "100%", display: "flex", flexDirection: "row"}}>
      <div style={{margin: 0, padding: 0}}>
        <svg id="labels"></svg>
      </div>
      <div style={{overflowX: "scroll", margin: 0, padding: 0}}>
        <svg id="alignment"></svg>
      </div>
    </div>);
  }
}

module.exports = Alignment;
