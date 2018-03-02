import React, { Component } from 'react';
const d3 = require('d3');
const $ = require('jquery');

import fastaParser from './fasta';


class Alignment extends Component {
  renderAlignment(){
    var { alignment_data, names, site_size } = this,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      axis_height = 20,
      number_of_sequences = names.length,
      number_of_sites = alignment_data.length/number_of_sequences,
      height = number_of_sequences*site_size,
      alignment_width = number_of_sites*site_size;
    
    var site_scale = d3.scaleLinear()
        .domain([1, number_of_sites])
        .rangeRound([0, alignment_width]);
    
    var label_scale = d3.scaleLinear()
        .domain([1, number_of_sequences])
        .range([0, height]);

    var axis_scale = d3.scaleLinear()
      .domain([1, number_of_sites])
      .range([site_size/2, alignment_width-site_size/2]);
    
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

    var alignment_canvas = d3.select('#alignment')
        .attr('width', this.props.width - label_width)
        .attr('height', this.props.height - axis_height);
    var context = alignment_canvas.node().getContext("2d");

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

    context.fillStyle = "#fff";
    context.rect(0,0,alignment_canvas.attr("width"),alignment_canvas.attr("height"));
    context.font = "12px Courier";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fill();
    
    this.draw();
  }
  draw() {
    var { alignment_data, names, site_size } = this;
    var context = d3.select('#alignment')
      .node()
      .getContext("2d");
    var colors = {
      A: 'LightPink',
      G: 'LightYellow',
      T: 'LightBlue',
      C: 'MediumPurple',
      "-": 'lightgrey'
    };
    context.setTransform(1, 0, 0, 1, this.x, 0);
    alignment_data.forEach(function(d) {
      const x = site_size*(d.j-1),
        y = site_size*(d.i-1);
      context.beginPath();
      context.fillStyle = colors[d.char];
      context.rect(x, y, site_size, site_size);
      context.fill();
      context.fillStyle = "black";
      context.fillText(d.char, x+site_size/2, y+site_size/2);
      context.closePath();
    });
  }
  componentDidMount(){
    var self = this;
    if(this.props.fasta){
      this.renderAlignment();
    }
    $('#alignment-div').on('wheel', function (e) {
      console.log(e.originalEvent.deltaX);
      $('#axis-div').scrollLeft(-self.x);
      const new_x = self.x +=  e.originalEvent.deltaX;
      self.x = Math.min(self.x, 0);
      self.draw();
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.fasta.slice(0, 100) != nextProps.fasta.slice(0, 100);
  }
  componentDidUpdate(){
    if(this.props.fasta){
      document.getElementById('alignment').innerHTML = '';
      document.getElementById('labels').innerHTML = '';

      var parsed = fastaParser(this.props.fasta),
        {alignment_data, names} = parsed;
      this.alignment_data = alignment_data;
      this.names = names;
      this.site_size = 20; 
      this.x = 0;
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
        <canvas id="alignment"></canvas>
      </div>
    </div>);
  }
}

module.exports = Alignment;
