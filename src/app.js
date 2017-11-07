import React from 'react';
import Router from './router';
import getCardDatabase from './redux/actions/getCardDatabase';
import {connect} from 'react-redux';
import './app.css';

class App extends React.Component {
  componentDidMount(){
    this.props.dispatch(getCardDatabase());
  }
  render(){
    return (
      <div id='app'>
        <Router/>
      </div>
    );
  }
}
export default connect()(App);
