import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

// const socket = io('http://localhost:3000');

class App extends React.Component {
  render() {
    return (
      <div className="desc-wrapper">
        <p>
          已有房间
          <button>创建新房间</button>
        </p>
        <ul>
          <li>
            <p>房间1</p>
            <button>申请加入</button>
          </li>
          <li>
            <p>房间2</p>
            <button>申请加入</button>
          </li>
          <li>
            <p>房间3</p>
            <button>申请加入</button>
          </li>
        </ul>
        
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));