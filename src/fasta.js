function fastaParser(fasta) {
  const lines = fasta.split('\n');

  var alignment_data = [],
    names = [],
    seq,
    name,
    line;

  function seq2JSON(seq){
    return seq.split('')
      .map((char,i) => {
        return {
          char: char,
          j:i+1,
          i:names.length,
          name:name
        };
      ;})
  }

  for (var i = 0; i < lines.length; i++){
    line = lines[i];
    if (line[0] == '>'){
      if(i != 0) {
        alignment_data = alignment_data.concat(seq2JSON(seq));
      }
      name = line.slice(1);
      names.push(name);
      seq = '';
    } else {
      seq += line;
    }
  }

  alignment_data = alignment_data.concat(seq2JSON(seq));
  return { 
    alignment_data: alignment_data,
    names: names
  };
}

module.exports = fastaParser;
