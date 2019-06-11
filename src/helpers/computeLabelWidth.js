const text_width = require("text-width");

function computeLabelWidth(sequence_data, padding) {
  const label_width = sequence_data
    .map(record => text_width(record.header, { family: "Courier", size: 14 }))
    .reduce((a, b) => Math.max(a, b), 0);
  return padding + label_width;
}

export default computeLabelWidth;
