import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const shinyGoldBtn = {
    background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    transition: '0.3s'
  };

  return (
    <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* 🔝 Premium Header */}
      <header style={headerStyle}>
        <button onClick={() => setIsSidebarOpen(true)} style={navBtnStyle}>☰</button>
        <div style={logoContainer}>
          <div style={glowEffect}></div>
          <img src="/logo.png" style={logoImg} alt="Logo" />
        </div>
        <button style={navBtnStyle}>🔔<span style={badge}>2</span></button>
      </header>

      {/* 🏰 Overlapping Sidebar (Fix: Opens OVER the map) */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={overlayStyle} />}
      <div style={sidebarStyle(isSidebarOpen)}>
        <div style={{padding: '20px', textAlign: 'center', borderBottom: '1px solid #D4AF3744'}}>
          <h3 style={{color: '#D4AF37', margin: 0}}>TEZRO ADMIN</h3>
        </div>
        <div style={{padding: '15px'}}>
          <div style={shinyGoldBtn} onClick={() => navigate('/admin/dashboard')}>📊 STATS DASHBOARD</div>
          <div style={shinyGoldBtn} onClick={() => navigate('/admin/requests')}>👥 REGISTRATION AI</div>
          <div style={shinyGoldBtn} onClick={() => navigate('/admin/live')}>🛰️ LIVE MONITORING</div>
          
          <div style={{marginTop: '20px', color: '#888', fontSize: '12px'}}>SECURITY CONTROL</div>
          <div style={shinyGoldBtn}>📍 GEO-FENCING</div>
          <div style={shinyGoldBtn}>☝️ FINGERPRINT</div>
        </div>
      </div>

      <main style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </main>
    </div>
  );
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#050505', borderBottom: '2px solid #D4AF3722', zIndex: 100 };
const navBtnStyle = { background: 'none', border: 'none', color: '#D4AF37', fontSize: '24px', cursor: 'pointer' };
const logoContainer = { position: 'relative', width: '50px', height: '50px' };
const logoImg = { width: '100%', height: '100%', zIndex: 2, position: 'relative', filter: 'drop-shadow(0 0 5px #D4AF37)' };
const glowEffect = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#D4AF37', borderRadius: '50%', filter: 'blur(15px)', opacity: 0.3 };
const sidebarStyle = (isOpen) => ({ position: 'fixed', top: 0, left: isOpen ? 0 : '-300px', width: '280px', height: '100%', background: '#050505', zIndex: 9999, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderRight: '2px solid #D4AF3744', boxShadow: '10px 0 30px rgba(0,0,0,0.9)' });
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 9998, backdropFilter: 'blur(3px)' };
const badge = { position: 'absolute', top: '10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px' };

export default AppShell;
