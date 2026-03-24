import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'ڈیش بورڈ (Stats)', path: '/admin/dashboard', icon: '📊' },
    { name: 'رجسٹریشن ریکویسٹ (AI)', path: '/admin/requests', icon: '🛡️' },
    { name: 'لائیو مانیٹرنگ (Maps)', path: '/admin/live', icon: '📍' },
    { name: 'سیکیورٹی لاگز', path: '/admin/logs', icon: '🕵️' },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={logoSection}>
        <img src="/logo.png" alt="Tezro" style={{ width: '50px' }} />
        <h2 style={{ color: '#FFD700', fontSize: '18px' }}>ADMIN PANEL</h2>
      </div>

      <nav style={{ marginTop: '30px' }}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            style={{
              ...navLink,
              background: location.pathname === item.path ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              borderRight: location.pathname === item.path ? '4px solid #FFD700' : 'none'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ marginRight: '15px' }}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div style={footerStyle}>
        <button onClick={() => window.location.href='/admin/login'} style={logoutBtn}>
          لاگ آؤٹ 🚪
        </button>
      </div>
    </div>
  );
};

const sidebarStyle = {
  width: '260px',
  height: '100vh',
  background: '#0a0a0a',
  borderLeft: '1px solid #333',
  position: 'fixed',
  right: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100
};

const logoSection = { padding: '20px', textAlign: 'center', borderBottom: '1px solid #222' };
const navLink = {
  display: 'flex',
  alignItems: 'center',
  padding: '15px 25px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '14px',
  transition: '0.3s',
  borderBottom: '1px solid #111'
};

const footerStyle = { marginTop: 'auto', padding: '20px', borderTop: '1px solid #222' };
const logoutBtn = {
  width: '100%',
  padding: '10px',
  background: 'transparent',
  color: '#ff4444',
  border: '1px solid #ff4444',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default AdminSidebar;
