import React, { Component } from 'react';
import Dygraph from 'dygraphs';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.data = [];
    for (let i = 0; i < 120; i++) {
      this.data.push([i, i / 5.0 + 10.0 * Math.sin(i / 3.0),
        30.0 - i / 5.0 - 10.0 * Math.sin(i / 3.0 + 1.0)]);
    }
  }
  componentDidMount(){
    const g = new Dygraph('graph',
    this.data, {
      fillGraph: true,
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
        <div style={{ position: 'relative', width: 'inherit', height: '500px' }}>
          <div id="graph" style={{ position: 'absolute', bottom: '10px', right: '10px', left: '10px', top: '10px'}}></div>
        </div>
      </div>
    );
  }
}

export default App;
