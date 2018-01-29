import React, { Component } from 'react';
import { 
  Nav, Navbar, NavbarBrand, NavDropdown, MenuItem, Modal, Button
} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
const d3 = require('d3');

import Alignment from './alignment';
require('./jav.css');


class App extends Component {
  constructor(props){
    super(props);
    this.state = { fasta: '', modal: null };
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
      this.setState({fasta: data});
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
            {['CD2', 'CVF', 'Flu', 'Simple', 'H3trunk'].map(name => {
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
      
      <Alignment fasta={this.state.fasta} />

    </div>);
  }
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)
