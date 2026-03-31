import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 🖥️ لے آؤٹ اور اسکرینز
import AppShell from './AppShell';
import AdminDashboard from './screens/Admin/AdminDashboard';
import RegistrationRequests from './screens/Admin/RegistrationRequests';
import LivePerformance from './screens/Admin/LivePerformance';
import AdminLogin from './screens/Auth/AdminLogin';

// 🔓 Protected Route Guard
const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Dev Bypass Check
  const isBypassActive = new URLSearchParams(window.location.search).get('access') === 'Tezro_Dev_99' || 
                         localStorage.getItem('tezro_bypass') === 'true';

  useEffect(() => {
    if (isBypassActive) {
      localStorage.setItem('tezro_bypass', 'true');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isBypassActive]);

  if (loading) return (
    <div style={{background:'#000', color:'#FFD700', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'sans-serif', flexDirection:'column'}}>
       <div style={{fontSize: '24px', marginBottom: '10px'}}>🛡️</div>
       <div>Tezro Security Shield Active...</div>
    </div>
  );

  // اگر لاگ ان نہیں ہے اور بائی پاس بھی نہیں ہے تو لاگ ان پیج پر بھیجیں
  if (!user && !isBypassActive) {
    return <Navigate to="/admin/login" replace />;
  }

  // اگر سب ٹھیک ہے تو بچوں (Children) کو دکھائیں
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* پبلک روٹ */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* پروٹیکٹڈ روٹس */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="requests" element={<RegistrationRequests />} />
            <Route path="live" element={<LivePerformance />} />
          </Route>
        </Route>

        {/* ڈیفالٹ راستہ - اب یہ سفید اسکرین نہیں دے گا */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
