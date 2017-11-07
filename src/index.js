import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from './redux/store';

window.addEventListener('load',()=>{
  ReactDOM.render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>,document.getElementById('root'));
})
