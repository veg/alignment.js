import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap";
const d3 = require("d3");
const _ = require("underscore");
const $ = require("jquery");

import Alignment from "./components/Alignment.jsx";
import LargeTreeAlignment from "./components/LargeTreeAlignment.jsx";
import ScaffoldViewer from "./components/ScaffoldViewer.jsx";
import {
  highlight_codon_color,
  highlight_codon_text_color,
  amino_acid_color,
  amino_acid_text_color
} from "./helpers/colors";
import NavBar from "./components/navComponents/NavBar.jsx";
import SiteBarPlotExample from "./components/SiteBarPlotExample.jsx";
require("./app.scss");

const examples = {
  loading: {},
  CD2: {
    purpose: "Display a nucleotide alignment."
  },
  CD2_AA: {
    purpose: "Display an amino acid alignment.",
    props: {
      site_color: amino_acid_color,
      text_color: amino_acid_text_color
    }
  },
  Flu: {
    purpose: "Highlight individual sites in an alignment.",
    props: {
      site_color: highlight_codon_color,
      text_color: highlight_codon_text_color
    }
  },
  CVF: {
    purpose: "Display an alignment with lower case letters."
  },
  Simple: {
    purpose: "Display a very small alignment."
  },
  H3trunk: {
    purpose: "Begin centered on a given sequence (CY010004) and site (100).",
    props: {
      centerOnSite: 100,
      centerOnHeader: "CY010004"
    }
  },
  H3full: {
    purpose: "Display a large alignment."
  }
};

const messages = {
  scaffold: "NGS Scaffold viewer",
  siteBarPlot: "Example Bar Plot (nucleotide composition)",
  largeTreeAlignment: "Large phylogenetic tree and alignment."
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fasta: null,
      dataset: "loading",
      viewing: null
    };
  }

  componentDidMount() {
    this.loadData("CD2");
  }

  handleFileChange = e => {
    const files = e.target.files;
    if (files.length == 1) {
      const file = files[0],
        reader = new FileReader();
      reader.onload = e => {
        this.setState({ fasta: e.target.result });
      };
      reader.readAsText(file);
    }
    document.body.click();
  };

  handleTextUpdate = () => {
    $("#importModal").modal("hide");
    this.setState({
      fasta: document.getElementById("input_textarea").value
    });
  };

  loadData = dataset => {
    if (dataset == "largeTreeAlignment") {
      d3.text("data/H3full.fasta", (fasta_error, fasta_data) => {
        d3.text("data/H3full.new", (newick_error, newick_data) => {
          this.setState({
            fasta: fasta_data,
            newick: newick_data,
            viewing: "largeTreeAlignment"
          });
        });
      });
    } else {
      d3.text(`data/${dataset}.fasta`, (error, data) => {
        this.setState({
          dataset: dataset,
          fasta: data,
          viewing: "alignment"
        });
      });
    }
  };

  changeView = view => {
    const views = {
      scaffold: { data: "data/scaffold.fasta" },
      siteBarPlot: { data: "data/CD2.fasta" }
    };
    if (view == "largeTreeAlignment") {
      d3.text("data/H3full.fasta", (fasta_error, fasta_data) => {
        d3.text("data/H3full.new", (newick_error, newick_data) => {
          this.setState({
            viewing: view,
            fasta: fasta_data,
            newick: newick_data
          });
        });
      });
    } else {
      d3.text(views[view].data, (error, data) => {
        this.setState({
          fasta: data,
          viewing: view
        });
      });
    }
  };

  render() {
    const message =
      this.state.viewing == "alignment"
        ? examples[this.state.dataset].purpose
        : messages[this.state.viewing];
    return (
      <div>
        <NavBar
          handleFileChange={this.handleFileChange}
          alignmentsToView={examples}
          loadData={this.loadData}
          fasta={this.state.fasta}
          handleTextUpdate={this.handleTextUpdate}
          loadScaffoldData={this.loadScaffoldData}
          changeView={this.changeView}
          viewing={this.state.viewing}
        />

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h4>{message}</h4>
            </div>

            <div className="col-12">
              {this.state.viewing == "alignment" ? (
                <Alignment
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
                  {...examples[this.state.dataset].props}
                />
              ) : this.state.viewing == "scaffold" ? (
                <ScaffoldViewer
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
                  centerOnSite={260}
                  centerOnHeader={"GBAV82T04B82BA"}
                />
              ) : this.state.viewing == "siteBarPlot" ? (
                <SiteBarPlotExample
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
                />
              ) : (
                <LargeTreeAlignment
                  fasta={this.state.fasta}
                  newick={this.state.newick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement("div"))
);
