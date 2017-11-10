import React from 'react';
import Back from '../icons/back';
import {Link} from 'react-router-dom';
import './homelink.css';

class HomeLink extends React.Component {
  render(){
    return (<Link to='/' className='homelink'><Back/></Link>)
  }
}
export default HomeLink;
