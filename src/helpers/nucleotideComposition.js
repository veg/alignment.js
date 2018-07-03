function siteComposition(alignmentData) {
  // Takes alignmentData in the format that alignment.js uses (i.e. an array with of sequences each with {header: <header>, seq: "AGCT..."} )
  // Returns the percentage of each nucleotide in the form of: {A: [0, 0.75, 1, 0.2, etc], G: [0, 0.25, 0, 0.4, etc], etc}
  var composition = {};
  composition = "testing Function";
  return composition;
}

module.exports.siteComposition = siteComposition;
