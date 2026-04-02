import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 🚀 Lazy Loading: صرف ضرورت پڑنے پر صفحہ لوڈ ہوگا (Server Friendly)
const WarRoom = lazy(() => import('./pages/Admin/WarRoom'));
const Users = lazy(() => import('./pages/Admin/UsersManagement'));
const Vendors = lazy(() => import('./pages/Admin/VendorsManagement'));
const Orders = lazy(() => import('./pages/Admin/OrdersManagement'));
const Wallet = lazy(() => import('./pages/Admin/WalletManagement'));
const Fleet = lazy(() => import('./pages/Admin/FleetManagement'));
const Shop = lazy(() => import('./pages/Admin/ShopManagement'));
const AILogs = lazy(() => import('./pages/Admin/AILogs'));
const Security = lazy(() => import('./pages/Admin/SecurityControl'));
const Analytics = lazy(() => import('./pages/Admin/ReportsAnalytics'));
const Settings = lazy(() => import('./pages/Admin/Settings'));
const Profile = lazy(() => import('./pages/Admin/ProfileAccount'));

const App = () => {
  return (
    <Router>
      <div style={layout}>
        {/* 📟 Side Command Navigation */}
        <nav style={sidebar}>
          <div style={logo}>TEZRO <span style={{color:'#D4AF37'}}>OS</span></div>
          <div style={navLinks}>
            <Link to="/" style={navItem}>🏯 WAR ROOM</Link>
            <Link to="/users" style={navItem}>👥 USERS</Link>
            <Link to="/vendors" style={navItem}>🏪 VENDORS</Link>
            <Link to="/orders" style={navItem}>📦 ORDERS</Link>
            <Link to="/wallet" style={navItem}>💳 WALLET</Link>
            <Link to="/fleet" style={navItem}>🏎️ FLEET</Link>
            <Link to="/shop" style={navItem}>🛍️ SHOP</Link>
            <Link to="/ai-logs" style={navItem}>🧠 AI LOGS</Link>
            <Link to="/security" style={navItem}>🛡️ SECURITY</Link>
            <Link to="/analytics" style={navItem}>📊 ANALYTICS</Link>
            <Link to="/settings" style={navItem}>⚙️ SETTINGS</Link>
            <Link to="/profile" style={navItem}>👤 PROFILE</Link>
          </div>
        </nav>

        {/* 🖥️ Main Display Area */}
        <main style={mainContent}>
          <Suspense fallback={<div style={loader}>ENCRYPTING SECURE NODE...</div>}>
            <Routes>
              <Route path="/" element={<WarRoom />} />
              <Route path="/users" element={<Users />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/ai-logs" element={<AILogs />} />
              <Route path="/security" element={<Security />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

// 💅 Master Layout Styles
const layout = { display: 'flex', height: '100vh', background: '#000', color: '#fff', overflow: 'hidden' };
const sidebar = { width: '240px', background: '#050505', borderRight: '1px solid #D4AF3722', display: 'flex', flexDirection: 'column', padding: '20px' };
const logo = { fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', letterSpacing: '3px' };
const navLinks = { display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' };
const navItem = { color: '#888', textDecoration: 'none', fontSize: '11px', padding: '10px', borderRadius: '8px', transition: '0.3s' };
const mainContent = { flex: 1, overflowY: 'auto', position: 'relative' };
const loader = { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#D4AF37', fontSize: '12px', letterSpacing: '2px' };

export default App;
