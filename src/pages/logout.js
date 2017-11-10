import React from 'react';
import {connect} from 'react-redux';
import {logout} from '../redux/actions/login';
import {Redirect} from 'react-router-dom';

class Logout extends React.Component {
  render(){
    this.props.dispatch(logout());
    return (<Redirect to='/'/>);
  }
}

export default connect()(Logout);
