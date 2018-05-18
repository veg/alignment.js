import React, { Component } from 'react';

class Labels extends Component {
  render() {
    return (<div id="alignmentjs-labels-div" className="jav-container" style={{overflowX: "scroll", overflowY: "hidden"}}>
      <svg id="alignmentjs-labels"></svg>
    </div>);
  }
}

module.exports = Labels;
