import React, { Component } from 'react';
import Dygraph from 'dygraphs';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount(){
    const g = new Dygraph('graph',
    `Date,A,B
    2016/01/01,10,20
    2016/07/01,20,10
    2016/12/31,40,30
    `, {
      fillGraph: true
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div id="graph"></div>
      </div>
    );
  }
}

export default App;
