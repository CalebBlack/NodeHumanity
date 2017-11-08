import React from 'react';
import Router from './router';
import Background from './components/background';
import getCardDatabase from './redux/actions/getCardDatabase';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './app.css';

class App extends React.Component {
  componentDidMount(){
    this.props.dispatch(getCardDatabase());
  }
  render(){
    return (
      <div id='app'>
        <Background/>
        <Router/>
      </div>
    );
  }
}
export default withRouter(connect()(App));
