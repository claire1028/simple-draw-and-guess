import React from 'react';
import io from 'socket.io-client';

export default class Create extends React.Component {
  socket = null;
  state = {
    rooms: []
  };

  constructor(props){
    super(props);
    this.socket = io(`http://localhost:3000`);
  }

  create = () => {
    fetch('/roomId', {method: 'put'})
    .then(res => res.json())
    .then(res => {
      const tr = res.totalRooms;
      this.setState({rooms: new Array(tr).fill(0)});
      this.socket.emit('join room', {id: tr});
      window.open(`http://localhost:3000/#${tr}`, '_blank');
    });
  }

  componentDidMount() {
    fetch('/roomId')
    .then(res => res.json())
    .then(res => this.setState({rooms: new Array(res.totalRooms).fill(0)}));
  }

  render() {
    const {rooms} = this.state;
    return (
      <div className="desc-wrapper">
        <p>
          {rooms.length > 0 ? '已有房间': '还没有新房间，赶紧创建一个吧~'}
          <a onClick={this.create}>创建新房间</a>
        </p>
        <ul>
          {
            rooms.map((v, i) => 
              <li key={i}>
                <p>房间{i+1}</p>
                <a target="_blank" href={`http://localhost:3000/#${i+1}`}>申请加入</a>
              </li>
          )}
        </ul>
      </div>
    )
  }
}