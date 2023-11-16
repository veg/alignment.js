import React, { Component } from "react";
import { text } from "d3";
import Phylotree from "react-phylotree";
import { phylotree } from "phylotree";

class DataFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount() {
    const { source } = this.props;
    text(source).then(data => this.setState({ data }));
  }
  render() {
    if (!this.state.data) {
      return null;
    }
    const { modifier, child_prop, children } = this.props,
      data = modifier(this.state.data),
      child_props = {};
    child_props[child_prop] = data;
    return React.cloneElement(children, child_props);
  }
}

DataFetcher.defaultProps = {
  modifier: data => data,
  child_prop: "data"
};

const dimensions = {
  width: 500,
  height: 500
};

function BaseSVGTreeInstance(props) {
  const instantiate_phylotree = newick => new phylotree(newick);
  return (
    <svg {...dimensions}>
      <DataFetcher
        source="data/CD2.new"
        modifier={instantiate_phylotree}
        child_prop="tree"
      >
        <Phylotree {...dimensions} />
      </DataFetcher>
    </svg>
  );
}

export { DataFetcher, BaseSVGTreeInstance };
