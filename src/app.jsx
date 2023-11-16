import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter, Route, Routes, Link as RRLink } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import { FNAViewer } from './app/FNA.jsx';

import './styles.scss';


function DropdownHeader(props) {
  return (<li><h6 className="dropdown-header">{props.label}</h6></li>);
}

function NavDropdownItem(props) {
  return (<RRLink className="dropdown-item" to={props.to}>
    {props.label}
  </RRLink>);
}

function FASTALinks(props) {
  return (<NavDropdown title="FASTA" id="basic-nav-dropdown">
    <NavDropdownItem to='fasta-viewer' label='Viewer' />
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <DropdownHeader label='Custom' />
  </NavDropdown>);
}

function FNALinks(props) {
  return (<NavDropdown title="FNA" id="basic-nav-dropdown">
    <NavDropdownItem to='fna-viewer' label='Viewer' />
    <NavDropdown.Divider />
    <DropdownHeader label='Widgets' />
    <NavDropdown.Divider />
    <DropdownHeader label='Custom' />
  </NavDropdown>);
}

function ComponentLinks(props) {
  return (<NavDropdown title="Components" id="basic-nav-dropdown">
    <NavDropdownItem to='base-alignment' label='Base Alignment' />
  </NavDropdown>);
}

function HyPhyLinks(props) {
  return (<NavDropdown title="HyPhy" id="basic-nav-dropdown">
    <NavDropdownItem to='/busted-e' label="BUSTED-E (error sink)" />
  </NavDropdown>);
}

function ExamplesLinks(props) {
  return (<NavDropdown title="Examples" id="basic-nav-dropdown">
  </NavDropdown>);
}

function NavLink(props) {
  // for use within this SPA
  return (<RRLink className='nav-link' to={props.to}>
    {props.children}
  </RRLink>)
}

function Placeholder(name) {
  return function() {
    return <h1>{name} will go here.</h1>;
  }
}

function NavBar(props) {
  return (<Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="/">Alignment UI</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/docs">Documentation</NavLink>
          <FASTALinks />
          <FNALinks />
          <ComponentLinks />
          <HyPhyLinks />
          <ExamplesLinks />
        </Nav>
        <Nav>
          <Nav.Link href="https://stephenshank.com">
            By Stephen D. Shank, Ph. D.
          </Nav.Link>
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
          <Route path="/" element={React.createElement(Placeholder('Home'), null)} />
          <Route path="/about" element={React.createElement(Placeholder('About'), null)} />
          <Route path="/docs" element={React.createElement(Placeholder('Documentation'), null)} />
          <Route path="/fasta-viewer" element={React.createElement(Placeholder('FASTA Viewer'), null)} />
          <Route path="/fna-viewer" element={<FNAViewer />} />
          <Route path="/base-alignment" element={React.createElement(Placeholder('Base Alignment'), null)} />
          <Route path="/busted-e" element={React.createElement(Placeholder('BUSTED-E'), null)} />
        </Routes>
      </div>
    </div>
  );
}

function Main(props) {
  return (<React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>);
}

//PreventDefaultPatch(document);
const root_div = document.body.appendChild(document.createElement("div")),
  root = createRoot(root_div);
root.render(<Main />);

