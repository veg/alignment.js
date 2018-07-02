import React, { Component } from "react";
import "bootstrap";

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

module.exports = Modal;
