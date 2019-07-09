import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
const $ = require("jquery");

import Home from "./app/home.jsx";
import * as FASTA from "./app/FASTA.jsx";
import * as FNA from "./app/FNA.jsx";
import * as BAM from "./app/BAM.jsx";
import Components from "./app/Components.jsx";
import PreventDefaultPatch from "./prevent_default_patch";
import "./app/styles.scss";

function Divider(props) {
  return [
    <div className="dropdown-divider" key="divider-div" />,
    props.header ? (
      <h6 className="dropdown-header" key="divider-header">
        {props.header}
      </h6>
    ) : null
  ];
}

function Link(props) {
  return (
    <NavLink className="dropdown-item link" to={props.to}>
      {props.header}
    </NavLink>
  );
}

function Dropdown(props) {
  return (
    <ul className="navbar-nav ">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {props.title}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {props.children}
        </div>
      </li>
    </ul>
  );
}

function FASTALinks(props) {
  return (
    <Dropdown title={"FASTA"}>
      <Link to="/fasta-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/fasta-aminoacid" header="Amino acid alignment" />
      <Link to="/fasta-highlight" header="Highlight individual sites" />
      <Link to="/fasta-start" header="Start at a given sequence and site" />
      <Link to="/fasta-lowercase" header="Lower case alignment" />
      <Link to="/fasta-svg" header="SVG alignment" />
    </Dropdown>
  );
}

function FNALinks(props) {
  return (
    <Dropdown title={"FNA"}>
      <Link to="/fna-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/fna-immunology" header="Immunology - heavy chain regions" />
      <Link to="/fna-hiv" header="HIV - site annotations" />
      <Link to="/fna-basesvgtree" header="BaseSVGTreeInstance" />
    </Dropdown>
  );
}

function BAMLinks(props) {
  return (
    <Dropdown title={"BAM"}>
      <Link to="/sam-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/sam-variantcaller" header="Variant caller" />
      <Link to="/sam-scaffold" header="Scaffold viewer" />
    </Dropdown>
  );
}

function NavBar(props) {
  const show_import_export = props.viewing == "alignment";
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          Javascript Alignment Viewer
        </NavLink>
        <div className="collapse navbar-collapse">
          <FASTALinks />
          <FNALinks />
          <BAMLinks />
        </div>
      </nav>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    return (
      <div>
        <NavBar />
        <div style={{ maxWidth: 1140 }} className="container-fluid">
          <Route exact path="/" render={props => <Home />} />

          <Route path="/fasta-viewer" render={props => <FASTA.FASTAViewer />} />
          <Route path="/fasta-aminoacid" component={FASTA.AminoAcid} />
          <Route path="/fasta-highlight" component={FASTA.Highlight} />
          <Route path="/fasta-start" component={FASTA.StartAtSiteAndSequence} />
          <Route path="/fasta-lowercase" component={FASTA.Lowercase} />
          <Route path="/fasta-svg" component={FASTA.SVGAlignmentExample} />

          <Route path="/fna-viewer" component={FNA.FNAViewer} />
          <Route path="/fna-immunology" component={FNA.Immunology} />
          <Route path="/fna-hiv" component={FNA.HIV} />
          <Route path="/fna-basesvgtree" component={FNA.BaseSVGTreeInstance} />

          <Route path="/sam-viewer" component={BAM.BAMViewer} />
          <Route path="/sam-scaffold" component={BAM.ScaffoldExample} />
          <Route path="/sam-variantcaller" component={BAM.VariantCaller} />
        </div>
      </div>
    );
  }
}

function Main(props) {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

PreventDefaultPatch(document);
ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
);
