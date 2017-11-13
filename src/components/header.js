import React from 'react';
import LogoutButton from './logoutbutton';
import './header.less';

class Header extends React.Component {
  render(){
    return (
      <header id='header'>
        <LogoutButton/>
        <h1 className='title'>Sxuanch</h1>
      </header>
    );
  }
}

export default Header;
