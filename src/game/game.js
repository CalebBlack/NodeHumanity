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
    this.onRoundWon = this.onRoundWon.bind(this);
    this.onDrawCard = this.onDrawCard.bind(this);
    this.printMessage = this.printMessage.bind(this);
    this.printPlayers = this.printPlayers.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.onStage2 = this.onStage2.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
    this.onGameWinner = this.onGameWinner.bind(this);
    this.chooseCard = this.chooseCard.bind(this);
    this.onRound = this.onRound.bind(this);
    //this.onClick = this.onClick.bind(this);
    this.chatSubmit = this.chatSubmit.bind(this);
    this.leave = this.leave.bind(this);
    this.onChatMessage = this.onChatMessage.bind(this);
    this.state = {stage:1,wins:{},players:{},messages:[],hand:[],started:false,gameWinner:null};
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
    this.props.socket.on('roundwinner',this.onRoundWon);
    this.props.socket.on('stage2',this.onStage2);
    this.props.socket.on('gamewon',this.onGameWinner);
    this.props.socket.emit('getplayers');
    this.props.dispatch(setHeaderDisplay('none'));
  }
  componentWillUnmount(){
    this.props.socket.removeListener('playerlist',this.onPlayerList);
    this.props.socket.removeListener('playerjoin',this.onPlayerJoin);
    this.props.socket.removeListener('gamewon',this.onGameWinner);
    this.props.socket.removeListener('roundwinner',this.onRoundWon);
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
  onGameWinner(data){
    this.setState(Object.assign({},this.state,{gameWinner:data}));
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
    let newState = {blackCard:data.blackCard,stage:1,round:data.round,czar:data.czar,choice:null,selections:null,roundWinner:null};
    console.log('NS',newState);
    this.setState(Object.assign({},this.state,newState));
  }
  onRoundWon(data){
    var wins = Object.assign({},this.state.wins);
    wins[data.user.username] = (wins[data.user.username] || 0) +1;
    this.setState(Object.assign({},this.state,{wins,roundWinner:{displayname:data.user.displayname,username:data.user.username,cardNumber:data.cardNumber}}));
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
    if (!this.state.players[player.username]) {
      let newPlayers = Object.assign({},this.state.players);
      newPlayers[player.username] = player.displayname;
      console.log('pjnp',newPlayers,this.state.players);
      this.setState(Object.assign({},this.state,{players:newPlayers}));
    }
  }
  onPlayerList(playerList){
    var playerObject = {};
    playerList.forEach(playerData=>{
      playerObject[playerData.username] = playerData.displayname;
    });
    console.log('po',playerObject);
    this.setState(Object.assign({},this.state,{players:playerObject}));
  }
  onPlayerLeave(player){
    if (this.state.players[player.username]) {
      var newPlayers = Object.assign({},this.state.players);
      delete newPlayers[player.username];
      this.setState(Object.assign({},this.state,{players:newPlayers}));
    }
  }
  printPlayers(){
    this.printMessage('','Players: '+Object.values(this.state.players).map(player=>{return player.displayname}).join(', '));
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
    let displayname = this.state.players[message.sender];
    if (displayname !== null) {
      this.printMessage(displayname,message.message);
    }
  }
  render(){
    console.log('Am I the Czar?',this.state.czar === this.props.user.username,this.state.czar,this.props.user.username);
    return(
      <div id='game'>
        <div className='sidebar'>
          <div className='statusbar'>
            <span className='roomnumber'>Room #{this.props.room}</span>
            {this.state.round ? <span className='roundnumber'>Round {this.state.round}</span> : null}
            <span className='players' onClick={this.printPlayers}>Players: {Object.keys(this.state.players).length}</span>
            <button className='leave' onClick={this.leave}>Leave</button>
          </div>
          <div className='playerwins'>
            <h4>Points:</h4>
            {Object.entries(this.state.players).map((playerPair,index)=>{return (
              <span key={index} className='player'>{playerPair[1]+': '+(this.state.wins[playerPair[0]] || 0)}</span>
            )})}
          </div>
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
    if (this.state.started !== true){
      return (
        <div className='inner'>
          <p className='alert waiting'>Waiting for more players...</p>
        </div>
      );
    } else if (this.state.gameWinner) {
      return (
        <div className='inner'>
          <span className='alert gamewinner'>{this.state.gameWinner.displayname} won!</span>
        </div>
      )
    } else if (this.state.stage == 2) {
      return (
        <div className='inner'>
          <Card className='prompt' color='black' text={this.state.blackCard ? this.props.blackCards[this.state.blackCard].text : null}/>
          <div className='selections'>{this.state.selections.map((cardID,index)=>{
            return (<Card className={this.state.roundWinner ? (this.state.roundWinner.cardNumber === index ? 'winner': null) : null} onClick={()=>{isCzar ? this.chooseWinner(index) : null}} key={index} text={this.props.whiteCards[cardID]}/>)
          })}</div>
          {this.state.roundWinner ? <span className='alert roundwinner'>{this.state.roundWinner.displayname} won the round!</span> : null}
        </div>
      )
    } else if (isCzar) {
      if (this.state.stage == 1) {
        return (
          <div className='inner'>
            <Card className='prompt' color='black' text={this.state.blackCard ? this.props.blackCards[this.state.blackCard].text : null}/>
            <p className='alert waiting'>Waiting for other players to choose...</p>
          </div>
        )
      }
    } else {
      return (
        <div className='inner'>
          <Card className='prompt' color='black' text={this.state.blackCard ? this.props.blackCards[this.state.blackCard].text : null}/>
          <div className='hand'>{this.state.hand.map((cardID,index)=>{
            return (<Card className={index === this.state.choice ? 'chosen' : null} onClick={()=>{this.chooseCard(index)}} key={index} text={this.props.whiteCards[cardID]}/>)
          })}</div>
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
