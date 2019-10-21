import React from 'react';
import io from 'socket.io-client';
import Draw from './Draw';

const ENTER_KEY = 'Enter';
export default class Room extends React.Component {
  inputRef = null;
  socket = null;
  tipRef = null;
  wRef = null;
  rId = null;

  constructor(props) {
    super(props);
    this.state = {
      alreadyNames: [],
      name: '',
      showDlg: true,
      msg: '',
      imageData: '',
      isMaster: false,
      goods: ''
    };
    const { match } = this.props;
    this.rId = match.params.roomId;
    this.socket = io.connect(`http://localhost:3000/${this.rId}`);
    this.socket.on('channel names', (msg) => {
      this.setState({ alreadyNames: [...msg] });
    });
    this.socket.on('tip', tip => {
      tip === 'success' ? this.setState({ showDlg: false }) : this.tipRef.innerText = tip;
    });
    this.socket.on('message', data => {
      if (data.type === 'desc') {
        this.wRef.innerHTML += '<p>' + data.msg + '</p>';
      } else if(data.type === 'result') {
        this.wRef.innerHTML += '<p class="result">' + 'Congratulation ' + data.user +' right, now change the drawer!' +'</p>'
      } else {
        this.wRef.innerHTML += '<span>' + data.user + ':</span>' + data.msg + '<br/>';
      }
    });
    this.socket.on('master', name => {
      name === this.state.name ? this.setState({isMaster: true}) : this.setState({isMaster: false});
    });
    this.socket.on('image', data => {
      this.setState({imageData: data});
    });
    this.socket.on('goods', sth => {
      this.setState({goods: sth});
    });
  }

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleKeyPress = (e) => {
    if (e.key === ENTER_KEY && this.state.name) {
      this.socket.emit('new name', { name: this.state.name });
    }
  }

  handleMsgChange = (e) => {
    this.setState({ msg: e.target.value });
  }

  handleMsgKeyPress = (e) => {
    const { name, msg } = this.state;
    if (e.key === ENTER_KEY && msg) {
      this.socket.emit('new message', { user: name, msg });
      this.setState({ msg: '' });
    }
  }

  componentDidMount() {
    this.inputRef.focus();
    window.addEventListener('beforeunload', e => {
      e.returnValue = 'not null';
    });
    window.addEventListener('unload', e => {
      this.socket.emit('remove user', {name: this.state.name});
    })
  }

  render() {
    const { alreadyNames, name, showDlg, msg, imageData, isMaster, goods } = this.state;
    return (
      <div className="room-wrapper">

        <h3>
          Welcome to room {this.rId}
        </h3>

        <div className="row">
          <div className="draw">
            <Draw 
              socket={this.socket} 
              imageData={imageData} 
              isMaster={isMaster} 
              goods={goods}
            />
          </div>

          <div className="names">
            <p>Total people num: <span>{alreadyNames.length}</span></p>

            <div className="already">
              <span>name: </span>
              {
                alreadyNames.map((v, i) =>
                  <span key={i}>{v}、</span>
                )
              }
            </div>
            <div className="window" ref={el => this.wRef = el} />
            <input
              type="text"
              className="msg-input"
              placeholder="input answer, press enter send"
              value={msg}
              onChange={this.handleMsgChange}
              onKeyPress={this.handleMsgKeyPress}
            />
          </div>
        </div>


        <div className={`dialog ${!showDlg ? 'hidden' : ''}`} >
          <div className="content">
            <h3>Please enter your name</h3>
            <p ref={el => this.tipRef = el} />
            <input
              type="text"
              value={name}
              ref={el => this.inputRef = el}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
          </div>
        </div>

      </div>
    )
  }
}