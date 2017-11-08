import React from 'react';
import './login.less';
import Loading from '../components/loading';
import {login} from '../redux/actions/login';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginStatuses from '../redux/loginstatuses';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }
  render(){
    if (this.props && this.props.loginStatus) {
      if (this.props.loginStatus === loginStatuses.loggedIn) return (<Redirect to='/play'/>);
      if ([loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    }

    return (
    <form onSubmit={(e)=>{e.preventDefault();this.submit();}} className='login'>
      <label htmlFor='username'>Username</label>
      <input ref={ref=>{this.username = ref}} id='username' name='username' className='username'/>
      <label htmlFor='password'>Password</label>
      <input ref={ref=>{this.password = ref}} id='password' type='password' name='password' className='password'/>
      <button>Login</button>
    </form>
  );
  }
  submit(){
    if (!this.password || !this.username) return;
    let username = this.username.value.replace(' ','');
    let password = this.password.value.replace(' ','');
    if (username.length < 1 || password.length < 1) return;
    this.props.dispatch(login(username,password));
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Login);
