import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// سیکیورٹی انجن
import { startGhostMonitoring } from './security/GhostData';
import { initSecurityShield } from './security/FinalSecurityShield';

// لے آؤٹ اور اسکرینز
import AppShell from './AppShell';
import AdminDashboard from './screens/Admin/AdminDashboard';
import RegistrationRequests from './screens/Admin/RegistrationRequests';
import LivePerformance from './screens/Admin/LivePerformance';
import AdminLogin from './screens/Auth/AdminLogin';

function App() {
  useEffect(() => {
    initSecurityShield();
    startGhostMonitoring("global_admin_mode");
  }, []);

  return (
    <Router>
      <Routes>
        {/* لاگ ان پیج */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* تمام ایڈمن پیجز ایپ شیل کے اندر */}
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<RegistrationRequests />} />
          <Route path="live" element={<LivePerformance />} />
        </Route>

        {/* ڈیفالٹ ری ڈائریکٹ */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
