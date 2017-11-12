import React from 'react';
import './game.less';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.leave = this.leave.bind(this);
    this.state = {players:[]};
  }
  componentDidMount(){
    this.props.socket.on('playerlist',playerList=>{
      console.log('pl',playerList);
      this.setState(Object.assign({},this.state,{players:playerList}));
    });
    this.props.socket.emit('getplayers');
  }
  render(){
    return(
      <div id='game'>
        <p>#{this.props.room}</p>
        <div className='statusbar'>
          <span className='roomnumber'>Room #{this.props.room}</span>
          <span className='players'>Players: {this.state.players.length}</span>
          <button className='leave' onClick={this.leave}>Leave</button>
        </div>
      </div>
    );
  }
  leave(){
    this.props.socket.emit('leaveroom');
  }
}
export default Game;
