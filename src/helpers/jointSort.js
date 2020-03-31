import { max } from "d3";

function sortFASTAAndNewick(sequence_data, tree, strict) {
  var i = 0;
  tree.traverse_and_compute(function(n) {
    var d = 1;
    if (!n.name) {
      n.name = "Node" + i++;
    }
    if (n.children && n.children.length) {
      d += max(n.children, function(d) {
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
  if (strict) {
    const number_of_leaves = ordered_leaf_names.length,
      lengths_agree = number_of_leaves == sequence_data.length;
    if (!lengths_agree) {
      throw "Different number of leaves and sequences!";
    }
    sequence_data.forEach((record, index) => {
      const leaf = ordered_leaf_names[index],
        header = record.header;
      if (leaf != header) {
        throw `Tree/alignment mismatch at ${i}: ${leaf}/${header}.`;
      }
    });
  }
  return tree;
}

export default sortFASTAAndNewick;
