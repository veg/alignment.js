import React, { Component } from 'react';

const d3 = require('d3');
const _ = require('underscore');


class BaseAlignment extends Component {
  componentDidMount() {
    document.getElementById('alignmentjs-alignment')
      .addEventListener('alignmentjs_wheel_event', e => {
        this.draw(e.detail.x_pixel, e.detail.y_pixel);
      });
  }
  componentDidUpdate(){
    this.draw(this.props.x_pixel || 0, this.props.y_pixel || 0);
  }
  draw(x_pixel, y_pixel) {
    const { width, height, site_size, site_color, text_color } = this.props,
      { number_of_sites, number_of_sequences } = this.props.sequence_data,
      start_site = Math.floor(x_pixel/site_size),
      end_site = Math.ceil((x_pixel+width)/site_size),
      start_seq = Math.floor(y_pixel/site_size), 
      end_seq = Math.ceil((y_pixel+height)/site_size);
    const individual_sites = _.flatten(
      this.props.sequence_data.filter((row, i) => {
        const after_start = i >= start_seq,
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
    const context = document.getElementById('alignmentjs-alignment')
      .getContext('2d');
    context.font = "14px Courier";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.setTransform(1, 0, 0, 1, -x_pixel, -y_pixel);
    individual_sites.forEach(function(d) {
      const x = site_size*(d.j-1),
        y = site_size*(d.i-1);
      context.beginPath();
      context.fillStyle = site_color(d.mol, d.j, d.header);
      context.rect(x, y, site_size, site_size);
      context.fill();
      context.fillStyle = text_color(d.mol, d.j, d.header);
      context.fillText(d.mol, x+site_size/2, y+site_size/2);
      context.closePath();
    });
  }
  render() {
    return (<div
      id="alignmentjs-alignment-div"
      className="alignmentjs-container"
    >
      <canvas
        width={this.props.width}
        height={this.props.height}
        id="alignmentjs-alignment"
      />
    </div>);
  }
}


module.exports = BaseAlignment;
