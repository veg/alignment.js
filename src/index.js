import React, { Component } from 'react';
import { 
  Nav, Navbar, NavbarBrand, NavDropdown, MenuItem
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
  handleSequenceMenuSelection(key){
    console.log("I will handle the selection!", key);
  }
  componentDidMount(){
    d3.text('fasta/CD2.fasta', (error, data) => {
      this.setState({fasta: data});
    });
  }
  render(){
    return(<div>
      <Navbar onSelect={this.handleSequenceMenuSelection}>
        <Navbar.Header>
          <Navbar.Brand>Javascript Alignment Viewer</Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavDropdown title="Sequences" id="sequences">
            <MenuItem eventKey='load'>Load file</MenuItem>
            <MenuItem eventKey='paste'>Paste text</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='export'>Export</MenuItem>
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
