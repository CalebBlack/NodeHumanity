import React from 'react';
import Loading from '../components/loading';
import {connect} from 'react-redux';
import * as loginStatuses from '../redux/loginstatuses';

class Authenticated extends React.Component {
  render(){
    if (this.props.loginStatus === null || [loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    if (this.props.loginStatus !== loginStatuses.loggedIn) return (<Redirect to='/login'/>);
    if (!socket) {
      this.initializeSocket();
    }
    if (!this.props.children) return null;
    return this.props.children;
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Authenticated);
