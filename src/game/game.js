import React from 'react';
import setHeaderDisplay from '../redux/actions/setheaderdisplay';
import Card from '../components/card';
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
    this.onDrawHand = this.onDrawHand.bind(this);
    this.onDrawCard = this.onDrawCard.bind(this);
    this.printMessage = this.printMessage.bind(this);
    this.printPlayers = this.printPlayers.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.onStage2 = this.onStage2.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
    this.chooseCard = this.chooseCard.bind(this);
    this.onRound = this.onRound.bind(this);
    //this.onClick = this.onClick.bind(this);
    this.chatSubmit = this.chatSubmit.bind(this);
    this.leave = this.leave.bind(this);
    this.onChatMessage = this.onChatMessage.bind(this);
    this.state = {stage:1,players:[],messages:[],hand:[],started:false};
  }
  componentWillMount(){
    this.props.socket.on('playerlist',this.onPlayerList);
    this.props.socket.on('playerjoin',this.onPlayerJoin);
    this.props.socket.on('playerleft',this.onPlayerLeave);
    this.props.socket.on('chatmessage',this.onChatMessage);
    this.props.socket.on('gamestarting',this.onGameStart);
    this.props.socket.on('drewcard',this.onDrawCard);
    this.props.socket.on('startinghand',this.onDrawHand);
    this.props.socket.on('newround',this.onRound);
    this.props.socket.on('stage2',this.onStage2);
    this.props.socket.emit('getplayers');
    this.props.dispatch(setHeaderDisplay('none'));
  }
  componentWillUnmount(){
    this.props.socket.removeListener('playerlist',this.onPlayerList);
    this.props.socket.removeListener('playerjoin',this.onPlayerJoin);
    this.props.socket.removeListener('playerleft',this.onPlayerLeave);
    this.props.socket.removeListener('chatmessage',this.onChatMessage);
    this.props.socket.removeListener('stage2',this.onStage2);
    this.props.socket.removeListener('gamestarting',this.onGameStart);
    this.props.socket.removeListener('startinghand',this.onDrawHand);
    this.props.socket.removeListener('newround',this.onRound);
    this.props.socket.removeListener('drewcard',this.onDrawCard);
  }
  onStage2(selections){
    this.setState(Object.assign({},this.state,{stage:2,selections}));
  }
  chooseCard(index){
    console.log('Choosing Card',index);
    this.setState(Object.assign({},this.state,{choice:index}));
    this.props.socket.emit('choosecard',index);
  }
  chooseWinner(index){
    this.props.socket.emit('choosewinner',index);
  }
  onRound(data){
    let newState = {blackCard:data.blackCard,stage:1,round:data.round,czar:data.czar,choice:null,selections:null};
    console.log('NS',newState);
    this.setState(Object.assign({},this.state,newState));
  }
  onDrawCard(cardID){
    var hand = this.state.hand.slice(0);
    hand.push(cardID);
    this.setState(Object.assign({},this.state,{hand}));
  }
  onDrawHand(cardArray){
    var hand = this.state.hand.slice(0);
    hand = hand.concat(cardArray);
    this.setState(Object.assign({},this.state,{hand}));
  }
  onGameStart(){
    console.log('game starting');
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
    console.log('Am I the Czar?',this.state.czar === this.props.user.username,this.state.czar,this.props.user.username);
    return(
      <div id='game'>
        <div className='statusbar'>
          <span className='roomnumber'>Room #{this.props.room}</span>
          <span className='players' onClick={this.printPlayers}>Players: {this.state.players.length}</span>
          <button className='leave' onClick={this.leave}>Leave</button>
        </div>
        {this.renderInner()}
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
    let isCzar = this.state.czar === this.props.user.username;
    if (this.state.stage == 2) {
      return (
        <div className='inner'>
          <div className='selections'>{this.state.selections.map((cardID,index)=>{
            return (<Card onClick={()=>{this.chooseWinner(index)}} key={index} text={this.props.whiteCards[cardID]}/>)
          })}</div>
        </div>
      )
    } else if (isCzar) {
      if (this.state.stage == 1) {
        return (
          <div className='inner'>
            <p>Waiting for Players to choose...</p>
          </div>
        )
      }
    } else {
      return (
        <div className='inner'>
          <div className='hand'>{this.state.hand.map((cardID,index)=>{
            return (<Card className={index === this.state.choice ? 'chosen' : null} onClick={()=>{this.chooseCard(index)}} key={index} text={this.props.whiteCards[cardID]}/>)
          })}</div>
          <p>Cards: {this.state.hand.join(',')}</p>
          <p>Czar: {isCzar.toString()}</p>
        </div>
      )
    }

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
export default connect(state=>{return {user:state.user,blackCards:state.blackCards,whiteCards:state.whiteCards}})(Game);
