import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
const $ = require("jquery");

import FASTA from "./app/FASTA.jsx";
import FNA from "./app/FNA.jsx";
import SAM from "./app/SAM.jsx";
import "./app/styles.scss";

function Modal(props) {
  return (
    <div
      className="modal fade"
      id={props.id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="myModalLabel">
              {props.title}
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
          <div className="modal-body">{props.body}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn.btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            {props.bottomButton}
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.defaultProps = {
  bottomButton: null
};

function Export(props) {
  const showExportModal = () => $("#exportModal").modal("show");

  return (
    <div>
      <li>
        <a className="nav-link" onClick={showExportModal}>
          Export
        </a>
      </li>
      <Modal
        id="exportModal"
        title="Export sequence data"
        body={<div style={{ overflow: "auto" }}>{props.fasta}</div>}
      />
    </div>
  );
}

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

function FASTARoutes(props) {
  return [
    <Route key="0" path="/fasta-viewer" component={FASTA.FASTAViewer} />,
    <Route key="1" path="/fasta-aminoacid" component={FASTA.AminoAcid} />,
    <Route key="2" path="/fasta-highlight" component={FASTA.Highlight} />,
    <Route
      key="3"
      path="/fasta-start"
      component={FASTA.StartAtSiteAndSequence}
    />,
    <Route key="4" path="/fasta-lowercase" component={FASTA.Lowercase} />
  ];
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
    </Dropdown>
  );
}

function FNARoutes(props) {
  return [
    <Route key="0" path="/fna-viewer" component={FNA.FNAViewer} />,
    <Route key="1" path="/fna-immunology" component={FNA.Immunology} />,
    <Route key="2" path="/fna-hiv" component={FNA.HIV} />
  ];
}

function FNALinks(props) {
  return (
    <Dropdown title={"FNA"}>
      <Link to="/fna-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/fna-immunology" header="Immunology - heavy chain regions" />
      <Link to="/fna-hiv" header="HIV - site annotations" />
    </Dropdown>
  );
}

function SAMRoutes(props) {
  return [
    <Route key="0" path="/sam-viewer" component={SAM.SAMViewer} />,
    <Route key="1" path="/sam-variantcaller" component={SAM.VariantCaller} />
  ];
}

function SAMLinks(props) {
  return (
    <Dropdown title={"SAM"}>
      <Link to="/sam-viewer" header="Viewer" />
      <Divider header="Examples" />
      <Link to="/sam-variantcaller" header="Variant caller" />
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
          <SAMLinks />
        </div>
      </nav>
    </div>
  );
}

function Home(props) {
  return <h1>Home will go here.</h1>;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  handleFileChange = e => {
    const files = e.target.files;
    if (files.length == 1) {
      const file = files[0],
        reader = new FileReader();
      reader.onload = e => {
        this.setState({ data: e.target.result });
      };
      reader.readAsText(file);
    }
    document.body.click();
  };

  handleTextUpdate = () => {
    $("#importModal").modal("hide");
    this.setState({
      data: document.getElementById("input_textarea").value
    });
  };

  render() {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <Route exact path="/" component={Home} />
          <FASTARoutes />
          <FNARoutes />
          <SAMRoutes />
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

ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
);
