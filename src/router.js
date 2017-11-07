import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home';

class Router extends React.Component {
  render(){
    return (
      <Switch>
        <Route path='/' component={Home}/>
      </Switch>
    );
  }
}
export default Router;
