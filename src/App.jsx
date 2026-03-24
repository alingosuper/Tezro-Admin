import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// 🖥️ لے آؤٹ اور اسکرینز
import AppShell from './AppShell';
import AdminDashboard from './screens/Admin/AdminDashboard';
import RegistrationRequests from './screens/Admin/RegistrationRequests';
import LivePerformance from './screens/Admin/LivePerformance';
import AdminLogin from './screens/Auth/AdminLogin';

// 🔓 Developer Bypass Guard (بغیر لاگ ان کے جائزہ لینے کے لیے)
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // URL میں 'dev=true' چیک کریں
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{background:'#000', color:'#FFD700', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>🛡️ Tezro Shield Loading...</div>;

  // اگر Dev Mode آن ہے یا یوزر لاگ ان ہے، تو اندر جانے دیں
  if (isDevMode || user) {
    return children;
  }

  return <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<RegistrationRequests />} />
          <Route path="live" element={<LivePerformance />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
