import React, { Component } from 'react';
import Dygraph from 'dygraphs';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.data = [];
    const t = new Date();
    for (var i = 10; i >= 0; i--) {
      var x = new Date(t.getTime() - i * 1000);
      this.data.push([x, Math.random()]);
    }

    // The following should be moved to Redux
    this.state = {
      wsMessage: '',
    }
  }
  componentDidMount(){
    const g = new Dygraph('graph',
    this.data, {
      fillGraph: true,
    });
    const parent = this;
    // It sucks that these things aren't objects, and we need to store state in window.
    window.intervalId = setInterval(function() {
      var x = new Date();  // current time
      var y = Math.random();
      parent.data.push([x, y]);
      g.updateOptions( { 'file': parent.data } );
    }, 1000);
    
    const host = "ws://localhost:8000/";
    this.socket = new WebSocket(host);

    this.socket.onopen = () => {
      console.log('Socket opened!!');
      this.socket.send(JSON.stringify({ message: 'Hello' }));
    }
    
    this.socket.onmessage = (message) => {
      console.log('Received ', message);
      this.setState({ wsMessage: message });
    }

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
