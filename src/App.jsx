import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- SECURITY & CORE ---
import FinalSecurityShield from './security/FinalSecurityShield'; // ہیکنگ اور غیر قانونی رسائی سے بچاؤ
import AppShell from './AppShell'; // ماسٹر لے آؤٹ جس میں ہیڈر اور سائیڈ بار شامل ہے

// --- LAYOUTS ---
import WebsiteLayout from './website/WebsiteLayout'; 

// --- LAZY LOADED PAGES ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./components/Admin/InventoryManager')); // آپ کا نیا پروڈکٹ فارم
const Login = lazy(() => import('./screens/Auth/Login'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));

// پریمیم لوڈنگ اسکرین
const LoadingScreen = () => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#D4AF37' }}>
    <div className="tezro-spinner" style={{ width: '50px', height: '50px', border: '3px solid #333', borderTop: '3px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <p style={{ marginTop: '20px', fontWeight: 'bold', letterSpacing: '4px', fontSize: '12px' }}>🛡️ TEZRO ENCRYPTED SESSION</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <FinalSecurityShield> {/* پورے پلیٹ فارم پر کڑی نگرانی */}
        <Suspense fallback={<LoadingScreen />}>
          <div style={{ background: colors?.bg || '#050505', minHeight: '100vh' }}>
            <Routes>
              
              {/* 🌐 ویب سائٹ سیکشن (Public) */}
              <Route element={<WebsiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/invest" element={lazy(() => import('./website/pages/InvestPage'))} />
                <Route path="/features" element={lazy(() => import('./website/pages/FeaturesPage'))} />
              </Route>

              {/* 🔐 تصدیق (Authentication) */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

              {/* 🛡️ ماسٹر ایڈمن پینل (Protected) */}
              <Route 
                path="/dashboard/*" 
                element={user && role === 'admin' ? (
                  <AppShell> {/* یہاں ہیڈر اور مینیو خود بخود نظر آئیں گے */}
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="inventory" element={<InventoryManager theme={colors} />} />
                      <Route path="finance" element={<div>Vault Ledger Control</div>} />
                      <Route path="users" element={<div>User Management</div>} />
                    </Routes>
                  </AppShell>
                ) : (
                  <Navigate to="/login" />
                )} 
              />

              {/* 📱 سپر ایپ انٹرفیس (Protected) */}
              <Route 
                path="/app/*" 
                element={user ? (
                  <Routes>
                    <Route index element={<HomeScreen />} />
                    <Route path="banking" element={<div>Tezro Pay</div>} />
                  </Routes>
                ) : (
                  <Navigate to="/login" />
                )} 
              />

              {/* 404 ری ڈائریکٹ */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>
        </Suspense>
      </FinalSecurityShield>
    </Router>
  );
};

export default App;
