import React from "react";

import Import from "./Import.jsx";
import Export from "./Export.jsx";
import DropDownOfAlignmentsToView from "./DropDownOfAlignmentsToView.jsx";

function NavBar(props) {
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
          </ul>
          <ul className="navbar-nav ml-auto">
            <Import
              handleFileChange={props.handleFileChange}
              handleTextUpdate={props.handleTextUpdate}
            />
            <Export fasta={props.fasta} />
          </ul>
        </div>
      </nav>
    </div>
  );
}

module.exports = NavBar;
