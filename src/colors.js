const nucleotide_colors = {
    A: 'LightPink',
    G: 'LemonChiffon',
    T: 'LightBlue',
    C: 'MediumPurple',
    "-": 'lightgrey'
  },
  nucleotide_text_colors = {
    A: 'Red',
    G: 'GoldenRod',
    T: 'Blue',
    C: 'DarkMagenta',
    "-": 'DarkGrey'
  },
  amino_acid_colors = {
    '-': "Snow",
    "A": "lightblue",
    "C": "pink",
    "D": "LightSteelBlue",
    "E": "purple",
    "F": "AntiqueWhite",
    "G": "LightSalmon",
    "H": "CadetBlue",
    "I": "Crimson",
    "K": "DarkCyan",
    "L": "DarkKhaki",
    "M": "steelblue",
    "N": "DarkSeaGreen",
    "P": "yellow",
    "Q": "lightgreen",
    "R": "orange",
    "S": "green",
    "T": "DeepSkyBlue",
    "V": "Gold",
    "W": "HotPink",
    "Y": "IndianRed"
  },
  nucleotide_color = (character, position, header) => {
    return nucleotide_colors[character];
  },
  nucleotide_text_color = (character, position, header) => {
    return nucleotide_text_colors[character];
  },
  highlight_codon_color = (character, position, header) => {
    if(header=='DUCK_VIETNAM_272_2005' && Math.floor(position/3) == 3) return 'red';
    return character == "-" ? "white" : "GhostWhite";
  },
  highlight_codon_text_color = (character, position, header) => {
    return character == "G" ? "Gold" : nucleotide_colors[character];
  },
  amino_acid_color = (character, position, header) => {
    return amino_acid_colors[character];
  },
  amino_acid_text_color = (character, position, header) => {
    return 'black';
  };

module.exports.nucleotide_color = nucleotide_color;
module.exports.nucleotide_text_color = nucleotide_text_color;
module.exports.highlight_codon_color = highlight_codon_color;
module.exports.highlight_codon_text_color = highlight_codon_text_color;
module.exports.amino_acid_color = amino_acid_color;
module.exports.amino_acid_text_color = amino_acid_text_color ;
