import React from 'react';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <div className='App'>
      <div style={centerStyle}>
        <h1 className='title'>
          Sample Login with Multi-Factor Authentification
        </h1>
      </div>
      <Login />
    </div>
  );
}

const centerStyle = {
  textAlign: 'center',
};

export default App;