import React, { Component } from 'react';
import Upload from './components/Upload';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Card">
          <Upload />
        </div>
      </div>
    )
  }
}

export default App;
