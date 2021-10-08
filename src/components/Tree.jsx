import React, { Component } from "react";
import Phylotree from "react-phylotree";
const $ = require("jquery");

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      div_id: props.id + "-tree-div"
    };
  }
  componentDidMount() {
    const { div_id } = this.state;
    document
      .getElementById(div_id)
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $(`#${div_id}`).scrollTop(e.detail.y_pixel);
      });
  }
  componentDidUpdate(nextProps) {
    $(`#${this.state.div_id}`).scrollTop(this.props.y_pixel);
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    const { width, height, tree, site_size, phylotreeProps } = this.props;
    if (!tree) {
      return <div id={this.state.div_id} className="alignmentjs-container" />;
    }
    const number_of_tips = tree.getTips().length,
      tree_height = number_of_tips * site_size,
      overflow = "scroll hidden";
    return (
      <div
        id={this.state.div_id}
        style={{ width, height, overflow }}
        className="alignmentjs-container"
      >
        <svg
          width={width}
          height={tree_height}
          className="alignmentjs-container"
        >
          <Phylotree
            tree={tree}
            transform={`translate(${site_size / 2}, ${site_size / 2})`}
            width={width - site_size}
            height={tree_height - site_size}
            {...phylotreeProps}
          />
        </svg>
      </div>
    );
  }
}

Tree.defaultProps = {
  id: "alignmentjs",
  site_size: 20,
  sender: "main"
};

export default Tree;
