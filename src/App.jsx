import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🛡️ سیکیورٹی اور مانیٹرنگ (Admin Side)
import { startGhostMonitoring } from './security/GhostData';
import { initSecurityShield } from './security/FinalSecurityShield';

// 🔥 فائر بیس
import * as FirebaseModule from './firebase';

// 🖥️ ایڈمن اسکرینز
import AdminDashboard from './screens/Admin/AdminDashboard';
import LivePerformance from './screens/Admin/LivePerformance';
import AdminLogin from './screens/Auth/AdminLogin';

function App() {
  useEffect(() => {
    try {
      // 1. سیکیورٹی لیول ایکٹیویٹ کریں
      initSecurityShield();

      // 2. ایڈمن مانیٹرنگ انجن شروع کریں (پورے ایکو سسٹم کے لیے)
      startGhostMonitoring("global_admin_mode");

      console.log("🛡️ Tezro Admin: Command Center Active.");
    } catch (error) {
      console.error("Admin Security Bridge Error:", error);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ایڈمن روٹس */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/live" element={<LivePerformance />} />
        
        {/* ڈیفالٹ روٹ ایڈمن ڈیش بورڈ پر جائے گا */}
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
