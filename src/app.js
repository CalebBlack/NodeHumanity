import React from 'react';
import Router from './router';
import './app.css';

class App extends React.Component {
  render(){
    return (
      <div id='app'>
        <Router/>
      </div>
    );
  }
}
export default App;
