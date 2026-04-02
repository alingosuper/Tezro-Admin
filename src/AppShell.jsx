import React, { useState, Suspense, lazy } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Lazy Loading for Performance
const WarRoom = lazy(() => import('./pages/Admin/WarRoom'));
const RegistrationRequests = lazy(() => import('./pages/Admin/RegistrationRequests'));

const AppShell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'COMMAND CENTER', path: '/admin/war-room', icon: '🛰️' },
    { name: 'KYC & REGISTRATION', path: '/admin/requests', icon: '👥' },
    { name: 'FINANCIAL VAULT', path: '/admin/vault', icon: '💰' },
    { name: 'FLEET CONTROL', path: '/admin/fleet', icon: '🚗' },
    { name: 'SECURITY LOGS', path: '/admin/security', icon: '🔐' },
  ];

  return (
    <div style={container}>
      {/* 🔝 Ultra-Light Header */}
      <header style={headerStyle}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => setIsOpen(true)} style={menuBtn}>☰</button>
          <span style={brand}>TEZRO <span style={goldText}>ELITE</span></span>
        </div>
        <div style={systemStatus}>
          <span style={statusDot}></span> SERVER: OPTIMAL
        </div>
      </header>

      {/* 🏰 Invisible Sidebar Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} style={overlay}></div>}
      
      <aside style={sidebarStyle(isOpen)}>
        <div style={sideHeader}>NATIONAL CONTROL</div>
        <div style={navLinks}>
          {menuItems.map((item) => (
            <div 
              key={item.path}
              onClick={() => { navigate(item.path); setIsOpen(false); }}
              style={navItem(location.pathname === item.path)}
            >
              <span style={{fontSize: '18px'}}>{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>
        <div style={footerNote}>v1.0.0-SECURE</div>
      </aside>

      {/* 🚀 Dynamic Content Area (Load on Demand) */}
      <main style={mainContent}>
        <Suspense fallback={<div style={loader}>INITIATING SECURE MODULE...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

// Styles for High Performance
const container = { height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', overflow: 'hidden' };
const headerStyle = { height: '60px', background: '#050505', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #D4AF3733' };
const brand = { fontWeight: 'bold', letterSpacing: '2px', fontSize: '18px' };
const goldText = { color: '#D4AF37' };
const menuBtn = { background: 'none', border: 'none', color: '#D4AF37', fontSize: '24px', cursor: 'pointer' };
const systemStatus = { fontSize: '10px', color: '#44ff44', border: '1px solid #44ff4444', padding: '4px 10px', borderRadius: '15px' };
const statusDot = { height: '6px', width: '6px', background: '#44ff44', borderRadius: '50%', display: 'inline-block', marginRight: '5px', boxShadow: '0 0 5px #44ff44' };
const sidebarStyle = (isOpen) => ({ position: 'fixed', left: isOpen ? 0 : '-300px', top: 0, width: '280px', height: '100%', background: '#050505', z : '9999', transition: '0.3s ease', borderRight: '1px solid #D4AF3744', display: 'flex', flexDirection: 'column' });
const sideHeader = { padding: '30px 20px', fontSize: '14px', color: '#D4AF37', borderBottom: '1px solid #D4AF3722', textAlign: 'center', letterSpacing: '3px' };
const navLinks = { padding: '20px', flex: 1 };
const navItem = (active) => ({ padding: '15px', marginBottom: '10px', borderRadius: '10px', background: active ? 'rgba(212,175,55,0.1)' : 'transparent', color: active ? '#D4AF37' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', fontWeight: 'bold', border: active ? '1px solid #D4AF3744' : '1px solid transparent' });
const overlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998, backdropFilter: 'blur(3px)' };
const mainContent = { flex: 1, overflow: 'auto', position: 'relative' };
const footerNote = { padding: '20px', fontSize: '10px', color: '#333', textAlign: 'center' };
const loader = { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#D4AF37', fontSize: '12px', letterSpacing: '2px' };

export default AppShell;
