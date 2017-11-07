import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';
import {BrowserRouter} from 'react-router-dom';
import './index.css';

window.addEventListener('load',()=>{
  ReactDOM.render(<BrowserRouter><App/></BrowserRouter>,document.getElementById('root'));
})
