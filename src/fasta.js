function fastaParser(fasta) {
  const lines = fasta.split('\n');

  var sequences = [],
    seqrecord = {},
    seq,
    line;

  for (var i = 0; i < lines.length; i++){
    line = lines[i];
    if (line[0] == '>'){
      if(i != 0) {
        seqrecord.seq = seq;
        sequences.push(seqrecord)
      }
      seqrecord = { 
        name: line.slice(1)
      };
      seq = '';
    } else {
      seq += line;
    }
  }

  seqrecord.seq = seq;
  sequences.push(seqrecord);
  return sequences;
}

module.exports = fastaParser;
