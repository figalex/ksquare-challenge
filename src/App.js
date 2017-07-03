import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import UsersList from './UsersList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to kSquare React Challenge</h2>
        </div>
        <div className="App-intro">
          <UsersList />
        </div>
      </div>
    );
  }
}

export default App;
