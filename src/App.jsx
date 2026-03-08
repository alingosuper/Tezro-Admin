import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- CORE SECURITY ---
import FinalSecurityShield from './security/FinalSecurityShield'; 
import AppShell from './components/Navigation/AppShell'; 

// --- LAZY LOADED MODULES (Performance & Features Saved) ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const InvestPage = lazy(() => import('./website/pages/InvestPage'));
const FeaturesPage = lazy(() => import('./website/pages/FeaturesPage'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./components/Admin/InventoryManager'));
const Login = lazy(() => import('./screens/Auth/Login'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const TezroVaultLedger = lazy(() => import('./bank_core/TezroVaultLedger'));

const LoadingScreen = () => (
  <div style={styles.loaderContainer}>
    <div className="tezro-pulse-ring"></div>
    <p style={styles.loaderText}>🛡️ SECURE SESSION INITIALIZING...</p>
  </div>
);

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <FinalSecurityShield>
        <Suspense fallback={<LoadingScreen />}>
          <div style={{ background: colors?.bg || '#000', minHeight: '100vh', color: '#fff' }}>
            <Routes>
              
              {/* 🌐 1. PUBLIC WEBSITE SECTION (Invest & Features Included) */}
              <Route path="/" element={lazy(() => import('./website/WebsiteLayout'))}>
                <Route index element={<HomePage />} />
                <Route path="invest" element={<InvestPage />} />
                <Route path="features" element={<FeaturesPage />} />
              </Route>

              {/* 🔐 2. AUTHENTICATION */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/admin" />} />

              {/* 🛡️ 3. MASTER ADMIN PANEL (All Admin Features Saved) */}
              <Route 
                path="/admin/*" 
                element={user && role === 'admin' ? (
                  <AppShell adminUser={user}> 
                    <Routes>
                      {/* یہاں ترتیب بدلی ہے تاکہ انوینٹری ہوم پیج پر نہ آئے */}
                      <Route index element={<AdminDashboard />} />
                      <Route path="inventory" element={<InventoryManager theme={colors} />} />
                      <Route path="finance" element={<TezroVaultLedger />} />
                      <Route path="users" element={<div>System User Directory</div>} />
                    </Routes>
                  </AppShell>
                ) : (
                  <Navigate to="/login" />
                )} 
              </Route>

              {/* 📱 4. SUPER APP INTERFACE (Client Banking & Orders Saved) */}
              <Route 
                path="/app/*" 
                element={user ? (
                  <Routes>
                    <Route index element={<HomeScreen />} />
                    <Route path="banking" element={<div>Tezro Pay Core</div>} />
                    <Route path="orders" element={<OrderHistory />} />
                  </Routes>
                ) : (
                  <Navigate to="/login" />
                )} 
              </Route>

              {/* 🛰️ GLOBAL REDIRECT */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>
        </Suspense>
      </FinalSecurityShield>
    </Router>
  );
};

const styles = {
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505' },
  loaderText: { marginTop: '30px', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }
};

export default App;
