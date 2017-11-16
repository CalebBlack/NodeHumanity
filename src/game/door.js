import React from 'react';
import io from 'socket.io-client';
import Background from '../components/background';
import Loading from '../components/loading';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Manager from './manager';
import * as loginStatuses from '../redux/loginstatuses';
import socketioWildcard from 'socketio-wildcard';
import setUser from '../redux/actions/setuser';
const patch = socketioWildcard(io.Manager);

var socket = null;

class Door extends React.Component {
  constructor(props) {
    super(props);
    this.initializeSocket = this.initializeSocket.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onAuth = this.onAuth.bind(this);
    //this.socketConnected = this.socketConnected.bind(this);
  }
  componentWillMount(){
    if (!socket) {
      this.initializeSocket();
    }
    socket.on('connect',this.onConnect);
    socket.on('disconnect',this.onDisconnect);
    socket.on('authorized',this.onAuth);
  }
  onAuth(user){
    this.props.dispatch(setUser(user));
  }
  onConnect(){
    socket.on('*', function(data){
      //console.log('event:','"'+data.data[0]+'"','data:',data.data[1]);
    });
    console.log('connected');
    socket.emit('authenticate', {token: localStorage.sessionID});
    this.setState(Object.assign({},self.state,{connected:true}));
  }
  onDisconnect(){
    console.log('disconnected');
    this.setState(Object.assign({},self.state,{connected:false}));
  }
  render(){
    if (this.props.loginStatus === loginStatuses.loggedOut) socket = null;
    if (this.props.loginStatus === null || [loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    if (this.props.loginStatus !== loginStatuses.loggedIn) return (<Redirect to='/login'/>);

    return (<Manager socket={socket}/>);
  }
  initializeSocket(){
    let self = this;
    socket = io();
    patch(socket);
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Door);
