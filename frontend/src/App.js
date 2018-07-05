import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import { Button } from 'react-bootstrap';

import './App.css';
import PurchaseHistory from './components/PurchaseHistory'; 

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
      user: {
        bought: [],
        sold: [],
        profit: 0
      }
    };
    this.buy = this.buy.bind(this);
    this.sell = this.sell.bind(this);
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
        var bottom_left = g.toDomCoords(new Date("2017-01-04"), -20);
        var top_right = g.toDomCoords(new Date("2017-01-05"), +20);

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
      this.socket.send(JSON.stringify({ message: 'Ready for data' }));
    }
    
    this.socket.onmessage = (message) => {
      message = JSON.parse(message.data);
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

  buy() {
    const currentPrice = this.state.wsMessage.y;
    const profit =  this.state.user.profit - currentPrice;
    const bought = this.state.user.bought;
    bought.push(currentPrice);
    const newUserObj = Object.assign(this.state.user, { profit, bought });
    this.setState ({
      user: newUserObj,
    });
  }

  sell() {
    const currentPrice = this.state.wsMessage.y;
    const profit =  this.state.user.profit + currentPrice;
    const sold = this.state.user.sold;
    sold.push(currentPrice);
    const newUserObj = Object.assign(this.state.user, { profit, sold });
    this.setState ({
      user: newUserObj,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">cryptolinregression-v2</h1>
        </header>
        <p className="App-intro">
          Last price: {this.state.wsMessage.y}
        </p>
        <div style={{ position: 'relative', width: 'inherit', height: '500px' }}>
          <div id="graph" style={{ position: 'absolute', bottom: '10px', right: '10px', left: '10px', top: '10px'}}></div>
        </div>
        <button className="btn btn-success" onClick={this.buy}>Buy</button>
        <button className="btn btn-danger" onClick={this.sell}>Sell</button>        
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <PurchaseHistory 
            profit={this.state.profit}
            bought={this.state.bought}
            sold={this.state.sold}
          />
          <PurchaseHistory 
            profit={this.state.user.profit}
            bought={this.state.user.bought}
            sold={this.state.user.sold}
          />
        </div>
      </div>
    );
  }
}

export default App;
