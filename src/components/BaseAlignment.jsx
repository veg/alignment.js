import React, { Component } from "react";
import _ from "underscore";
import {
  nucleotide_color,
  nucleotide_text_color,
  amino_acid_color,
  amino_acid_text_color
} from "./../helpers/colors";

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
  componentDidUpdate(prevProps) {
    const { x_pixel, y_pixel } = this.props,
      pixel_specified = x_pixel != undefined || y_pixel != undefined,
      data_changed = !_.isEqual(
        prevProps.sequence_data,
        this.props.sequence_data
      ),
      site_color_changed = this.props.site_color != prevProps.site_color,
      text_color_changed = this.props.text_color != prevProps.text_color,
      molecule_changed = this.props.molecule != prevProps.molecule,
      should_draw = _.some([
        pixel_specified,
        data_changed,
        site_color_changed,
        text_color_changed,
        molecule_changed
      ]);
    if (should_draw) {
      this.draw(x_pixel || 0, y_pixel || 0);
    }
  }
  draw(x_pixel, y_pixel) {
    if (this.props.disableVerticalScrolling) y_pixel = 0;
    const {
        width,
        height,
        site_size,
        molecule,
        font_family,
        font_size
      } = this.props,
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
    context.font = `${font_size} ${font_family}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.setTransform(1, 0, 0, 1, -x_pixel, -y_pixel);
    individual_sites.forEach(function(d) {
      const x = site_size * (d.j - 1),
        y = site_size * (d.i - 1),
        mol = molecule(d.mol, d.j, d.header);
      context.beginPath();
      context.fillStyle = site_color(d.mol, d.j, d.header);
      context.rect(x, y, site_size, site_size);
      context.fill();
      context.fillStyle = text_color(d.mol, d.j, d.header);
      context.fillText(mol, x + site_size / 2, y + site_size / 2);
      context.closePath();
    });
  }
  handleClick(e) {
    const { scroll_broadcaster, sender, site_size } = this.props,
      { x_pixel, y_pixel } = scroll_broadcaster.location(sender),
      x_click = e.clientX - e.target.offsetLeft + x_pixel,
      y_click = e.clientY - e.target.offsetTop + y_pixel,
      x_site = Math.floor(x_click / site_size),
      y_sequence_index = Math.floor(y_click / site_size),
      y_sequence = this.props.sequence_data[y_sequence_index];
    this.props.onSiteClick(x_site, y_sequence);
  }
  handleHover(e) {
    const { scroll_broadcaster, sender, site_size } = this.props,
      { x_pixel, y_pixel } = scroll_broadcaster.location(sender),
      x_click = e.clientX - e.target.offsetLeft + x_pixel,
      y_click = e.clientY - e.target.offsetTop + y_pixel,
      x_site = Math.floor(x_click / site_size),
      y_sequence_index = Math.floor(y_click / site_size),
      y_sequence = this.props.sequence_data[y_sequence_index];
    this.props.onSiteHover(x_site, y_sequence);
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    const div_id = this.props.id + "-alignment-div";
    return (
      <div
        id={div_id}
        className="alignmentjs-container"
        onClick={e => this.handleClick(e)}
        onWheel={e => this.handleWheel(e)}
        onMouseMove={e => this.handleHover(e)}
      >
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
  font_size: "14px",
  font_family: "Courier",
  molecule: mol => mol,
  site_size: 20,
  id: "alignmentjs",
  sender: "main",
  onSiteClick: () => null,
  onSiteHover: () => null
};

export default BaseAlignment;
