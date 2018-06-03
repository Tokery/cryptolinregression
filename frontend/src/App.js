import React, { Component } from 'react';
import Dygraph from 'dygraphs';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // So how to populate this to begin with???
    this.data = [[new Date("2017-01-03"), 116.860001]];

    // The following should be moved to Redux
    this.state = {
      wsMessage: '',
    }
  }
  componentDidMount(){
    const g = new Dygraph('graph',
    this.data, {
      fillGraph: false,
      labels: ["Time", "Price"]
    });
    console.log('Mounted');
    
    const host = "ws://localhost:8000/";
    this.socket = new WebSocket(host);

    this.socket.onopen = () => {
      console.log('Socket opened!!');
      this.socket.send(JSON.stringify({ message: 'Ready for data' }));
    }
    
    this.socket.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log('Received ', message);
      this.setState({ wsMessage: message });

      const { x, y } = message; 
      this.data.push([new Date(x), y]);
      g.updateOptions({ 'file': this.data });
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
