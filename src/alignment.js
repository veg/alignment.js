import React, { Component } from 'react';
const d3 = require('d3');
const $ = require('jquery');
const _ = require('underscore');


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
  componentDidMount(){
    this.initialize();
  }
  shouldComponentUpdate(nextProps, nextState) {
    const old_slice = this.props.fasta.slice(0, 100),
      new_slice = nextProps.fasta.slice(0, 100);
    return old_slice != new_slice;
  }
  componentDidUpdate(){
    this.initialize();
  }
  initialize() {
    const { fasta } = this.props; 
    if(fasta) {
      const { site_size, width, height, label_width, axis_height } = this.props;
      this.sequence_data = fastaParser(fasta);
      const full_pixel_width = site_size*this.sequence_data.number_of_sites,
        full_pixel_height = site_size*this.sequence_data.number_of_sequences;
      this.scroll_broadcaster = new ScrollBroadcaster(
        { width: full_pixel_width, height: full_pixel_height },
        { width: width-label_width, height: height-axis_height },
        ['alignmentjs-alignment', 'alignmentjs-axis-div']
      );
      const { scroll_broadcaster } = this;
      $('#alignmentjs-main-div').on('wheel', function (e) {
        e.preventDefault();
        scroll_broadcaster.handleWheel(e);
      });
      this.setState({received_sequence_data: true});
    }
  }
  render() {
    if (this.props.fasta && !this.sequence_data) {
      this.sequence_data = fastaParser(this.props.fasta);
    }
    return (<div
      id="alignmentjs-main-div"
      style={{width:this.props.width, height: this.props.height}}
    >
      <Placeholder
        width={this.props.label_width}
        height={this.props.axis_height}
      />
      <Axis 
        width={this.props.width-this.props.label_width}
        height={this.props.axis_height}
        site_size={this.props.site_size}
        sequence_data={this.sequence_data}
      />
      <Labels
        width={this.props.label_width}
        height={this.props.height-this.props.axis_height}
        sequence_data={this.sequence_data}
        site_size={this.props.site_size}
      />
      <BaseAlignment
        width={this.props.width-this.props.label_width}
        height={this.props.height-this.props.axis_height}
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
  label_width: 200,
  label_padding: 10,
  site_size: 20,
  label_width: 200,
  axis_height: 20
}

module.exports = Alignment;
