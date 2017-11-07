const ReactDOM = require('react-dom');
const React = require('react');
const App = require('./app');

window.addEventListener('load',()=>{
  ReactDOM.render(<App/>,document.body);
})
