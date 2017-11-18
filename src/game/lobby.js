import React from 'react';
import Card from '../components/card';
import setHeaderDisplay from '../redux/actions/setheaderdisplay';
import {connect} from 'react-redux';
import './lobby.less';

class Lobby extends React.Component {
  constructor(props){
    super(props);
    this.onRoomList = this.onRoomList.bind(this);
    this.state = {roomList:[]};
  }
  componentDidMount(){
    this.props.dispatch(setHeaderDisplay('small'));
    if (!this.props || !this.props.socket) return null;
    this.props.socket.emit('listrooms');
    this.props.socket.on('roomlist',this.onRoomList);
  }
  componentWillUnmount(){
    this.props.socket.removeListener('roomlist',this.onRoomList);
  }
  onRoomList(roomList){
      this.setState(Object.assign({},this.state,{roomList}));
  }
  render(){
    if (!this.props || !this.props.socket) return null;

    return (
      <div id='lobby' className='lobby'>
        <div className='roomlist'>
          {this.state.roomList.length > 0 ? this.state.roomList.map((room,index)=>{return (<Room socket={this.props.socket} key={index} data={room}/>)}): <span className='empty'>No Open Rooms</span>}
        </div>
        <div className='controlbar'>
        <button className='refresh' onClick={()=>{this.props.socket.emit('listrooms')}}>Refresh</button>
        <button className='createroom' onClick={()=>{this.props.socket.emit('createroom')}}>Create Room</button>
        </div>
      </div>
    );
  }
}
class Room extends React.Component {
  render(){
    return (
      /*text={
        '<h3>#'+this.props.data.id+'</h3><br/>'+
        'Players: '+this.props.data.players
      }*/
      <Card>
        <h3>#{this.props.data.id}</h3>
        <span>Players: {this.props.data.players}</span>
        <button onClick={()=>{this.props.socket.emit('joinroom',this.props.data.id)}}>Join</button>
      </Card>
    )
  }
}
export default connect()(Lobby);
