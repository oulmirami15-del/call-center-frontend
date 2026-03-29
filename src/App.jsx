import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import AdminPanel from './pages/AdminPanel';
import { AgentProvider } from './context/AgentContext';

function App() {
  return (
    <BrowserRouter>
      <AgentProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AgentProvider>
    </BrowserRouter>
  );
}

export default App;
