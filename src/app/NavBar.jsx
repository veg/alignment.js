import React, { Component } from "react";

import Import from "./Import.jsx";
import Export from "./Export.jsx";
import DropDownOfAlignmentsToView from "./DropDownOfAlignmentsToView.jsx";

function NavBar(props) {
  const show_import_export = props.viewing == "alignment";
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Javascript Alignment Viewer
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ">
            <DropDownOfAlignmentsToView
              alignmentsToView={props.alignmentsToView}
              loadData={props.loadData}
            />
            <li>
              <a
                className="nav-link"
                onClick={() => props.changeView("scaffold")}
              >
                Scaffold viewer
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                onClick={() => props.changeView("siteBarPlot")}
              >
                Site Bar Plot
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                onClick={() => props.changeView("treeAlignment")}
              >
                Phylogenetic Tree
              </a>
            </li>
          </ul>
          {show_import_export ? (
            <ul className="navbar-nav ml-auto">
              <Import
                handleFileChange={props.handleFileChange}
                handleTextUpdate={props.handleTextUpdate}
              />
              <Export fasta={props.fasta} />
            </ul>
          ) : null}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
