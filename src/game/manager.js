import React from 'react';
import Lobby from './lobby';
import Game from './game';

class Manager extends React.Component {
  constructor(props){
    super(props);
    this.state = {location:'lobby'};
  }
  render(){
    if (this.state.location === 'lobby') {
      return(<Lobby manager={this} socket={this.props.socket}/>);
    } else if (this.state.location === 'inGame') {
      return(<Game manager={this}/>);
    } else {
      return null;
    }
    console.log('gamesocket',this.props.socket);
    return (<p>game</p>)
  }
}
export default Manager;
