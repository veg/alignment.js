import React, { Component } from "react";
import {
  nucleotide_color,
  nucleotide_text_color,
  amino_acid_color,
  amino_acid_text_color
} from "./../helpers/colors";

const d3 = require("d3");
const _ = require("underscore");

class BaseAlignment extends Component {
  constructor(props) {
    super(props);
    this.canvas_id = props.id + "-alignment";
  }
  componentDidMount() {
    document
      .getElementById(this.canvas_id)
      .addEventListener("alignmentjs_wheel_event", e => {
        this.draw(e.detail.x_pixel, e.detail.y_pixel);
      });
    if (this.props.sequence_data) {
      this.draw(this.props.x_pixel || 0, this.props.y_pixel || 0);
    }
  }
  componentDidUpdate() {
    this.draw(this.props.x_pixel || 0, this.props.y_pixel || 0);
  }
  draw(x_pixel, y_pixel) {
    if (this.props.disableVerticalScrolling) y_pixel = 0;
    const { width, height, site_size } = this.props,
      start_site = Math.floor(x_pixel / site_size),
      end_site = Math.ceil((x_pixel + width) / site_size),
      start_seq = Math.floor(y_pixel / site_size),
      end_seq = Math.ceil((y_pixel + height) / site_size),
      site_color = this.props.amino_acid
        ? amino_acid_color
        : this.props.site_color,
      text_color = this.props.amino_acid
        ? amino_acid_text_color
        : this.props.text_color;
    const individual_sites = _.flatten(
      this.props.sequence_data
        .filter((row, i) => {
          const after_start = i >= start_seq;
          const before_finish = i <= end_seq;
          return after_start && before_finish;
        })
        .map((row, i) => {
          return row.seq
            .slice(start_site, end_site)
            .split("")
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
    const context = document.getElementById(this.canvas_id).getContext("2d");
    context.font = "14px Courier";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.setTransform(1, 0, 0, 1, -x_pixel, -y_pixel);
    individual_sites.forEach(function(d) {
      const x = site_size * (d.j - 1),
        y = site_size * (d.i - 1);
      context.beginPath();
      context.fillStyle = site_color(d.mol, d.j, d.header);
      context.rect(x, y, site_size, site_size);
      context.fill();
      context.fillStyle = text_color(d.mol, d.j, d.header);
      context.fillText(d.mol, x + site_size / 2, y + site_size / 2);
      context.closePath();
    });
  }
  render() {
    const div_id = this.props.id + "-alignment-div";
    return (
      <div id={div_id} className="alignmentjs-container">
        <canvas
          width={this.props.width}
          height={this.props.height}
          id={this.canvas_id}
        />
      </div>
    );
  }
}

BaseAlignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  site_size: 20,
  id: "alignmentjs"
};

module.exports = BaseAlignment;
