import React, { Component } from 'react';
import Dygraph from 'dygraphs';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // So how to populate this to begin with???
    this.data = [[new Date("2017-01-03"), 10, 10]];

    // The following should be moved to Redux
    this.state = {
      wsMessage: '',
      bought: [],
      sold: [],
      profit: 0,
    }
  }
  componentDidMount(){
    this.drawInitialGraph();
    this.handleWebsocket();
  }

  drawInitialGraph() {
    this.g = new Dygraph('graph',
    this.data, {
      fillGraph: false,
      labels: ["Time", "Price", "Prediction"],
      underlayCallback: function(canvas, area, g) {
        console.log('Called me');
        var bottom_left = g.toDomCoords(new Date("2017-01-04"), -20);
        var top_right = g.toDomCoords(new Date("2017-01-05"), +20);
        console.log(bottom_left, area);

        var left = bottom_left[0];
        var right = top_right[0];

        canvas.fillStyle = "rgba(255, 255, 102, 1.0)";
        canvas.fillRect(left, area.y, right - left, area.h);
      }
    });
  }

  handleWebsocket() {
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

      const { x, y, prediction, error } = message; 
      if (y - prediction > Math.abs(error)) {
        const sold = this.state.sold;
        const profit = this.state.profit + y;
        sold.push(y);
        this.setState({
          sold,
          profit,
        });
      }
      else if (prediction - y > Math.abs(error)) {
        const bought = this.state.bought;
        const profit = this.state.profit - y;
        bought.push(y);
        this.setState({
          bought,
          profit,
        });
      }
      this.data.push([new Date(x), y, prediction]);
      this.g.updateOptions({ 'file': this.data });
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
          Last price: {this.state.wsMessage.y}
        </p>
        <div style={{ position: 'relative', width: 'inherit', height: '500px' }}>
          <div id="graph" style={{ position: 'absolute', bottom: '10px', right: '10px', left: '10px', top: '10px'}}></div>
        </div>
        <button onClick={this.buy}>Buy</button>
        <button onClick={this.sell}>Sell</button>
        <div>
          Profit: {this.state.profit}
        </div>
        <div>
          { this.state.bought.map(value => {
            return <div>Bought: {value}</div>
          })}
        </div>
        <div>
          { this.state.sold.map(value => {
            return <div>Sold: {value}</div>
          })}
        </div>
      </div>
    );
  }
}

export default App;
