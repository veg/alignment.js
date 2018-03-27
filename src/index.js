import React, { Component } from 'react';
import { 
  Nav, Navbar, NavbarBrand, NavDropdown, MenuItem, Modal, Button, Grid, Row, Col, Glyphicon
} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import html2canvas from 'html2canvas';

const d3 = require('d3');
const _ = require('underscore');

import Alignment from './alignment';
import { 
  highlight_codon_color,
  highlight_codon_text_color,
  amino_acid_color,
  amino_acid_text_color
} from './colors';
import canvasToImage from 'canvas-to-image';
require('./jav.css');

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
      text_color: highlight_codon_text_color,
      width_in_characters: 30
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
  drawPicture(){
    html2canvas(document.getElementById('jsav-div'))
      .then(canvas => {
        /* There is an overflow bug in html2canvas... below hints at a solution
        var context = canvas.getContext("2d");
        context.beginPath();
        context.fillStyle = "#f00";
        context.rect(300, 100, 50, 50);
        context.fill();
        context.closePath();
        */
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = 'somefilename.png';
        a.click();
        a.remove();
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
          <Col xs={10}>
            <h4>{examples[this.state.dataset].purpose}</h4>
          </Col>
          <Col xs={2}>
            <Button className="pull-right" onClick={()=>this.drawPicture()}>
              <Glyphicon glyph='picture' /> Save Image
            </Button>
          </Col>
          <Col xs={12}>
            <Alignment
              fasta={this.state.fasta}
              width={1200}
              height={800}
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
