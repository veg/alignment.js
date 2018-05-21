import React, { Component } from 'react';
const d3 = require('d3');
const $ = require('jquery');
const _ = require('underscore');
const text_width = require('text-width');

import fastaParser from './fasta';
import BaseAlignment from './basealignment';
import Axis from './axis';
import Placeholder from './placeholder';
import Labels from './labels';
import ScrollBroadcaster from './scrollbroadcaster';
import { 
  nucleotide_color,
  nucleotide_text_color
} from './colors';

require('./app.scss');


class Alignment extends Component {
  constructor(props) {
    super(props);
    this.label_width = 200;
  }
  componentDidMount(){
    this.initialize(this.props.fasta);
  }
  componentWillUpdate(nextProps){
    this.initialize(nextProps.fasta);
  }
  initialize(fasta) {
    if(fasta) {
      const { site_size, width, height, axis_height } = this.props;
      this.sequence_data = fastaParser(fasta);
      this.label_width = this.props.label_padding + this.sequence_data
        .map(record=>text_width(record.header, { family: 'Courier', size: 14 }))
        .reduce((a,b)=>Math.max(a,b), 0);
      this.full_pixel_width = site_size*this.sequence_data.number_of_sites;
      this.full_pixel_height = site_size*this.sequence_data.number_of_sequences;
      this.scroll_broadcaster = new ScrollBroadcaster(
        { width: this.full_pixel_width, height: this.full_pixel_height },
        { width: width-this.label_width, height: height-axis_height },
        ['alignmentjs-alignment', 'alignmentjs-axis-div']
      );
      const { scroll_broadcaster } = this;
      
      $('#alignmentjs-main-div').off('wheel');
      $('#alignmentjs-main-div').on('wheel', function (e) {
        e.preventDefault();
        scroll_broadcaster.handleWheel(e);
      });
    }
  }
  render() {
    const { full_pixel_width, full_pixel_height, label_width } = this,
      width = full_pixel_width ? 
        Math.min(label_width+full_pixel_width, this.props.width) :
        this.props.width,
      height = full_pixel_height ?
        Math.min(full_pixel_height+this.props.axis_height, this.props.height) :
        this.props.height;
    return (<div
      id="alignmentjs-main-div"
      style={{width:width, height: height}}
    >
      <Placeholder
        width={this.label_width}
        height={this.props.axis_height}
      />
      <Axis 
        width={width-this.label_width}
        height={this.props.axis_height}
        site_size={this.props.site_size}
        sequence_data={this.sequence_data}
      />
      <Labels
        width={this.label_width}
        height={height-this.props.axis_height}
        sequence_data={this.sequence_data}
        site_size={this.props.site_size}
      />
      <BaseAlignment
        width={width-this.label_width}
        height={height-this.props.axis_height}
        sequence_data={this.sequence_data}
        site_color={this.props.site_color}
        text_color={this.props.text_color}
        site_size={this.props.site_size}
      />
    </div>);
  }
}

Alignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  site_size: 20,
  axis_height: 20
}

module.exports = Alignment;
