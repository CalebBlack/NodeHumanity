import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './home/app';


let paths = [[Home,'/']].map(route=>{
  return (<Route exact path={route[1]} component={route[0]}/>);
});
export default (<Switch>{paths}</Switch>);
