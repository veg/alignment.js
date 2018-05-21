import React, { Component } from 'react';

const $ = require('jquery');


class Labels extends Component {
  componentDidMount() {
    document.getElementById('alignmentjs-axis-div')
      .addEventListener('alignmentjs_wheel_event', function(e) {
        $('#alignmentjs-labels-div').scrollTop(e.detail.y_pixel);
      });
  }
  componentDidUpdate(nextProps) {
    $('#alignmentjs-labels-div').scrollTop(this.props.y_pixel);
    
  }
  render(){
    if(!this.props.sequence_data) {
      return (<div
        id="alignmentjs-labels-div"
        className="alignmentjs-container"
      />);
    }
    const { width, height, site_size } = this.props,
      { number_of_sequences } = this.props.sequence_data,
      styles = {
        overflowX: "scroll",
        overflowY: "hidden",
        width: width,
        height: height
      },
      alignment_height = site_size*number_of_sequences,
      labels = this.props.sequence_data.map(record=>record.header);
    return(<div
      id="alignmentjs-labels-div"
      className="alignmentjs-container"
      style={styles}
    >
      <svg
        id="alignmentjs-labels"
        width={width}
        height={alignment_height}
      >
        {labels.map((label, i) => {
          return (<text
            x={width-this.props.label_padding}
            y={(i+1)*site_size}
            textAnchor='end'
            dy={-site_size/3}
            key={i}
          >
            {label}
          </text>);
        })}
      </svg>
    </div>);
  }
}

Labels.defaultProps = {
  label_padding: 10
}

module.exports = Labels;
