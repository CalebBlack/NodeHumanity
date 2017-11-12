import React from 'react';
import './game.less';

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
  onPlayerJoin(playerID){
    if (!this.state.players.includes(playerID)) {
      let newPlayers = this.state.players.slice(0);
      newPlayers.push(playerID);
      this.setState(Object.assign({},this.state,{players:newPlayers}));
    }
  }
  onPlayerList(playerList){
    this.setState(Object.assign({},this.state,{players:playerList}));
  }
  onPlayerLeave(playerID){
    if (this.state.players.includes(playerID)) {
      let newPlayers = this.state.players.slice(0);
      let index = this.state.players.indexOf(playerID);
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
      </div>
    );
  }
  leave(){
    this.props.socket.emit('leaveroom');
  }
}
export default Game;
