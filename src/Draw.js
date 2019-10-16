import React from 'react';

export default class Draw extends React.Component {
  componentDidMount() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
    }
  }
  render() {
    return(
      <div>
        <canvas id="canvas" />
      </div>
    )
  }
}