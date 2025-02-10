import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReportGenerator from './pages/ReportGenerator';
import ApiTester from './pages/ApiTester';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report" element={<ReportGenerator />} />
      <Route path="/api-tester" element={<ApiTester />} />
    </Routes>
  );
}

export default App;