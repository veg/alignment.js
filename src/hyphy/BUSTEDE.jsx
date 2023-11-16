import React from "react";

import Placeholder from "./components/Placeholder.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import BaseAlignment from "./components/BaseAlignment.jsx";
import Tree from "./components/Tree.jsx";
import ScrollBroadcaster from "./helpers/scroll_broadcaster";
import { nucleotide_color, nucleotide_text_color } from "./helpers/colors";

function TreeAlignment(props) {
  const { sequence_data } = props;
  if (!sequence_data) return <div />;
  const { width, tree_width, height, axis_height, site_size } = props,
    full_pixel_width = sequence_data
      ? sequence_data[0].seq.length * site_size
      : null,
    full_pixel_height = sequence_data ? sequence_data.length * site_size : null,
    alignment_width = full_pixel_width
      ? Math.min(full_pixel_width, width - tree_width)
      : width,
    alignment_height = full_pixel_height
      ? Math.min(full_pixel_height, height - axis_height)
      : height,
    scroll_broadcaster = new ScrollBroadcaster({
      width: full_pixel_width,
      height: full_pixel_height,
      x_pad: width - tree_width,
      y_pad: height - axis_height,
      bidirectional: [
        "alignmentjs-alignment",
        "alignmentjs-axis-div",
        "alignmentjs-tree-div"
      ]
    });
  return (
    <div id="alignmentjs-main-div">
      <Placeholder width={tree_width} height={axis_height} />
      <SiteAxis
        width={alignment_width}
        height={axis_height}
        sequence_data={props.sequence_data}
        scroll_broadcaster={scroll_broadcaster}
      />
      <Tree
        tree={props.tree}
        width={tree_width}
        height={alignment_height}
        site_size={props.site_size}
        scroll_broadcaster={scroll_broadcaster}
      />
      <BaseAlignment
        sequence_data={props.sequence_data}
        width={alignment_width}
        height={alignment_height}
        site_size={props.site_size}
        site_color={props.site_color}
        scroll_broadcaster={scroll_broadcaster}
        molecule={props.molecule}
      />
    </div>
  );
}

TreeAlignment.defaultProps = {
  site_color: nucleotide_color,
  text_color: nucleotide_text_color,
  label_padding: 10,
  site_size: 20,
  axis_height: 25,
  width: 960,
  tree_width: 500,
  height: 500,
  sender: "main",
  molecule: mol => mol
};

export default TreeAlignment;
