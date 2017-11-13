import React from 'react';
import setHeaderDisplay from '../redux/actions/setheaderdisplay';
import {connect} from 'react-redux';

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
    this.printMessage = this.printMessage.bind(this);
    this.printPlayers = this.printPlayers.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.chatSubmit = this.chatSubmit.bind(this);
    this.leave = this.leave.bind(this);
    this.onChatMessage = this.onChatMessage.bind(this);
    this.state = {players:[],messages:[],started:false};
  }
  componentWillMount(){
    this.props.socket.on('playerlist',this.onPlayerList);
    this.props.socket.on('playerjoin',this.onPlayerJoin);
    this.props.socket.on('playerleft',this.onPlayerLeave);
    this.props.socket.on('chatmessage',this.onChatMessage);
    this.props.socket.on('gamestarting',this.onGameStart);
    this.props.socket.emit('getplayers');
    this.props.dispatch(setHeaderDisplay('none'));
  }
  componentWillUnmount(){
    this.props.socket.removeListener('playerlist',this.onPlayerList);
    this.props.socket.removeListener('playerjoin',this.onPlayerJoin);
    this.props.socket.removeListener('playerleft',this.onPlayerLeave);
    this.props.socket.removeListener('chatmessage',this.onChatMessage);
    this.props.socket.removeListener('gamestarting',this.onGameStart);
  }
  onGameStart(){
    this.setState(Object.assign({},this.state,{started:true}));
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
  printPlayers(){
    this.printMessage('','Players: '+this.state.players.map(player=>{return player.displayname}).join(', '));
  }
  printMessage(displayname='',message='') {
    if (message.length > 0) {
      if (displayname.length < 1) {
        displayname = 'System'
      }
      var newMessages = this.state.messages.slice(0);
      newMessages.push({displayname,message});
      this.setState(Object.assign({},this.state,{messages:newMessages}));
      this.messageBox.scrollTop = this.messageBox.scrollHeight;
    }
  }
  onChatMessage(message){
    var newMessages = this.state.messages.slice(0);
    let userIndex = playerIndex(this.state.players,message.sender);
    if (userIndex !== null) {
      let displayname = this.state.players[userIndex].displayname;
      this.printMessage(displayname,message.message);
    }
  }
  render(){
    return(
      <div id='game'>
        <div className='statusbar'>
          <span className='roomnumber'>Room #{this.props.room}</span>
          <span className='players' onClick={this.printPlayers}>Players: {this.state.players.length}</span>
          <button className='leave' onClick={this.leave}>Leave</button>
        </div>
        <div className='inner'>
          {this.renderInner()}
        </div>
        <div className='chatbox'>
          <div ref={ref=>{this.messageBox = ref;}} className='messages'>
            <div className='senders'>
            {this.state.messages.map((message,index)=>{
              return (
                <span key={index} className='sender'>{message.displayname}</span>
              )
            })}
            </div>
            <div className='messages'>
              {this.state.messages.map((message,index)=>{
                return (
                  <span key={index} className='text'>{message.message}</span>
                )
              })}
              <div className='spacer'/>
            </div>
          </div>
          <input ref={ref=>{this.input = ref;}} onKeyDown={e=>{if (e.keyCode == 13) this.chatSubmit()}} className='sendmessage'/><button onClick={this.chatSubmit} className='send'>Send</button>
        </div>
      </div>
    );
  }
  renderInner(){
    return (
      <p>hi</p>
    )
  }
  chatSubmit(){
    if (this.input) {
      let message = this.input.value.trim();
      this.input.value = null;
      if (message.length > 0) {
        this.props.socket.emit('sendchat',message);
      }
    }
  }
  leave(){
    this.props.socket.emit('leaveroom');
  }
}
export default connect()(Game);
