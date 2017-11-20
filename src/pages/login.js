import React from 'react';
import './login.less';
import Loading from '../components/loading';
import {login} from '../redux/actions/login';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginStatuses from '../redux/loginstatuses';
import * as enforceInput from '../functions/enforceinput';
import HomeLink from '../components/homelink';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {};
  }
  render(){
    if (this.props && this.props.loginStatus) {
      if (this.props.loginStatus === loginStatuses.loggedIn) return (<Redirect to='/play'/>);
      if ([loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    }
    var self = this;
    return (
    <form onSubmit={(e)=>{e.preventDefault();this.submit();}} className='login'>
      <HomeLink/>
      {this.state.error ? (<span className='warning'>{this.state.error}</span>) : null}
      <label htmlFor='username'>Username</label>
      <input ref={ref=>{this.username = ref;enforceInput.username(ref);}} id='username' name='username' className='username'/>
      <label htmlFor='password'>Password</label>
      <input ref={ref=>{this.password = ref;enforceInput.password(ref)}} id='password' type='password' name='password' className='password'/>
      <button className='submitlogin'>Login</button>
      <Link to='/signup' className='signuplink'>New User? Signup</Link>
    </form>
  );
  }
  submit(){
    if (!this.password || !this.username) return;
    let username = this.username.value.toLowerCase();
    let password = this.password.value.toLowerCase();
    if (username.length < 1 || password.length < 1) return;
    this.props.dispatch(login(username,password,err=>{
      if (err) {
        this.setState({error:err.response ? err.response : 'Login Error'});
      }
    }));
  }
  // signup(){
  //   if (!this.password || !this.username) return;
  //   let username = this.username.value;
  //   let password = this.password.value;
  //   if (username.length < 1 || password.length < 1) return;
  //   console.log('signing up');
  // }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Login);
