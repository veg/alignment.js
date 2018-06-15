function fastaParser(fasta) {
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

module.exports = fastaParser;
