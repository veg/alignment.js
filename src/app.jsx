import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import './styles.scss';


function Dropdown(props) {
  return (<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      {props.title}
    </a>
    <ul className="dropdown-menu">
      {props.children}
    </ul>
  </li>);
}

function DropdownHeader(props) {
  return (<li><h6 className="dropdown-header">{props.label}</h6></li>);
}

function FASTALinks(props) {
  return (<NavDropdown title="FASTA" id="basic-nav-dropdown">
    <NavDropdown.Item href="#action/3.1">Viewer</NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <NavDropdown.Item href='/fasta-site-bar'>
      Site bar chart
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Custom' />
    <NavDropdown.Item href="#action/3.4">
      Artificial recombination
    </NavDropdown.Item>
  </NavDropdown>);
}

function FNALinks(props) {
  return (<NavDropdown title="FNA" id="basic-nav-dropdown">
    <NavDropdown.Item href="#action/3.1">Viewer</NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <NavDropdown.Item href="#action/3.2">
      Site bar chart
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Custom' />
    <NavDropdown.Item href="#action/3.4">
      Artificial recombination
    </NavDropdown.Item>
  </NavDropdown>);
}

function ComponentLinks(props) {
  return (<NavDropdown title="Components" id="basic-nav-dropdown">
    <NavDropdown.Item href="#action/3.1">Viewer</NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <NavDropdown.Item href="#action/3.2">
      Site bar chart
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Custom' />
    <NavDropdown.Item href="#action/3.4">
      Artificial recombination
    </NavDropdown.Item>
  </NavDropdown>);
}

function ExamplesLinks(props) {
  return (<NavDropdown title="Examples" id="basic-nav-dropdown">
    <NavDropdown.Item href="#action/3.1">Scaffold viewer</NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <NavDropdown.Item href="#action/3.2">
      Site bar chart
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <DropdownHeader label='Custom' />
    <NavDropdown.Item href="#action/3.4">
      Artificial recombination
    </NavDropdown.Item>
  </NavDropdown>);
}

function Placeholder(name) {
  return function() {
    <h1>{name} will go here.</h1>;
  }
}

function NavBar(props) {
  return (<Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="/">Alignment UI</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="about">About</Nav.Link>
          <Nav.Link href="docs">Documentation</Nav.Link>
          <FASTALinks />
          <FNALinks />
          <ComponentLinks />
          <ExamplesLinks />
        </Nav>
        <Nav>
          <Nav.Link href="https://stephenshank.com">By Stephen D. Shank, Ph. D.</Nav.Link>
          <Nav.Link eventKey={2} href="http://lab.hyphy.org">
            ACME Lab
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>);
}

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 1140 }} className="container-fluid">
        <Routes>
          <Route path="/about" component={Placeholder('About')} />
          <Route
            path="/fasta-site-bar"
            component={Placeholder('FASTA site bar')}
          />
        </Routes>
      </div>
    </div>
  );
}

function Main(props) {
  return (<BrowserRouter>
    <App />
  </BrowserRouter>);
}

//PreventDefaultPatch(document);
const root_div = document.body.appendChild(document.createElement("div")),
  root = createRoot(root_div);
root.render(<Main />);

