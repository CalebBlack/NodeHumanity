import React from 'react';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    this.props.socket.on('playerlist',playerList=>{
      this.setState(Object.assign({},this.state,{players:playerList}));
    });
    this.props.socket.emit('getplayers');
  }
  render(){
    return(
      <p>#{this.props.room}</p>
    );
  }
}
export default Game;
