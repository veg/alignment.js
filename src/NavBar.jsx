import React, { Component } from "react";
import "bootstrap";

import LoadData from "./LoadData.jsx";
import DropDownOfAlignmentsToView from "./DropDownOfAlignmentsToView.jsx";

function NavBar(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Javascript Alignment Viewer
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <LoadData
              handleTextInput={props.handleTextInput}
              handleFileChange={props.handleFileChange}
              handleExport={props.handleExport}
              modal={props.modal}
              fasta={props.fasta}
              handleTextUpdate={props.handleTextUpdate}
            />
            <DropDownOfAlignmentsToView
              alignmentsToView={props.alignmentsToView}
              loadData={props.loadData}
            />
            <li>
              <a className="nav-link" onClick={() => props.loadScaffoldData()}>
                Scaffold viewer
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

module.exports = NavBar;
