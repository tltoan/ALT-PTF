import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CosmicPortfolio from './components/CosmicPortfolio';
import ProjectsPage from './pages/ProjectsPage';
import MediaPage from './pages/MediaPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CosmicPortfolio />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
