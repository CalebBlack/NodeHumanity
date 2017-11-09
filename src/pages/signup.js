import React from 'react';
import './signup.less';
import Loading from '../components/loading';
import {signup} from '../redux/actions/login';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginStatuses from '../redux/loginstatuses';
import * as enforceInput from '../functions/enforceinput';

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }
  render(){
    if (this.props && this.props.loginStatus) {
      console.log('ls',this.props.loginStatus);
      if (this.props.loginStatus === loginStatuses.loggedIn) return (<Redirect to='/play'/>);
      if ([loginStatuses.loggingIn,loginStatuses.initializing].includes(this.props.loginStatus)) return (<Loading/>);
    }
    var self = this;
    return (
    <form onSubmit={(e)=>{e.preventDefault();this.submit();}} className='signup'>
      <label htmlFor='username'>Username</label>
      <input ref={ref=>{this.username = ref;enforceInput.username(ref)}} id='username' name='username' className='username'/>
      <label htmlFor='password'>Password</label>
      <input ref={ref=>{this.password = ref;enforceInput.password(ref)}} id='password' type='password' name='password' className='password'/>
      <label htmlFor='email'>Email</label>
      <input ref={ref=>{this.email = ref;enforceInput.email(ref)}} id='email' type='text' name='email' className='email'/>
      <button className='submitsignup'>Signup</button>
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
})(Signup);
