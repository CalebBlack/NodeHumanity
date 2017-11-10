import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Logout from './pages/logout';
import Signup from './pages/signup';
import Door from './game/door';
import './router.css';

class Router extends React.Component {
  render(){
    return (
      <div className='page' id='page'>
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/logout' component={Logout}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path='/play' component={Door}/>
          <Route path='/' component={Home}/>
        </Switch>
      </div>
    );
  }
}
export default Router;
