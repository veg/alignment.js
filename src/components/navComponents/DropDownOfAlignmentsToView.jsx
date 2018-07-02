import React, { Component } from "react";
const _ = require("underscore");
import "bootstrap";

function DropDownOfAlignmentsToView(props) {
  return (
    <div>
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
          Examples
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {_.keys(props.alignmentsToView)
            .slice(1)
            .map(name => {
              return (
                <a
                  className="dropdown-item"
                  key={name}
                  onClick={() => props.loadData(name)}
                >
                  {name}
                </a>
              );
            })}
        </div>
      </li>
    </div>
  );
}

module.exports = DropDownOfAlignmentsToView;
