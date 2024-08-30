import React from 'react';
import Login from './components/Login';

function App() {
  return (
    <div className='App'>
      <div style={centerStyle}>
        <h1>
          MFA using MERN Stack
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