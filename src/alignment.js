import React, { Component } from 'react';
const d3 = require('d3');
const $ = require('jquery');
const _ = require('underscore');

import fastaParser from './fasta';
import { 
  nucleotide_color,
  nucleotide_text_color
} from './colors';

require('./jav.css');


class Alignment extends Component {
  renderAlignment(){
    // stopgap
    this.reference = true;
    var { alignment_data, site_size, axis_height, reference } = this,
      margin = {top: 0, right: 0, bottom: 0, left: 0};
    var { label_padding } = this.props;
    this.number_of_sequences = alignment_data.length,
    this.number_of_sites = alignment_data[0].seq.length,
    this.height = this.number_of_sequences*site_size,
    this.alignment_width = this.number_of_sites*site_size,
    this.names = alignment_data.map(d => d.header);
    this.guide_width = 300;
    var site_scale = d3.scaleLinear()
        .domain([1, this.number_of_sites])
        .rangeRound([0, this.alignment_width]);
    
    var label_scale = d3.scaleLinear()
        .domain([1, this.number_of_sequences])
        .range([0, this.height]);

    var axis_scale = d3.scaleLinear()
      .domain([1, this.number_of_sites])
      .range([site_size/2, this.alignment_width-site_size/2]);
    
    var labels_svg = d3.select('#labels')
      .attr('height', this.height + margin.top + margin.bottom);

    var labels_g = labels_svg.append('g')
        .attr('transform', 'translate(-' + label_padding + ',' + margin.top + ')');

    var labels = labels_g.selectAll('text')
      .data(this.names.filter((name, i) => i > 0))
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
    label_width += label_padding;
    this.label_width = label_width;

    const computed_width = Math.min(label_width + this.number_of_sites*this.site_size, this.props.width),
      computed_height = Math.min(axis_height + this.number_of_sequences*this.site_size, this.props.height);
    this.computed_width = computed_width;
    this.computed_height = computed_height;
    this.guide_height = computed_height-axis_height-site_size;
    d3.select('#jsav-div')
      .style('width', computed_width + 'px')
      .style('height', computed_height + 'px');

    var alignment_canvas = d3.select('#alignment')
        .attr('width', computed_width - label_width)
        .attr('height', computed_height - axis_height);
    var alignment_context = alignment_canvas.node().getContext("2d");
    var reference_canvas = d3.select('#reference-alignment')
        .attr('width', computed_width - label_width)
        .attr('height', site_size);
    var reference_context = reference_canvas.node().getContext("2d");

    labels_svg.attr('width', label_width+5);
    labels.attr('x', label_width);

    var placeholder_svg = d3.select('#placeholder')
      .attr('width', label_width)
      .attr('height', axis_height);

    var axis_svg = d3.select('#axis')
      .attr('width', this.alignment_width)
      .attr('height', axis_height);

    var axis = d3.axisTop()
      .scale(axis_scale)
      .tickValues(d3.range(1, this.number_of_sites, 2));
   
    axis_svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + margin.left + ',' + (axis_height-1) + ')')
      .call(axis);

    var bar_data = _.toArray(this.props.json.posteriors);

    var axis_bars = axis_svg.selectAll('.bar')
      .data(bar_data)
      .enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', (d,i) => 'translate(' + (i*site_size) + ',0)');

    var bar_axis_scale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, 130]);

    axis_bars.append('rect')
      .attr('x', 2)
      .attr('y', 0)
      .attr('width', site_size-2)
      .attr('height', d=>bar_axis_scale(d['A'][1]))
      .attr('fill', 'LightPink');

    axis_bars.append('rect')
      .attr('x', 2)
      .attr('y', d=>bar_axis_scale(d['A'][1]))
      .attr('width', site_size-2)
      .attr('height', d=>bar_axis_scale(d['G'][1]))
      .attr('fill', 'LemonChiffon');

    axis_bars.append('rect')
      .attr('x', 2)
      .attr('y', d=>bar_axis_scale(d['A'][1]+d['G'][1]))
      .attr('width', site_size-2)
      .attr('height', d=>bar_axis_scale(d['C'][1]))
      .attr('fill', 'MediumPurple');

    axis_bars.append('rect')
      .attr('x', 2)
      .attr('y', d=>bar_axis_scale(d['A'][1]+d['G'][1]+d['C'][1]))
      .attr('width', site_size-2)
      .attr('height', d=>bar_axis_scale(d['T'][1]))
      .attr('fill', 'LightBlue');

    var reference_label_svg = d3.select('#reference-label')
      .attr('width', label_width)
      .attr('height', site_size);

    var reference_label_g = reference_label_svg.append('g')
        .attr('transform', 'translate(-' + label_padding + ',' + margin.top + ')');

    reference_label_g.append('text')
      .attr('y', (d,i) => (i+1)*site_size)
      .attr('text-anchor', 'end')
      .attr('dy', -site_size/3)
      .attr('width', label_width+5)
      .attr('x', label_width)
      .text(this.names[0]);

    var reference_alignment_canvas = d3.select('#reference-alignment')
        .attr('width', computed_width-label_width-this.guide_width)
        .attr('height', site_size);

    var legend_svg = d3.select('#legend')
      .attr('width', this.guide_width)
      .attr('height', axis_height);

    var guide_svg = d3.select('#guide')
      .attr('width', this.guide_width)
      .attr('height', computed_height-axis_height-site_size)

    guide_svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.guide_width)
      .attr('height', computed_height-axis_height-site_size)
      .attr('fill', 'WhiteSmoke');

    d3.select('#placeholder-div')
      .style("width", label_width+"px")
      .style("height", axis_height+"px");

    d3.select('#axis-div')
      .style("width", (computed_width-label_width-this.guide_width)+"px")
      .style("height", axis_height+"px");

    d3.select('#legend-div')
      .style("width", this.guide_width+"px")
      .style("height", axis_height+"px");

    d3.select('#reference-label-div')
      .style("width", label_width+"px")
      .style("height", site_size+"px");

    d3.select('#reference-alignment-div')
      .style("width", (computed_width-label_width-this.guide_width)+"px")
      .style("height", site_size+"px");

    d3.select('#reference-placeholder-div')
      .style("width", this.guide_width+"px")
      .style("height",site_size+"px");

    d3.select('#labels-div')
      .style("width", label_width + "px")
      .style("height", (computed_height-axis_height-site_size)+"px");

    d3.select('#alignment-div')
      .style("width", (computed_width-label_width-this.guide_width)+"px")
      .style("height", (computed_height-axis_height-site_size)+"px");

    d3.select('#guide-div')
      .style("width", this.guide_width+"px")
      .style("height", this.guide_height+"px");

    alignment_context.fillStyle = "#fff";
    alignment_context.rect(0,0,alignment_canvas.attr("width"),alignment_canvas.attr("height"));
    alignment_context.font = "14px Courier";
    alignment_context.textAlign = "center";
    alignment_context.textBaseline = "middle";
    alignment_context.fill();
    
    reference_context.fillStyle = "#fff";
    reference_context.rect(0,0,alignment_canvas.attr("width"),alignment_canvas.attr("height"));
    reference_context.font = "14px Courier";
    reference_context.textAlign = "center";
    reference_context.textBaseline = "middle";
    reference_context.fill();

    const { guide_width, guide_height, number_of_sites, number_of_sequences }  = this;
    const draw = this.draw.bind(this);
    const self = this;

    guide_svg.on("click", function() {
      var coords = d3.mouse(this);
      const x = -number_of_sites*site_size*coords[0]/guide_width,
        y = -number_of_sequences*site_size*coords[1]/guide_height;
      self.x = x;
      self.y = y;
      draw(x, y);
    });
    
    if(this.props.centerOnSite) {
      const full_width = this.number_of_sites*this.site_size,
        max_x = -(full_width - this.computed_width + this.label_width),
        new_x = -(site_size*this.props.centerOnSite - computed_width/2);
      this.x = Math.max(Math.min(new_x, 0), max_x);
    } else {
      this.x = 0;
    }
    if(this.props.centerOnHeader) {
      const header_index = this.names.indexOf(this.props.centerOnHeader)+1,
        full_height = this.number_of_sequences*this.site_size,
        max_y = -(full_height - this.computed_height + this.axis_height),
        new_y = -(site_size*header_index - computed_height/2);
      this.y = Math.max(Math.min(new_y, 0), max_y);
    } else {
      this.y = 0;
    }
    draw(this.x, this.y);

    guide_svg.selectAll('line')
      .data(alignment_data.map(function(row){
        var start = false, end = false;
        for(let i=0; !start || !end; i++) {
          if(!start && row.seq[i] != '-') {
            start = i;
          }
          if(!end && row.seq[row.seq.length-i-1] != '-') {
            end = row.seq.length-i-1;
          }
        }
        return [start, end];
      }))
      .enter()
      .append('line')
        .attr('x1', d=>guide_width*d[0]/number_of_sites)
        .attr('y1', (d,i) => guide_height*i/number_of_sequences)
        .attr('x2', d=>guide_width*d[1]/number_of_sites)
        .attr('y2', (d,i) => guide_height*i/number_of_sequences)
        .style('stroke', 'red')
        .style('stroke-width', '1px')
        .style('opacity', .5);

     guide_svg.append('rect')
      .attr('id', 'guide-rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.guide_width*(computed_width-label_width-this.guide_width)/(site_size*this.number_of_sites))
      .attr('height', (computed_height-axis_height-site_size)*(computed_height-axis_height-site_size)/(site_size*this.number_of_sequences) )
      .attr('fill', 'darkgrey')
      .attr('fill-opacity', .8)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
  }
  draw(x, y) {
    var { alignment_data, site_size } = this,
      { site_color, text_color } = this.props;
    var alignment_context = d3.select('#alignment')
      .node()
      .getContext("2d");
    $('#axis-div').scrollLeft(-x);
    $('#labels-div').scrollTop(-y);
    const start_site = Math.max(-Math.floor(x/site_size)-1, 0),
      end_site = start_site + Math.ceil((this.props.width-this.label_width-this.guide_width)/site_size)+1,
      start_seq = Math.max(-Math.floor(y/site_size)-1, 0),
      end_seq = start_seq + Math.ceil((this.props.height-this.axis_height)/site_size)+1;
    const individual_sites = _.flatten(
      alignment_data.filter((row, i) => {
        const after_start = i >= (start_seq+1),
          before_finish = i <= end_seq;
        return after_start && before_finish;
      }).map((row, i) => {
        return row.seq.
          slice(start_site, end_site)
          .split('')
          .map((mol, j) => {
            return {
              mol: mol,
              j: start_site + j + 1,
              i: start_seq + i + 1,
              header: row.header
            };
        });
      })
    );
    alignment_context.setTransform(1, 0, 0, 1, x, y);
    individual_sites.forEach(function(d) {
      const x = site_size*(d.j-1),
        y = site_size*(d.i-1);
      alignment_context.beginPath();
      alignment_context.fillStyle = site_color(d.mol, d.j, d.header);
      alignment_context.rect(x, y, site_size, site_size);
      alignment_context.fill();
      alignment_context.fillStyle = text_color(d.mol, d.j, d.header);
      alignment_context.fillText(d.mol, x+site_size/2, y+site_size/2);
      alignment_context.closePath();
    });

    const reference_context = d3.select("#reference-alignment")
      .node()
      .getContext("2d");
    reference_context.setTransform(1, 0, 0, 1, x, 0);
    alignment_data[0].seq
      .slice(start_site, end_site)
      .split('')
      .map((mol, j) => {
      return  {
        mol: mol,
        j: start_site + j + 1,
        header: alignment_data[0].header
      };
    }).forEach(function(d) {
      const x = site_size*(d.j-1);
      reference_context.beginPath();
      reference_context.fillStyle = site_color(d.mol, d.j, d.header);
      reference_context.rect(x, 0, site_size, site_size);
      reference_context.fill();
      reference_context.fillStyle = text_color(d.mol, d.j, d.header);
      reference_context.fillText(d.mol, x+site_size/2, site_size/2);
      reference_context.closePath();
    });

    const guide_x = this.guide_width*(this.site_size-x)/(this.number_of_sites*this.site_size),
      guide_y = this.guide_height*(this.site_size-y)/(this.number_of_sequences*this.site_size);

    d3.select('#guide-rect')
      .attr('x', guide_x)
      .attr('y', guide_y);

  }
  componentDidMount(){
    var self = this;
    if(this.props.fasta){
      this.alignment_data = fastaParser(this.props.fasta);
      this.axis_height = 150;
      this.site_size = 20; 

      this.renderAlignment();
    }
    const handleWheel = function (e) {
      e.preventDefault();
      const new_x = self.x + e.originalEvent.deltaX;
      const new_y = self.y + e.originalEvent.deltaY;
      const number_of_sequences = self.alignment_data.length,
        number_of_sites = self.alignment_data[0].seq.length,
        full_width = number_of_sites*self.site_size,
        full_height = number_of_sequences*self.site_size,
        max_x = -(full_width-self.computed_width+self.label_width+self.guide_width),
        max_y = -(full_height-self.computed_height+self.axis_height);
      self.x = Math.max(Math.min(new_x, 0), max_x);
      self.y = Math.max(Math.min(new_y, 0), max_y);
      self.draw(self.x, self.y);
    }
    $('#alignment-div').on('wheel', handleWheel);
    $('#guide-div').on('wheel', handleWheel);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.fasta.slice(0, 100) != nextProps.fasta.slice(0, 100);
  }
  componentDidUpdate(){
    if(this.props.fasta){
      document.getElementById('alignment').innerHTML = '';
      document.getElementById('labels').innerHTML = '';

      this.alignment_data = fastaParser(this.props.fasta);
      this.axis_height = 150;
      this.site_size = 20; 
      this.renderAlignment();
    }
  }
  render(){
    return (<div id="jsav-div">
      <div id="placeholder-div" className="jav-container">
        <svg id="placeholder"></svg>
      </div>
      <div id="axis-div" className="jav-container" style={{overflow: "scroll", overflowX: "hidden"}}>
        <svg id="axis"></svg>
      </div>
      <div id="legend-div" className="jav-container">
        <svg id="legend"></svg>
      </div>
      <div id="reference-label-div" className="jav-container">
        <svg id="reference-label"></svg>
      </div>
      <div id="reference-alignment-div" className="jav-container" style={{overflow: "scroll", overflowX: "hidden"}}>
        <canvas id="reference-alignment"></canvas>
      </div>
      <div id="reference-placeholder-div" className="jav-container">
      </div>
      <div id="labels-div" className="jav-container" style={{overflow: "scroll", overflowY: "hidden"}}>
        <svg id="labels"></svg>
      </div>
      <div id="alignment-div" className="jav-container" style={{overflow: "scroll"}}>
        <canvas id="alignment"></canvas>
      </div>
      <div id="guide-div" className="jav-container" style={{overflow: "scroll", overflowY: "hidden"}}>
        <svg id="guide"></svg>
      </div>
    </div>);
  }
}

Alignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10
}

module.exports = Alignment;
