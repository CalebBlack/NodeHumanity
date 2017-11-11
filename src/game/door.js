import React from 'react';
import io from 'socket.io-client';
import Background from '../components/background';
import Loading from '../components/loading';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Game from './game';
import * as loginStatuses from '../redux/loginstatuses';
import socketioWildcard from 'socketio-wildcard';
const patch = socketioWildcard(io.Manager);

var socket = null;

class Door extends React.Component {
  constructor(props) {
    super(props);
    this.initializeSocket = this.initializeSocket.bind(this);
    //this.socketConnected = this.socketConnected.bind(this);
  }
  render(){
    if (this.props.loginStatus === null || [loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    if (this.props.loginStatus !== loginStatuses.loggedIn) return (<Redirect to='/login'/>);
    if (!socket) {
      this.initializeSocket();
    }
    return (<Game socket={socket}/>);
  }
  initializeSocket(){
    let self = this;
    socket = io();
    patch(socket);
    socket.on('connect', function () {
      socket.on('*', function(data){
        console.log('event:','"'+data.data[0]+'"','data:',data.data[1]);
      });
      console.log('connected');
      socket.emit('authenticate', {token: localStorage.sessionID});
        self.setState(Object.assign({},self.state,{connected:true}));
    }).on('disconnect', function () {
      self.setState(Object.assign({},self.state,{connected:false}));
    });
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Door);
