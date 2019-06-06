const ambiguous_color = "DarkGrey",
  ambiguous_text_color = "black";

const nucleotide_colors = {
    a: "LightPink",
    g: "LemonChiffon",
    t: "LightBlue",
    c: "MediumPurple",
    y: ambiguous_color,
    r: ambiguous_color,
    w: ambiguous_color,
    s: ambiguous_color,
    k: ambiguous_color,
    m: ambiguous_color,
    d: ambiguous_color,
    v: ambiguous_color,
    h: ambiguous_color,
    b: ambiguous_color,
    n: ambiguous_color,
    x: ambiguous_color,
    A: "LightPink",
    G: "LemonChiffon",
    T: "LightBlue",
    C: "MediumPurple",
    Y: ambiguous_color,
    R: ambiguous_color,
    W: ambiguous_color,
    S: ambiguous_color,
    K: ambiguous_color,
    M: ambiguous_color,
    D: ambiguous_color,
    V: ambiguous_color,
    H: ambiguous_color,
    B: ambiguous_color,
    N: ambiguous_color,
    X: ambiguous_color,
    "-": "lightgrey"
  },
  nucleotide_text_colors = {
    a: "Red",
    g: "GoldenRod",
    t: "Blue",
    c: "DarkMagenta",
    y: ambiguous_text_color,
    r: ambiguous_text_color,
    w: ambiguous_text_color,
    s: ambiguous_text_color,
    k: ambiguous_text_color,
    m: ambiguous_text_color,
    d: ambiguous_text_color,
    v: ambiguous_text_color,
    h: ambiguous_text_color,
    b: ambiguous_text_color,
    n: ambiguous_text_color,
    x: ambiguous_text_color,
    A: "Red",
    G: "GoldenRod",
    T: "Blue",
    C: "DarkMagenta",
    Y: ambiguous_text_color,
    R: ambiguous_text_color,
    W: ambiguous_text_color,
    S: ambiguous_text_color,
    K: ambiguous_text_color,
    M: ambiguous_text_color,
    D: ambiguous_text_color,
    V: ambiguous_text_color,
    H: ambiguous_text_color,
    B: ambiguous_text_color,
    N: ambiguous_text_color,
    X: ambiguous_text_color,
    "-": "DarkGrey"
  },
  amino_acid_colors = {
    "-": "Snow",
    a: "lightblue",
    c: "pink",
    d: "LightSteelBlue",
    e: "purple",
    f: "AntiqueWhite",
    g: "LightSalmon",
    h: "CadetBlue",
    i: "Crimson",
    k: "DarkCyan",
    l: "DarkKhaki",
    m: "steelblue",
    r: "DarkSeaGreen",
    p: "yellow",
    q: "lightgreen",
    r: "orange",
    s: "green",
    t: "DeepSkyBlue",
    v: "Gold",
    w: "HotPink",
    x: "black",
    y: "IndianRed",
    A: "lightblue",
    C: "pink",
    D: "LightSteelBlue",
    E: "purple",
    F: "AntiqueWhite",
    G: "LightSalmon",
    H: "CadetBlue",
    I: "Crimson",
    K: "DarkCyan",
    L: "DarkKhaki",
    M: "steelblue",
    N: "DarkSeaGreen",
    P: "yellow",
    Q: "lightgreen",
    R: "orange",
    S: "green",
    T: "DeepSkyBlue",
    V: "Gold",
    W: "HotPink",
    X: "black",
    Y: "IndianRed"
  },
  nucleotide_color = (character, position, header) => {
    return nucleotide_colors[character];
  },
  nucleotide_text_color = (character, position, header) => {
    return nucleotide_text_colors[character];
  },
  amino_acid_color = (character, position, header) => {
    return amino_acid_colors[character];
  },
  amino_acid_text_color = (character, position, header) => {
    return character.toUpperCase() != "X" ? "black" : "white";
  },
  nucleotide_difference = desired_record => {
    const desired_header = desired_record.header,
      desired_sequence = desired_record.seq;
    return (mol, site, header) => {
      const desired_color = nucleotide_colors[mol];
      if (mol == "-") return nucleotide_colors["-"];
      if (header == desired_header) return desired_color;
      return mol == desired_sequence[site - 1] ? "white" : desired_color;
    };
  };

export {
  nucleotide_color,
  nucleotide_text_color,
  nucleotide_difference,
  amino_acid_color,
  amino_acid_text_color
};
