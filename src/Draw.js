import React from 'react';
import { SketchPicker } from 'react-color';

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
    this.broadcast = this.broadcast.bind(this);
    this.getDisplayCanvas = this.getDisplayCanvas.bind(this);

    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.canvasX = 0;
    this.canvasY = 0;
    this.ctx = null;
    this.canvas = null;
    this.display = null;
    this.socket = props.socket;

    this.state = {
      lineWidth: 1,
      lineColor: 'black',
      colorPickerShow: false
    };
  }

  getDisplayCanvas() {
    this.display = document.getElementById('display');
    if (this.display.getContext) {
      this.ctx = this.display.getContext('2d');
    }
  }

  componentDidMount() {
   this.getDisplayCanvas();
  }

  componentDidUpdate(prevProps) {
    if(this.props.isMaster && this.props.isMaster !== prevProps.isMaster) {
      this.canvas = document.getElementById('canvas');
      this.canvasX = this.canvas.getBoundingClientRect().x;
      this.canvasY = this.canvas.getBoundingClientRect().y;
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d');
      }
    }
    if(!this.props.isMaster && this.props.imageData !== prevProps.imageData) {
      this.getDisplayCanvas();
      const {width, height, data} = this.props.imageData;
      const imgdata = this.ctx.createImageData(width, height);
      for(let i = 0; i < imgdata.data.length; i++) {
          imgdata.data[i] = data[i];
      }
      this.ctx.putImageData(imgdata, 0, 0);
    }
  }

  broadcast() {
    const imageData  = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const pic = [];
    for(let i = 0; i < data.length; i++) {
      pic.push(data[i]);
    }
    const sendData = {
      width: this.canvas.width,
      height: this.canvas.height,
      data: pic
    };
    this.socket.emit('image data', sendData);
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
      this.broadcast();
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
    this.broadcast();
  }

  render() {
    const {lineWidth, lineColor, colorPickerShow} = this.state;
    return (
      <div>
        {this.props.isMaster ?
          <>
            <div className="good">
              You are drawer ! This round you should draw : 
              <span> {this.props.goods}</span>
            </div>
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
          </>
          :
          <canvas
            id="display"
            width={484}
            height={350}
          />
        }
      </div>
    )
  }
}