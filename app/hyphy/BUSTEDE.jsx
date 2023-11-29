import React, { Component } from "react";
import { text } from "d3-fetch";
import { saveAs } from "file-saver";
import { saveSvgAsPng as savePNG } from "save-svg-as-png";
import pako from "pako";
import { max, min, csvParse, scaleLinear, scaleLog, interpolateRdYlBu } from "d3";
import _ from "lodash";
import { phylotree } from "phylotree"

import fastaParser, { fastaToText } from "../../src/helpers/fasta";
import Alignment from "../../src/Alignment.jsx";
import Button from "../../src/components/Button.jsx";
import FileUploadButton from "../FileUploadButton.jsx";
import Modal from "../Modal.jsx";
import SVGAlignment from "../../src/SVGAlignment.jsx";
import { nucleotide_color, nucleotide_difference } from "../../src/helpers/colors";


const ambiguous_codes = {
  'A' : ['A'],
  'C' : ['C'],
  'G' : ['G'],
  'T' : ['T'],
  'U' : ['T'],
  'R' : ['A','G'],
  'Y' : ['C','T'],
  'K' : ['G','T'],
  'M' : ['A','C'],
  'S' : ['C','G'],
  'W' : ['A','T'],
  'B' : ['C','G','T'],
  'D' : ['A','G','T'],
  'H' : ['A','C','T'],
  'V' : ['A','C','T'],
  'N' : ['A','C','G','T'],
  '?' : ['A','C','G','T']
}


var code = csvParse ("Codon,AA\nTTT,F\nTCT,S\nTAT,Y\nTGT,C\nTTC,F\nTCC,S\nTAC,Y\nTGC,C\nTTA,L\nTCA,S\nTAA,*\nTGA,*\nTTG,L\nTCG,S\nTAG,*\nTGG,W\nCTT,L\nCCT,P\nCAT,H\nCGT,R\nCTC,L\nCCC,P\nCAC,H\nCGC,R\nCTA,L\nCCA,P\nCAA,Q\nCGA,R\nCTG,L\nCCG,P\nCAG,Q\nCGG,R\nATT,I\nACT,T\nAAT,N\nAGT,S\nATC,I\nACC,T\nAAC,N\nAGC,S\nATA,I\nACA,T\nAAA,K\nAGA,R\nATG,M\nACG,T\nAAG,K\nAGG,R\nGTT,V\nGCT,A\nGAT,D\nGGT,G\nGTC,V\nGCC,A\nGAC,D\nGGC,G\nGTA,V\nGCA,A\nGAA,E\nGGA,G\nGTG,V\nGCG,A\nGAG,E\nGGG,G\n");
var translation_table= {};
_.each (code, (v,k) => {translation_table[v.Codon] = v.AA;});
translation_table["---"] = "-";
translation_table["NNN"] = "?";


function translate_ambiguous_codon(codon) {
  if (codon in translation_table) {
    return  translation_table[codon];
  }

  let options = {};
  _.each (ambiguous_codes[codon[0]], (n1)=> {
       _.each (ambiguous_codes[codon[1]], (n2)=> {
          _.each (ambiguous_codes[codon[2]], (n3)=> {
              let c = translation_table[n1+n2+n3];
              if (c in options) {
                options[c] += 1; 
              } else {
                options [c] = 1; 
              }
          });
        });
  });

  options = _.keys(options);
  if (options.length == 0) {
    return "?"; 
  }
  return _.sortBy (options).join ("");
}


function generateNodeLabels(T, labels) {
  let L = {};
  T.traverse_and_compute (function (n) {
      if (n.data.name in labels) {
          L[n.data.name] = [labels[n.data.name], translate_ambiguous_codon (labels[n.data.name]),'',0];
          if (n.parent) {
            L[n.data.name][2] = L[n.parent.data.name][0];             
            _.each (L[n.data.name][0], (c,i)=> {
                const c2 = L[n.data.name][2][i];
                if (c2 != c && c != '-' && c2 != '-') {
                  L[n.data.name][3] ++;
                }
            });
          }
      } else {
        if (n.parent) {
          L[n.data.name] = _.clone (L[n.parent.data.name]);
          L[n.data.name][2] = L[n.data.name][0];
          L[n.data.name][3] = 0;
        } else {
          L['root'] = [labels["root"], translate_ambiguous_codon (labels["root"]), "", 0];
        }
      }
  },"pre-order");
  return L;
}


function codonComposition(bustede, tree_objects) {
  let results = [];
  let offset = 0;
  let filter = null;
  let diff_mode = true;
  _.each (bustede["substitutions"], (data, partition) => {
      _.each (data, (per_site, site)=> {
            if (filter && ! filter (site, partition)) return;
            let info = generateNodeLabels (tree_objects[partition], per_site);
            
             if (diff_mode == false) {
                 _.each (info, (p,i)=> {
                    results.push ({'Key' : i + "|" + ((+site) + offset + 1), 'value' : p[0], 'aa' : p[1]});
                 });
             } else {
               const root_label = info['root'][0];
               _.each (info, (p,i)=> {
                    let codon_label = _.map (p[0], (c,i)=>c == root_label[i] ? '.' : c).join ("");
                    if (i == 'root') codon_label = p[0];
                    results.push ({'Key' : i + "|" + ((+site) + offset + 1), 'value' : codon_label, 'aa' : p[1]});
               });
             }
            
      });
    
      offset += _.size (data);
  });
  return results;
}


function get_error_sink_rate(results_json, tag) {
  let rd = _.get (results_json, ["fits","Unconstrained model","Rate Distributions", tag, "0"]);
  return rd;
}

function posteriorsPerBranchSite(results_json, rate_class, prior_odds) {
  let results = [];
  let offset = 0;
  _.each (results_json["branch attributes"], (data, partition) => {
      let partition_size = 0;
      _.each (data, (per_branch, branch)=> {
          if (per_branch ["Posterior prob omega class by site"]) {
            _.each (per_branch ["Posterior prob omega class by site"][rate_class], (p,i)=> {
                results.push ({'Key' : branch + "|" + (i + offset + 1), 'Posterior' : p, 'ER' : (p/(1-p))/prior_odds});
            });     
            partition_size = per_branch ["Posterior prob omega class by site"][rate_class].length;
          }
      });
      offset += partition_size;
  });
  return results;
}

class BUSTEDE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      site_size: 20,
      show_differences: "",
      saving: false
    };
  }
  componentDidMount() {
    const search_params = new URLSearchParams(location.search),
      //url = search_params.get("hyphyURL") || "data/bglobin.nex.BUSTED.json.gz";
      url = search_params.get("hyphyURL") || "data/Flu.fna.BUSTED.json.gz";
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.arrayBuffer();
      }).then(buffer => {
        const decompressed = pako.inflate(buffer, { to: 'string' });
        this.loadBUSTEDEGZip(JSON.parse(decompressed));
      });
  }
  loadBUSTEDEGZip(bustede) {
    const tree_objects = _.map (bustede.input.trees, (tree,i)=> {
        let T = new phylotree(tree);
        T.branch_length_accessor = (n)=>busted_e["branch attributes"][i][n.data.name]["Global MG94xREV"];
        return T;
      }),
      subs = codonComposition(bustede, tree_objects),
      groups = _.groupBy(subs, sub => {
        return sub.Key.split('|')[0]
      }),
      weight = get_error_sink_rate (bustede, "Test")["proportion"],
      ppbs = posteriorsPerBranchSite (bustede, 0, weight / (1-weight)),
      ppbs_groups = _.groupBy(ppbs, datum => {
        return datum.Key.split('|')[0]
      }),
      sequence_data = _.map(groups, (value, key) => {
        return {
          header: key,
          seq: value.map((v, i) => {
            return v.value.split('').map((c, ci) => {
              return c == '.' ? groups.root[i].value[ci] : c;
            }).join('');
          }).join(''),
          er: _.map(ppbs_groups[key], 'ER')
        }
      });
    sequence_data.number_of_sequences = sequence_data.length;
    sequence_data.number_of_sites = sequence_data[0].seq.length;
    this.setState({
      data: sequence_data,
      show_differences: ""
    });
  }
  saveFASTA() {
    const blob = new Blob([fastaToText(this.state.data)], {
      type: "text/plain:charset=utf-8;"
    });
    saveAs(blob, "sequences.fasta");
  }
  siteColor() {
    const sequence_data = this.state.data,
      ers = _.flatten(_.map(sequence_data, 'er')),
      dataMin = min(ers),
      dataMax = max(ers),
      sequence_data_by_header = _.keyBy(sequence_data, 'header'),
      logScale = scaleLog()
        .domain([dataMin, 1, dataMax])
        .range([0, 0.5, 1]),
      colorScale = scaleLinear()
        .domain([0, 0.5, 1])
        .range(['#0000FF', '#EEEEEE', '#FF0000']);
    //debugger;
    return function(character, position, header) {
      try {
      const er = header == 'root' ?
        1 :
        sequence_data_by_header[header].er[Math.floor((position-1)/3)];
      return colorScale(logScale(er));
      }
      catch {
        debugger;
      }
    };
  }
  molecule() {
    if (!this.state.show_differences) return molecule => molecule;
    const data = this.state.saving
        ? this.state.trimmed_sequence_data
        : this.state.data,
      desired_record = data.filter(
        datum => datum.header == this.state.show_differences
      )[0];
    return (mol, site, header) => {
      if (mol == "-") return "-";
      if (header == desired_record.header) return mol;
      return mol == desired_record.seq[site - 1] ? "." : mol;
    };
  }
  handleFileChange = e => {
    const files = e.target.files;
    if (files.length == 1) {
      const file = files[0],
        reader = new FileReader();
      reader.onload = e => {
        this.loadFASTA(e.target.result);
      };
      reader.readAsText(file);
    }
  };
  scrollExcavator = () => {
    return this.scrollExcavator.broadcaster.location();
  };
  trimData = (start_site, end_site) => {
    return this.state.data.map(record => {
      const new_record = {
        header: record.header,
        seq: record.seq.slice(start_site, end_site)
      };
      return new_record;
    });
  };
  saveAsPNG = () => {
    const saving = true;
    const { x_pixel, x_pad, x_fraction, y_fraction } = this.scrollExcavator(),
      start_site = Math.floor(x_pixel / this.state.site_size),
      end_site = Math.ceil((x_pixel + x_pad) / this.state.site_size),
      axis_bounds = [start_site, end_site],
      trimmed_sequence_data = this.trimData(start_site, end_site);
    trimmed_sequence_data.number_of_sequences = trimmed_sequence_data.length;
    trimmed_sequence_data.number_of_sites = trimmed_sequence_data[0].seq.length;
    this.setState({ saving, trimmed_sequence_data, axis_bounds }, () => {
      savePNG(document.getElementById("alignment-js-svg"), "alignment.png");
      this.setState({ saving: false }, () => {
        this.scrollExcavator.broadcaster.broadcast(
          x_fraction,
          y_fraction,
          "main"
        );
      });
    });
  };
  render() {
    const toolbar_style = {
      display: "flex",
      justifyContent: "space-between",
      width: 960
    };
    const options = this.state.data
      ? this.state.data.map(datum => {
          return (
            <option key={datum.header} value={datum.header}>
              {datum.header}
            </option>
          );
        })
      : null;
    return (
      <div>
        <h1>BUSTEDE Viewer Application</h1>
        <div style={toolbar_style}>
          <FileUploadButton label="Import" onChange={this.handleFileChange} />
          <Button label="Export" onClick={() => $("#modal").modal("show")} />
          <Button label="Save as PNG" onClick={this.saveAsPNG} />
          <span>
            <label>Site size:</label>
            <input
              type="number"
              value={this.state.site_size}
              min={15}
              max={100}
              step={5}
              onChange={e => this.setState({ site_size: e.target.value })}
            />
          </span>
          <span style={{ width: "100%", maxWidth: "20%" }}>
            <label>Highlight difference from:</label>
            <select
              style={{ width: "100%", maxWidth: "100%" }}
              value={this.state.show_differences}
              onChange={e =>
                this.setState({ show_differences: e.target.value })
              }
            >
              <option value={""}>None</option>
              {options}
            </select>
          </span>
        </div>
        <div>
          {this.state.saving ? (
            <SVGAlignment
              sequence_data={this.state.trimmed_sequence_data}
              molecule={this.molecule()}
              site_color={this.siteColor()}
              site_size={this.state.site_size}
              axis_bounds={this.state.axis_bounds}
            />
          ) : (
            <Alignment
              fasta={this.state.data}
              site_size={this.state.site_size}
              molecule={this.molecule()}
              site_color={this.siteColor()}
              excavator={this.scrollExcavator}
            />
          )}
        </div>
        <Modal title="Export fasta">
          <Button label="Download" onClick={() => this.saveFASTA()} />
          <div style={{ overflowY: "scroll", width: 400, height: 400 }}>
            <p>{this.state.data ? fastaToText(this.state.data) : null}</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BUSTEDE;
