import React, { Component } from 'react';
const d3 = require('d3');
const $ = require('jquery');

import fastaParser from './fasta';


class Alignment extends Component {
  renderAlignment(){
    var parsed = fastaParser(this.props.fasta),
      {alignment_data, names} = parsed;

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
      axis_height = 20,
      number_of_sequences = names.length,
      number_of_sites = alignment_data.length/number_of_sequences,
      site_size = 20,
      alignment_width = number_of_sites*site_size,
      height = number_of_sequences*site_size,
      colors = {
        A: 'LightPink',
        G: 'LightYellow',
        T: 'LightBlue',
        C: 'MediumPurple',
        "-": 'lightgrey'
      }
    
    var alignment_svg = d3.select('#alignment')
        .attr('width', alignment_width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var character_group = alignment_svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    var site_scale = d3.scaleLinear()
        .domain([1, number_of_sites])
        .rangeRound([0, alignment_width]);
    
    var label_scale = d3.scaleLinear()
        .domain([1, number_of_sequences])
        .range([0, height]);

    var axis_scale = d3.scaleLinear()
      .domain([1, number_of_sites])
      .range([site_size/2, alignment_width-site_size/2]);
    
    var character_gs = character_group.selectAll('g')
      .data(alignment_data.filter(d=>d.i<100 && d.j < 100))
      .enter()
      .append('g')
        .attr('transform', d => {
          const x = site_size*(d.j-1),
            y = site_size*(d.i-1);
          return 'translate(' + x + ',' + y + ')';
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

    var label_width = 0;
    labels.each(function(d) { 
      label_width = Math.max(label_width, this.getComputedTextLength());
    });

    labels_svg.attr('width', label_width+5);
    labels.attr('x', label_width);

    var placeholder_svg = d3.select('#placeholder')
      .attr('width', label_width)
      .attr('height', axis_height);

    var axis_svg = d3.select('#axis')
      .attr('width', alignment_width)
      .attr('height', axis_height);

    var axis = d3.axisTop()
      .scale(axis_scale)
      .tickValues(d3.range(1, number_of_sites, 2));
   
    axis_svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + margin.left + ',' + 19 + ')')
      .call(axis);

    d3.select('#placeholder-div')
      .style("width", label_width+"px")
      .style("height", axis_height+"px");

    d3.select('#axis-div')
      .style("width", (this.props.width-label_width)+"px")
      .style("height", axis_height+"px");

    d3.select('#labels-div')
      .style("width", label_width+"px")
      .style("height", (this.props.height-axis_height)+"px");

    d3.select('#alignment-div')
      .style("width", (this.props.width-label_width)+"px")
      .style("height", (this.props.height-axis_height)+"px");

  }
  componentDidMount(){
    if(this.props.fasta){
      this.renderAlignment();
    }
    $('#alignment-div').on('scroll', function () {
        $('#labels-div').scrollTop($(this).scrollTop());
    });
    $('#alignment-div').on('scroll', function () {
        $('#axis-div').scrollLeft($(this).scrollLeft());
    });
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
    return (<div style={{width: this.props.width, height: this.props.height}}>
      <div id="placeholder-div" className="jav-container">
        <svg id="placeholder"></svg>
      </div>
      <div id="axis-div" className="jav-container" style={{overflow: "scroll", overflowX: "hidden"}}>
        <svg id="axis"></svg>
      </div>
      <div id="labels-div" className="jav-container" style={{overflow: "scroll", overflowY: "hidden"}}>
        <svg id="labels"></svg>
      </div>
      <div id="alignment-div" className="jav-container" style={{overflow: "scroll"}}>
        <svg id="alignment"></svg>
      </div>
    </div>);
  }
}

module.exports = Alignment;
