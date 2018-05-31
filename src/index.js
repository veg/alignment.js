import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap'
const d3 = require('d3');
const _ = require('underscore');
const $ = require('jquery');

import Alignment from './alignment';
import ScaffoldViewer from './scaffold_viewer';
import { 
  highlight_codon_color,
  highlight_codon_text_color,
  amino_acid_color,
  amino_acid_text_color
} from './colors';
require('./app.scss');


const examples = {
  loading: {},
  CD2: {
    purpose: "Display a nucleotide alignment.",
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
    purpose: "Display a very small alignment.",
  },
  H3trunk: {
    purpose: "Begin centered on a given sequence (CY010004) and site (100).",
    props: {
      centerOnSite: 100,
      centerOnHeader: 'CY010004'
    }
  },
  H3full: {
    purpose: "Display a large alignment.",
  }
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      fasta: '',
      modal: null,
      dataset: 'loading',
      viewing: 'alignment'
    };
  }
  componentDidMount(){
    //this.loadData('CD2');
    this.loadScaffoldData();
  }
  handleFileChange(e){
    const files = e.target.files;
    if (files.length == 1) {
      const file = files[0],
        reader = new FileReader();
      reader.onload = e => {
        this.setState({fasta: e.target.result});
      }
      reader.readAsText(file);
    }
    document.body.click();
  }
  handleTextInput(){
    this.setState({modal: 'input'});
    $("#myModal").modal("show") 
  }
  handleExport(){
    this.setState({modal: 'export'});
    $("#myModal").modal("show") 
  }
  handleTextUpdate(){
    $("#myModal").modal("hide") 
    this.setState({
      modal: null,
      fasta: document.getElementById("input_textarea").value
    });
  }
  loadData(dataset){
    d3.text(`fasta/${dataset}.fasta`, (error, data) => {
      this.setState({
        dataset: dataset,
        fasta: data,
        viewing: 'alignment'
      });
    });
  }
  loadScaffoldData(){
    d3.text('fasta/scaffold.fasta', (error, data) => {
      this.setState({
        fasta: data,
        viewing: 'scaffold'
      });
    });
  }
  render(){
    const message = this.state.viewing == 'alignment' ?
      examples[this.state.dataset].purpose :
      'NGS Scaffold viewer';
    return(
      <div>

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Javascript Alignment Viewer</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Sequences
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" onClick={()=>this.handleTextInput()}>Input Text</a>
                  <a className="dropdown-item" href="#">
                    <input type='file' onChange={event=>this.handleFileChange(event)}/>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" onClick={()=>this.handleExport()}>Export</a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Examples
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {_.keys(examples)
                    .slice(1)
                    .map(name => {
                      return (
                        <a
                          className="dropdown-item"
                          key={name}
                          onClick={()=>this.loadData(name)}
                        >
                          {name}
                        </a>
                      );
                  })}
                </div>
              </li>
              <li>
                <a className="nav-link" onClick={()=>this.loadScaffoldData()}>
                  Scaffold viewer
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div
          className="modal fade"
          id="myModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" > 
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  { this.state.modal == 'input' ? 'Paste sequence data' : 'Export sequence data' }
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" >
                {this.state.modal == 'input' ? (
                  <textarea
                    type="text"
                    id="input_textarea"
                    type="text"
                    cols={45}
                    rows={25}
                    style={{fontFamily: "Courier"}}
                  />
                ) : (
                  <div style={{overflow:"auto"}}>
                    {this.state.fasta}
                  </div> )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn.btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                {this.state.modal == 'input' ? 
                  <button
                    onClick={()=>this.handleTextUpdate()}
                  >
                    Save changes
                  </button>
                : null }
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12">
              <h4>{message}</h4>
            </div>
            <div className="col-12">
              { this.state.viewing == 'alignment' ? 
                <Alignment
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
                  {...examples[this.state.dataset].props}
                /> :
                <ScaffoldViewer
                  fasta={this.state.fasta}
                  width={1200}
                  height={800}
                /> }
            </div>
          </div>
        </div>
       
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)
