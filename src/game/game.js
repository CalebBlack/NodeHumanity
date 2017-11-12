import React from 'react';
import './game.less';

function playerIndex(players,username){
  var index = null;
  for (var i = 0; i < players.length && index === null; i++) {
    if (players[i].username === username) {
      index = i;
    }
  }
  return index;
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.onPlayerLeave = this.onPlayerLeave.bind(this);
    this.onPlayerList = this.onPlayerList.bind(this);
    this.onPlayerJoin = this.onPlayerJoin.bind(this);
    this.leave = this.leave.bind(this);
    this.state = {players:[]};
  }
  componentDidMount(){
    this.props.socket.on('playerlist',this.onPlayerList);
    this.props.socket.on('playerjoin',this.onPlayerJoin);
    this.props.socket.on('playerleft',this.onPlayerLeave);
    this.props.socket.emit('getplayers');
  }
  componentWillUnmount(){
    this.props.socket.removeListener('playerlist',this.onPlayerList);
    this.props.socket.removeListener('playerjoin',this.onPlayerJoin);
    this.props.socket.removeListener('playerleft',this.onPlayerLeave);
  }
  onPlayerJoin(player){
    let index = playerIndex(this.state.players,player.username);
    if (!index) {
      let newPlayers = this.state.players.slice(0);
      newPlayers.push(player);
      this.setState(Object.assign({},this.state,{players:newPlayers}));
    }
  }
  onPlayerList(playerList){
    this.setState(Object.assign({},this.state,{players:playerList}));
  }
  onPlayerLeave(player){
    let index = playerIndex(this.state.players,player.username);
    if (index) {
      let newPlayers = this.state.players.slice(0);
      newPlayers.splice(index,1);
      this.setState(Object.assign({},this.state,{players:newPlayers}));
    }
  }
  render(){
    return(
      <div id='game'>
        <div className='statusbar'>
          <span className='roomnumber'>Room #{this.props.room}</span>
          <span className='players'>Players: {this.state.players.length}</span>
          <button className='leave' onClick={this.leave}>Leave</button>
        </div>
        <div className='inner'>

        </div>
        <div className='chatbox'>
          <ul className='messages'>
          </ul>
          <input className='sendmessage'/><button className='send'>Send</button>
        </div>
      </div>
    );
  }
  leave(){
    this.props.socket.emit('leaveroom');
  }
}
export default Game;
