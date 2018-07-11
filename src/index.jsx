import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap";
const d3 = require("d3");
const _ = require("underscore");
const $ = require("jquery");

import Alignment from "./components/Alignment.jsx";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fasta: null,
      dataset: "loading",
      viewing: "alignment"
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
    d3.text(`fasta/${dataset}.fasta`, (error, data) => {
      this.setState({
        dataset: dataset,
        fasta: data,
        viewing: "alignment"
      });
    });
  };

  changeView = view => {
    const views = {
      scaffold: { data: "fasta/scaffold.fasta" },
      siteBarPlot: { data: "fasta/CD2.fasta" }
    };
    d3.text(views[view].data, (error, data) => {
      this.setState({
        fasta: data,
        viewing: view
      });
    });
  };

  render() {
    const message =
      this.state.viewing == "alignment"
        ? examples[this.state.dataset].purpose
        : this.state.viewing == "scaffold"
          ? "NGS Scaffold viewer"
          : "Example Bar Plot (nucleotide composition)";
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
        />

        <div className="container">
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
                />
              ) : (
                <SiteBarPlotExample
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
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
