function sortFASTAAndNewick(sequence_data, tree) {
  var i = 0;
  tree.traverse_and_compute(function(n) {
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

  tree.resort_children(function(a, b) {
    return a["count_depth"] - b["count_depth"];
  });

  const ordered_leaf_names = tree.get_tips().map(d => d.data.name);

  sequence_data.sort((a, b) => {
    const a_index = ordered_leaf_names.indexOf(a.header),
      b_index = ordered_leaf_names.indexOf(b.header);
    return a_index - b_index;
  });
  return tree;
}

export default sortFASTAAndNewick;
