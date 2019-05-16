class BAMReader {
  constructor(bam_file) {
    this.bam_file = bam_file;
  }
  bamToFasta(bam_record, window_start, window_end) {
    const query = bam_record.getReadBases(),
      cigar_information = bam_record
        .cigar()
        .split(/(\d+|[A-Z])/)
        .filter(x => x),
      number_of_cigar_pairs = cigar_information.length / 2;
    var alignment = "",
      position = 0,
      action,
      stride,
      match,
      insertion,
      deletion;

    for (var i = 0; i < number_of_cigar_pairs; i++) {
      stride = +cigar_information[2 * i];
      action = cigar_information[2 * i + 1];
      match = action == "M";
      insertion = action == "I";
      deletion = action == "D";
      if (match || insertion) {
        if (match) {
          alignment += query.slice(position, position + stride);
        }
        position += stride;
      } else if (deletion) {
        if (alignment.length > 0 || i < number_of_cigar_pairs) {
          alignment += "-".repeat(stride);
        }
      }
    }

    const reference_start = bam_record.get("start"),
      reference_end = bam_record.get("end"),
      left_pad_amount = Math.max(0, reference_start - window_start),
      left_pad = "-".repeat(left_pad_amount),
      right_pad_amount = Math.max(0, window_end - reference_end),
      right_pad = "-".repeat(right_pad_amount),
      left_trim_amount = Math.max(0, window_start - reference_start),
      right_trim_amount = Math.max(0, reference_end - window_end),
      full_length = alignment.length,
      inner_fasta = alignment.slice(
        left_trim_amount,
        full_length - right_trim_amount
      );

    const fasta_record = {
      header: bam_record.get("name"),
      seq: left_pad + inner_fasta + right_pad
    };

    return fasta_record;
  }
  async fasta_window(start_site, end_site) {
    const header = await this.bam_file.getHeader(),
      reference = header[1].data[0].value;
    return await this.bam_file
      .getRecordsForRange(reference, start_site, end_site)
      .then(records => {
        const fasta = records.map(bam_record => {
          return this.bamToFasta(bam_record, start_site, end_site);
        });
        fasta.number_of_sequences = fasta.length;
        fasta.number_of_sites = fasta[0].seq.length;
        return fasta;
      });
  }
}

module.exports = BAMReader;
