import React from 'react';

class Lobby extends React.Component {
  render(){
    this.props.socket.emit('createroom');
    return (<p>Lobby</p>);
  }
}

export default Lobby;
