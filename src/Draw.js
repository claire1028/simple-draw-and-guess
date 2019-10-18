import React from 'react';
import { SketchPicker } from 'react-color'

export default class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleLineWidth = this.handleLineWidth.bind(this);
    this.handleColorPick = this.handleColorPick.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.resetCanvas = this.resetCanvas.bind(this);

    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.canvasX = 0;
    this.canvasY = 0;
    this.ctx = null;
    this.canvas = null;

    this.state = {
      lineWidth: 1,
      lineColor: 'black',
      colorPickerShow: false
    };
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.canvasX = this.canvas.getBoundingClientRect().x;
    this.canvasY = this.canvas.getBoundingClientRect().y;
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  handleMouseDown(e) {
    this.startX = e.clientX - this.canvasX;
    this.startY = e.clientY - this.canvasY;
    this.isDrawing = true;
  }

  handleMouseMove(e) {
    const dX = e.clientX - this.canvasX;
    const dY = e.clientY - this.canvasY;
    if (this.isDrawing) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(dX, dY);
      this.ctx.stroke();
      this.ctx.closePath();
      this.startX = dX;
      this.startY = dY;
    }
  }

  handleMouseUp() {
    if (this.isDrawing) {
      this.isDrawing = false;
    }
  }

  handleLineWidth(e) {
    const v = e.target.value;
    this.setState({lineWidth: v});
    this.ctx.lineWidth = v;
  }

  handleColorPick() {
    this.setState({colorPickerShow: !this.state.colorPickerShow});
  }

  handleColorChange(color) {
    this.setState({lineColor: color.hex});
    this.ctx.strokeStyle = color.hex;
  }

  resetCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    const {lineWidth, lineColor, colorPickerShow} = this.state;
    return (
      <div>
        <div className="attr-row">
          <div className="attr">
            Line width:
            <select value={lineWidth} onChange={this.handleLineWidth}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <div className="attr">
            Line color:
            <div className="color-wrapper">
              <div 
                className="color" 
                style={{background: lineColor}} 
                onClick={this.handleColorPick}
              />
            </div>
            {colorPickerShow && 
              <div className="color-picker">
                <div className="overlay" onClick={this.handleColorPick}/>
                <SketchPicker  
                  color={lineColor}  
                  onChange={this.handleColorChange}
                />
              </div>
            }
          </div>
          <div className="attr">
            <button className="reset" onClick={this.resetCanvas}>clear</button>
          </div>
        </div>
        <canvas
          id="canvas"
          width={484}
          height={320}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    )
  }
}