import React from 'react';
import Exit from '../icons/exit';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './logoutbutton.css';

class LogoutButton extends React.Component {
  render(){
    if (this.props && this.props.loggedIn !== true) return null;
    return (<Link className='logoutbutton' to='/logout'><Exit/></Link>);
  }
}

export default connect(state=>{return {loggedIn:state.loggedIn}})(LogoutButton);
