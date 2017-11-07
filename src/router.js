import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Game from './game/game';

class Router extends React.Component {
  render(){
    return (
      <Switch>
        <Route exact path='/play' component={Game}/>
        <Route path='/' component={Home}/>
      </Switch>
    );
  }
}
export default Router;