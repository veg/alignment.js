/*
const d3 = require("phylotree/node_modules/d3");
require("phylotree");

import fastaParser from "./fasta";

function sortFASTAAndNewick(sequence_data, newick, size) {
  const number_of_sequences = sequence_data.length,
    phylotree = d3.layout
      .phylotree()
      .options({
        "left-right-spacing": "fit-to-size",
        "top-bottom-spacing": "fit-to-size",
        "show-scale": false,
        "align-tips": true,
        "show-labels": false,
        selectable: false
      })
      .size(size)
      .node_circle_size(0),
    tree_json = d3.layout.newick_parser(newick);
  phylotree(tree_json);

  var i = 0;
  phylotree.traverse_and_compute(function(n) {
    var d = 1;
    if (!n.name) {
      n.name = "Node" + i++;
    }
    if (n.children && n.children.length) {
      d += d3.max(n.children, function(d) {
        return d["count_depth"];
      });
    }
    n["count_depth"] = d;
  });

  phylotree.resort_children(
    function(a, b) {
      return a["count_depth"] - b["count_depth"];
    },
    null,
    null,
    true
  );

  const ordered_leaf_names = phylotree
    .get_nodes(true)
    .filter(d3.layout.phylotree.is_leafnode)
    .map(d => d.name);

  sequence_data.sort((a, b) => {
    const a_index = ordered_leaf_names.indexOf(a.header),
      b_index = ordered_leaf_names.indexOf(b.header);
    return a_index - b_index;
  });

  return {
    phylotree,
    tree_json
  };
}

module.exports = sortFASTAAndNewick;
*/
