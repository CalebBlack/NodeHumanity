import React from 'react';
import Background from '../components/background';
import Loading from '../components/loading';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginStatuses from '../redux/loginstatuses';

class Game extends React.Component {
  render(){
    if (this.props.loginStatus === null || [loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    if (this.props.loginStatus !== loginStatuses.loggedIn) return (<Redirect to='/login'/>);
    return (
    <div id='game'>
    </div>
  );
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Game);
