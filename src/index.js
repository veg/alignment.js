import React, { Component } from 'react';
import { 
  Nav, Navbar, NavbarBrand, NavDropdown, MenuItem,
} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
const d3 = require('d3');

import Alignment from './alignment';


class App extends Component {
  constructor(props){
    super(props);
    this.state = { fasta: null };
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
  componentDidMount(){
    d3.text('fasta/CD2.fasta', (error, data) => {
      this.setState({fasta: data});
    });
  }
  render(){
    return(<div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>Javascript Alignment Viewer</Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavDropdown title="Sequences" id="sequences">
            <MenuItem eventKey='paste'>Input text</MenuItem>
            <li role="presentation">
              <a role="menuitem">
                <input type='file' onChange={event=>this.handleFileChange(event)}/>
              </a>
            </li>
            <MenuItem divider />
            <MenuItem eventKey='export'>Export</MenuItem>
          </NavDropdown>
          <NavDropdown title="Examples" id="examples">
            <MenuItem eventKey='cd2'>CD2</MenuItem>
            <MenuItem eventKey='flu'>Flu</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
      <Alignment fasta={this.state.fasta}/>
    </div>);
  }
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)
