const path = require("path"),
  fs = require("fs");

import fastaParser, { fastaToText } from "./../src/helpers/fasta";

const internalFastaDataStructure = [
    { header: "Seq1", seq: "ATCGTAATTGCA" },
    { header: "Seq2", seq: "CTCGTAATGGCC" },
    { header: "Seq3", seq: "GTCGTCAATGCT" }
  ],
  simple_path = path.resolve(__dirname, "..", "dist", "data", "Simple.fasta"),
  fasta = fs.readFileSync(simple_path).toString();

test("Imports simple fasta correctly.", () => {
  internalFastaDataStructure.number_of_sequences = 3;
  internalFastaDataStructure.number_of_sites = 12;
  const parsedFasta = fastaParser(fasta);
  expect(parsedFasta).toEqual(internalFastaDataStructure);
});

test("Converts fasta to text correctly.", () => {
  const text = fastaToText(internalFastaDataStructure);
  expect(text).toEqual(fasta);
});
