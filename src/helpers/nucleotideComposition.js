function siteComposition(alignmentData, callback) {
  // Takes alignmentData in the format that alignment.js uses (i.e. an array with of sequences each with {header: <header>, seq: "AGCT..."} )
  // Returns the percentage of each nucleotide in the form of: {A: [0, 0.75, 1, 0.2, etc], G: [0, 0.25, 0, 0.4, etc], etc}
  //TODO: check to ensure that all sequences are the same length and/or handle sequences of different lengths.

  var composition = {};
  const sequenceLength = alignmentData[0].seq.length;
  const numberOfSequences = alignmentData.length;

  for (const sequenceObject of alignmentData) {
    let sequence = sequenceObject.seq;

    for (var siteNumber = 0; siteNumber < sequence.length; siteNumber++) {
      let nucleotide = sequence[siteNumber];
      if (!(nucleotide in composition)) {
        composition[nucleotide] = Array(sequenceLength).fill(0);
      }
      composition[nucleotide][siteNumber]++;
    }
  }

  for (const nucleotide in composition) {
    composition[nucleotide] = composition[nucleotide].map(
      count => count / numberOfSequences
    );
  }

  if (callback) {
    callback(composition);
  } else {
    return composition;
  }
}

module.exports.siteComposition = siteComposition;
