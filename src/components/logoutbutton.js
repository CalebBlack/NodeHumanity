import React from 'react';
import Exit from '../icons/exit';
import {Link} from 'react-router-dom';
import './logoutbutton.css';

class LogoutButton extends React.Component {
  render(){
    return (<Link to='/logout'><div className='logoutbutton'><Exit/></div></Link>);
  }
}

export default LogoutButton;
