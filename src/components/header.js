import React from 'react';
import LogoutButton from './logoutbutton';
import {connect} from 'react-redux';
import './header.less';

class Header extends React.Component {
  render(){
    let display = this.props && this.props.display ? this.props.display : 'normal';
    return (
      <header className={display} id='header'>
        <h1 className='title'>Sxuanch</h1>
        <LogoutButton/>
      </header>
    );
  }
}

export default connect(state=>{
  return {display:state.headerDisplay}
})(Header);
