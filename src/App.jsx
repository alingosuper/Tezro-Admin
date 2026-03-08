import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- CORE SECURITY & ARCHITECTURE ---
import FinalSecurityShield from './security/FinalSecurityShield'; 
import AppShell from './components/Navigation/AppShell'; 

// --- LAZY COMPONENTS (All Features Retained) ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const InvestPage = lazy(() => import('./website/pages/InvestPage'));
const FeaturesPage = lazy(() => import('./website/pages/FeaturesPage'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./components/Admin/InventoryManager'));
const Login = lazy(() => import('./screens/Auth/Login'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const TezroVaultLedger = lazy(() => import('./bank_core/TezroVaultLedger'));

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();
  
  // 🔐 لوکل ڈیوائس سیکیورٹی سٹیٹ
  const [isDeviceSecure, setIsDeviceSecure] = useState(true);

  // لائیو چیک: اگر ڈیوائس پہلے سے لاک ہے
  useEffect(() => {
    const lockStatus = localStorage.getItem('TEZRO_LOCAL_LOCK');
    if (lockStatus === 'TRUE') setIsDeviceSecure(false);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      {/* 🛡️ شیلڈ پورے سسٹم کو مانیٹر کرے گی */}
      <FinalSecurityShield 
        onThreatDetected={() => {
          setIsDeviceSecure(false);
          localStorage.setItem('TEZRO_LOCAL_LOCK', 'TRUE');
        }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <div style={{ background: colors?.bg || '#000', minHeight: '100vh', color: '#fff' }}>
            
            {/* 🚨 سمارٹ راؤٹنگ لاک ڈاؤن */}
            {isDeviceSecure ? (
              <Routes>
                
                {/* 🌐 پبلک زون (Website) */}
                <Route path="/" element={lazy(() => import('./website/WebsiteLayout'))}>
                  <Route index element={<HomePage />} />
                  <Route path="invest" element={<InvestPage />} />
                  <Route path="features" element={<FeaturesPage />} />
                </Route>

                {/* 🔐 آتھ زون */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to={role === 'admin' ? "/admin" : "/app"} />} />

                {/* 🛡️ ایڈمن زون (Isolated Routing) */}
                <Route path="/admin/*" element={user && role === 'admin' ? (
                  <AppShell adminUser={user}> 
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="inventory" element={<InventoryManager theme={colors} />} />
                      <Route path="finance" element={<TezroVaultLedger />} />
                      <Route path="users" element={<div>System User Directory</div>} />
                    </Routes>
                  </AppShell>
                ) : <Navigate to="/login" />} />

                {/* 📱 سپر ایپ (Client Zone) */}
                <Route path="/app/*" element={user ? (
                  <Routes>
                    <Route index element={<HomeScreen />} />
                    <Route path="banking" element={<div>Tezro Pay Core</div>} />
                    <Route path="orders" element={<OrderHistory />} />
                  </Routes>
                ) : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            ) : (
              /* 🔒 ڈیوائس لاک آؤٹ پیج (صرف اسی براؤزر پر نظر آئے گا) */
              <SecurityBreachScreen onUnlock={() => setIsDeviceSecure(true)} />
            )}
          </div>
        </Suspense>
      </FinalSecurityShield>
    </Router>
  );
};

// --- سیکیورٹی وارننگ کمپوننٹ ---
const SecurityBreachScreen = ({ onUnlock }) => (
  <div style={styles.breachContainer}>
    <h1 style={{color: '#ff4444', fontSize: '24px'}}>🛡️ SECURITY LOCKOUT</h1>
    <p style={styles.breachText}>This device has been isolated due to suspicious activity.</p>
    <button style={styles.unlockBtn} onClick={() => {
       localStorage.removeItem('TEZRO_LOCAL_LOCK');
       window.location.reload();
    }}>Verify & Re-Authorize Device</button>
  </div>
);

const LoadingScreen = () => (
  <div style={styles.loaderContainer}>
    <div className="tezro-pulse-ring"></div>
    <p style={styles.loaderText}>🛡️ ESTABLISHING ENCRYPTED SESSION...</p>
  </div>
);

const styles = {
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505' },
  loaderText: { marginTop: '30px', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px' },
  breachContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', textAlign: 'center', padding: '20px' },
  breachText: { color: '#666', fontSize: '12px', marginTop: '10px', maxWidth: '300px', lineHeight: '1.6' },
  unlockBtn: { marginTop: '30px', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }
};

export default App;
