import React, { Component } from 'react';

import Trader from './components/Trader';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intro: true
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">cryptolinregression-v2</h1>
        </header>
        { this.state.intro ? 
          <div>
            <div className="page-header"><h1>Welcome!</h1></div>
            <div>You have one year to out profit the AI (who is using linear regression to make decisions)</div>
            <button className="btn" onClick={() => this.setState({ intro: false })}>Let's Go!</button>
          </div>
          :
          <Trader />
        }
      </div>
    );
  }
}

export default App;
