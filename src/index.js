import React, { Component } from 'react';
import { 
  Nav, Navbar, NavbarBrand, NavDropdown, MenuItem, Modal, Button, Grid, Row, Col
} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
const d3 = require('d3');
const _ = require('underscore');

import Alignment from './alignment';
require('./jav.css');

const colors = {
    A: 'LightPink',
    G: 'LemonChiffon',
    T: 'LightBlue',
    C: 'MediumPurple',
    "-": 'lightgrey'
  },
  text_colors = {
    A: 'Red',
    G: 'GoldenRod',
    T: 'Blue',
    C: 'DarkMagenta',
    "-": 'DarkGrey'
  },
  amino_acid_colors = {
    '-': "Snow",
    "A": "lightblue",
    "C": "pink",
    "D": "LightSteelBlue",
    "E": "purple",
    "F": "AntiqueWhite",
    "G": "LightSalmon",
    "H": "CadetBlue",
    "I": "Crimson",
    "K": "DarkCyan",
    "L": "DarkKhaki",
    "M": "steelblue",
    "N": "DarkSeaGreen",
    "P": "yellow",
    "Q": "lightgreen",
    "R": "orange",
    "S": "green",
    "T": "DeepSkyBlue",
    "V": "Gold",
    "W": "HotPink",
    "Y": "IndianRed"
  },
  nucleotide_text_color = (character, position, header) => {
    return text_colors[character];
  },
  nucleotide_color = (character, position, header) => {
    return colors[character];
  },
  highlight_codon_color = (character, position, header) => {
    if(header=='DUCK_VIETNAM_272_2005' && Math.floor(position/3) == 3) return 'red';
    return character == "-" ? "white" : "GhostWhite";
  },
  highlight_codon_text_color = (character, position, header) => {
    return character == "G" ? "Gold" : colors[character];  
  },
  amino_acid_color = (character, position, header) => {
    return amino_acid_colors[character];
  },
  amino_acid_text_color = (character, position, header) => {
    return 'black';
  };

const examples = {
  loading: {},
  CD2: {
    purpose: "Display a nucleotide alignment.",
    props: {
      site_color: nucleotide_color,
      text_color: nucleotide_text_color
    }
  },
  CD2_AA: {
    purpose: "Display an amino acid alignment.",
    props: {
      site_color: amino_acid_color,
      text_color: amino_acid_text_color
    }
  },
  Flu: {
    purpose: "Highlight an individual site in an alignment.",
    props: {
      site_color: highlight_codon_color,
      text_color: highlight_codon_text_color,
      width_in_characters: 30
    }
  },
  Simple: {
    purpose: "Display a very small alignment.",
    props: {
      site_color: nucleotide_color,
      text_color: nucleotide_text_color
    }
  },
  H3trunk: {
    purpose: "Begin centered on a given sequence (CY010004) and site (100).",
    props: {
      site_color: nucleotide_color,
      text_color: nucleotide_text_color,
      centerOnSite: 100,
      centerOnHeader: 'CY010004'
    }
  },
  H3Full: {
    purpose: "Display a large alignment.",
    props: {
      site_color: nucleotide_color,
      text_color: nucleotide_text_color
    }
  }
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      fasta: '',
      modal: null,
      dataset: 'loading'
    };
  }
  componentDidMount(){
    this.loadData('CD2');
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
      document.getElementById('sequences').click();
    }
  }
  handleTextInput(){
    this.setState({modal: 'input'});
  }
  handleExport(){
    this.setState({modal: 'export'});
  }
  handleModalClose(){
    this.setState({modal: null});
  }
  handleTextUpdate(){
    this.setState({
      modal: null,
      fasta: document.getElementById("input_textarea").value
    });
  }
  loadData(dataset){
    d3.text(`fasta/${dataset}.fasta`, (error, data) => {
      this.setState({
        dataset: dataset,
        fasta: data
      });
    });
  }
  render(){
    const modal_title = this.state.modal == 'input'
      ? 'Paste sequence data' 
      : 'Export sequence data',
      modal_value = this.state.modal == 'input' ? null : this.state.fasta;
    return(<div>
      <Navbar className="navbar-fixed-top">
        <Navbar.Header>
          <Navbar.Brand>Javascript Alignment Viewer</Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavDropdown title="Sequences" id="sequences">
            <MenuItem onClick={()=>this.handleTextInput()}>Input text</MenuItem>
            <li role="presentation">
              <a role="menuitem">
                <input type='file' onChange={event=>this.handleFileChange(event)}/>
              </a>
            </li>
            <MenuItem divider />
            <MenuItem onClick={()=>this.handleExport()}>Export</MenuItem>
          </NavDropdown>
          <NavDropdown title="Examples" id="examples">
            {_.keys(examples)
              .slice(1)
              .map(name => {
              return (<MenuItem
                key={name}
                onClick={()=>this.loadData(name)}
              >
                {name}
              </MenuItem>);
            })}
          </NavDropdown>
        </Nav>
      </Navbar>
     
      <div>
        <Modal
          show={Boolean(this.state.modal)}
          onHide={()=>this.handleModalClose()}
        >
          <Modal.Header>
            <Modal.Title>{modal_title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <textarea
              type="text"
              id="input_textarea"
              defaultValue={modal_value}
              cols={60}
              rows={25}
              style={{fontFamily: "Courier"}}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={()=>this.handleModalClose()}>Close</Button>
            {this.state.modal == 'input' ? 
              <Button
                bsStyle="primary"
                onClick={()=>this.handleTextUpdate()}
              >
                Save changes
              </Button>
            : null }
          </Modal.Footer>
        </Modal>
      </div>
     
      <Grid>
        <Row>
          <Col xs={12}>
            <h4>{examples[this.state.dataset].purpose}</h4>
          </Col>
          <Col xs={12}>
            <Alignment
              fasta={this.state.fasta}
              {...examples[this.state.dataset].props}
            />
          </Col>
        </Row>
      </Grid>
    </div>);
  }
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)
