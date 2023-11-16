import { max } from 'd3';


function text_width(text, size, max_width) {
  const width = Math.min(max_width, text.length);
  return width*size*0.60009765625;
}

function text_column_width(sequence_data) {
  return max(sequence_data.map(datum => {
    return text_width(datum.header, 14, 300);
  }));
}

export { text_width, text_column_width };
