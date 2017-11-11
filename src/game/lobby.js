import React from 'react';
import Card from '../components/card';
import './lobby.less';

class Lobby extends React.Component {
  constructor(props){
    super(props);
    this.state = {roomList:[]};
  }
  componentDidMount(){
    if (!this.props || !this.props.socket) return null;
    this.props.socket.emit('listrooms');
    this.props.socket.on('roomlist',roomList=>{
      this.setState(Object.assign({},this.state,{roomList}));
    });
  }
  render(){
    if (!this.props || !this.props.socket) return null;

    return (
      <div id='lobby' className='lobby'>
        <div className='roomlist'>
          {this.state.roomList.length > 0 ? this.state.roomList.map((room,index)=>{return (<Room key={index} data={room}/>)}): <span className='empty'>No Open Rooms</span>}
        </div>
        <div className='controlbar'>
        <button className='refresh' onClick={()=>{this.props.socket.emit('listrooms')}}>Refresh</button>
        <button className='createroom' onClick={()=>{this.props.socket.emit('createroom')}}>Create</button>
        </div>
      </div>
    );
  }
}
class Room extends React.Component {
  render(){
    return (
      <Card text={
        '<h3>#'+this.props.data.id+'</h3><br/>'+
        'Players: '+this.props.data.players
      }/>
    )
  }
}
export default Lobby;
