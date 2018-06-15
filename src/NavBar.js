import React, { Component } from "react";
import "bootstrap";

import LoadData from "./LoadData";
import DropDownOfAlignmentsToView from "./DropDownOfAlignmentsToView";

function NavBar(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Javascript Alignment Viewer
        </a>
        <LoadData
          handleTextInput={props.hangleTextInput}
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
      </nav>
    </div>
  );
}

module.exports = NavBar;
