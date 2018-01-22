function fastaParser(fasta) {
  const lines = fasta.split('\n');

  var characters = [],
    names = [],
    seq,
    name,
    line;

  for (var i = 0; i < lines.length; i++){
    line = lines[i];
    if (line[0] == '>'){
      if(i != 0) {
        characters = characters.concat(
          seq.split('')
            .map((char,i) => {return {char: char, j:i, i:names.length, name:name};})
        );
      }
      name = line.slice(1);
      names.push(name);
      seq = '';
    } else {
      seq += line;
    }
  }

  characters = characters.concat(
    seq.split('')
      .map((char,i) => {return {char: char, j:i, i:names.length, name:name};})
  );
  return { 
    characters: characters,
    names: names
  };
}

module.exports = fastaParser;
