const path = require("path"),
  fs = require("fs");

import fastaParser from "./../src/helpers/fasta";

test("Imports simple fasta correctly.", () => {
  const internalFastaDataStructure = [
    { header: "Seq1", seq: "ATCGTAATTGCA" },
    { header: "Seq2", seq: "CTCGTAATGGCC" },
    { header: "Seq3", seq: "GTCGTCAATGCT" }
  ];
  internalFastaDataStructure.number_of_sequences = 3;
  internalFastaDataStructure.number_of_sites = 12;
  const simple_path = path.resolve(
      __dirname,
      "..",
      "dist",
      "data",
      "Simple.fasta"
    ),
    fasta = fs.readFileSync(simple_path).toString(),
    parsedFasta = fastaParser(fasta);
  expect(parsedFasta).toEqual(internalFastaDataStructure);
});
