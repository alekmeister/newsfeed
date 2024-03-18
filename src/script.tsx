import React from 'react';
import ReactDOM from 'react-dom';
import './common.css';
import { App } from './Components/App/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { initializeAPI } from './api';

initializeAPI();

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
