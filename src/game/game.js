import React from 'react';
import Lobby from './lobby';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {location:'lobby'};
  }
  render(){
    if (this.state.location === 'lobby') {
      return(<Lobby game={this} socket={this.props.socket}/>);
    }
    console.log('gamesocket',this.props.socket);
    return (<p>game</p>)
  }
}
export default Game;
