import { phylotree } from "phylotree";

import sortFASTAAndNewick from "./jointSort.js";

function fastaParser(fasta) {
  if (typeof fasta == "object") return fasta;
  var seqs = [],
    header,
    in_header,
    start,
    seq;
  for (let i = 0; i < fasta.length; i++) {
    if (fasta[i] == ">" || i == fasta.length - 1) {
      if (header) {
        seq = fasta.slice(start, i).replace(/\s/g, "");
        seqs.push({
          header: header,
          seq: seq
        });
      }
      in_header = true;
      start = i + 1;
    }
    if (fasta[i] == "\n" && in_header) {
      in_header = false;
      header = fasta.slice(start, i);
      start = i + 1;
    }
  }
  seqs.number_of_sequences = seqs.length;
  seqs.number_of_sites = seqs[0].seq.length;
  return seqs;
}

function fastaToText(fasta) {
  return (
    fasta.map(entry => ">" + entry.header + "\n" + entry.seq).join("\n") + "\n"
  );
}

function fnaParser(fna, sortFASTA) {
  var i = fna.length - 2,
    current_char = fna[i];
  while (current_char != "\n") {
    i--;
    current_char = fna[i];
  }
  const sequence_data = fastaParser(fna.slice(0, i + 1)),
    newick = fna.slice(i + 1, fna.length - 1),
    tree = new phylotree(newick);
  if (sortFASTA) {
    sortFASTAAndNewick(sequence_data, tree);
  }
  return { sequence_data, tree };
}

function fnaToText(fna) {
  return (
    fna.sequence_data
      .map(record => {
        return ">" + record.header + "\n" + record.seq;
      })
      .join("\n") +
    "\n" +
    fna.tree.newick_string
  );
}

export default fastaParser;
export { fastaToText, fnaParser, fnaToText };
