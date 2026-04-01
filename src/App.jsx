import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import AdminDashboard from './screens/Admin/AdminDashboard.jsx';
import RegistrationRequests from './screens/Admin/RegistrationRequests.jsx';
import LivePerformance from './screens/Admin/LivePerformance.jsx';
import AdminLogin from './screens/Auth/AdminLogin.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<RegistrationRequests />} />
          <Route path="live" element={<LivePerformance />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
