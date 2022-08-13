import React from 'react';
import SignTxn from './pages/signTxn'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignTxn />} />
        </Routes>
      </Router>
      <div className='light x1'></div>
      <div className='light x2'></div>
      <div className='light x3'></div>
      <div className='light x4'></div>
      <div className='light x5'></div>
      <div className='light x6'></div>
      <div className='light x7'></div>
      <div className='light x8'></div>
      <div className='light x9'></div>
      </div>
  );
}

export default App;