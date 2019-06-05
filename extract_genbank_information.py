import sys
import json
import argparse
from itertools import chain

try:
    from Bio import SeqIO
except ImportError:
    print('BioPython not installed!')
    print('Please visit https://biopython.org/wiki/Download for instructions.')
    sys.exit(1)


parser = argparse.ArgumentParser(
    description='Write GenBank information to a JSON file for alignment.js.'
)

parser.add_argument(
    '-i', '--input',
    metavar='INPUT',
    type=str,
    help='Input GenBank file',
    required=True
)

parser.add_argument(
    '-o', '--output',
    metavar='OUTPUT',
    type=str,
    help='Output JSON file',
    required=True
)


args = parser.parse_args()


def extract_site_information(feature):
    return list(chain(*[
        [
            {
                'name': feature.qualifiers['site_type'][0],
                'site': site,
                'type': 'site'
            }
            for site in part
        ]
        for part in feature.location.parts
    ]))


def extract_region_information(feature):
    return {
        'name': feature.qualifiers['region_name'][0],
        'start': int(feature.location.start),
        'end': int(feature.location.end),
        'type': 'region'
    }


def extract_functional_information(features):
    all_information = []
    for feature in features:
          if feature.type == 'Site':
              result = extract_site_information(feature)
              all_information.append(result)
          elif feature.type == 'Region':
              result = extract_region_information(feature)
              all_information.append([result])
    return sum(all_information, [])


record = next(SeqIO.parse(args.input, 'genbank'))
information = extract_functional_information(record.features)

with open(args.output, 'w') as json_file:
    json.dump(information, json_file, indent=2)

