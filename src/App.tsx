import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import TigerPage from './components/TigerPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tiger" element={<TigerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
