import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // 🛡️ سیکیورٹی پاس ورڈز کی ترتیب (مثال)
  const [securityConfig, setSecurityConfig] = useState({
    geoFencing: false,
    fingerprint: false,
    rootPassword: '',
  });

  const menuItems = [
    { name: 'ڈیش بورڈ (Stats)', icon: '📊', path: '/admin/dashboard' },
    { name: 'رجسٹریشن (AI)', icon: '👥', path: '/admin/requests' },
    { name: 'لائیو (Maps)', icon: '🛰️', path: '/admin/live' },
  ];

  const settingItems = [
    { name: 'جیو فینسنگ', icon: '📍', key: 'geoFencing' },
    { name: 'فنگر پرنٹ', icon: '☝️', key: 'fingerprint' },
    { name: 'پاس ورڈ ترتیب', icon: '🔐', key: 'rootPassword' },
  ];

  return (
    <div style={containerStyle}>
      {/* 🏰 100% Folding Sidebar (All Golden Shiny Buttons Inside) */}
      <div style={sidebarStyle(isSidebarOpen)}>
        <div style={{ padding: '20px', borderBottom: '1px solid #D4AF3722', marginBottom: '20px' }}>
          <div style={{ fontSize: '20px', textAlign: 'center', filter: 'drop-shadow(0 0 5px #D4AF37)' }}>⚜️ TEZRO ALIVE</div>
        </div>
        
        {/* Main Menu */}
        {menuItems.map(item => (
          <div key={item.path} onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} style={shinyMenuItemStyle}>
            <span>{item.icon}</span>
            <span style={{ flex: 1, textAlign: 'right' }}>{item.name} ✨</span>
          </div>
        ))}

        {/* ⚙️ Setting Menu (with Security Configuration) */}
        <div style={settingGroupStyle}>
          <div style={settingHeaderStyle}>سیٹنگز CONTROL ⋮</div>
          {settingItems.map(item => (
            <div key={item.key} style={subItemStyle}>
              <span>{item.icon} {item.name}</span>
              <input 
                type={item.key === 'rootPassword' ? 'password' : 'checkbox'} 
                checked={item.key !== 'rootPassword' ? securityConfig[item.key] : undefined}
                onChange={(e) => setSecurityConfig({...securityConfig, [item.key]: item.key === 'rootPassword' ? e.target.value : e.target.checked})}
                style={item.key === 'rootPassword' ? inputStyle : checkboxStyle}
                placeholder={item.key === 'rootPassword' ? 'نیا پاس ورڈ' : undefined}
              />
            </div>
          ))}
          <button style={saveSecurityBtnStyle} onClick={() => alert('🔐 Security Settings Saved to Tezro Core!')}>محفوظ کریں</button>
        </div>

        <div style={{ marginTop: 'auto', padding: '15px', color: '#666', fontSize: '12px', textAlign: 'center', borderTop: '1px solid #111' }}>
          🚪 Safe Sign Out
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 🔝 Elite Header */}
        <header style={headerStyle}>
          {/* Left: 3 Lines Button */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={threeLinesBtnStyle}>☰</button>
          
          {/* Center: Golden Shiny Logo */}
          <div style={logoWrapperStyle}>
            <div style={logoGlowCircle} />
            <img src="/logo.png" alt="Tezro Logo" style={logoStyle} />
          </div>
          
          {/* Right: Notification Bell */}
          <button onClick={() => alert('🔔 Security Alerts Open')} style={notifBellBtnStyle}>🔔 <span style={notifBadgeStyle}>2</span></button>
        </header>

        {/* 🖥️ Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// 🎨 Styles (گولڈن شائینی تھیم کے مطابق)
const containerStyle = { display: 'flex', height: '100vh', background: '#000', color: '#D4AF37', overflow: 'hidden', fontFamily: 'sans-serif' };
const sidebarStyle = (isOpen) => ({ width: isOpen ? '280px' : '0', background: '#050505', borderRight: '1px solid #D4AF3722', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease-in-out', overflow: 'hidden' });
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', borderBottom: '1px solid #D4AF3722', padding: '10px 20px', zIndex: 1000 };
const shinyMenuItemStyle = { background: '#111', color: '#D4AF37', border: '1px solid #D4AF3744', padding: '12px 15px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)', marginBottom: '8px' };
const threeLinesBtnStyle = { background: 'transparent', color: '#D4AF37', border: 'none', fontSize: '24px', cursor: 'pointer' };
const notifBellBtnStyle = { background: 'transparent', color: '#D4AF37', border: 'none', fontSize: '20px', cursor: 'pointer', position: 'relative' };
const notifBadgeStyle = { position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '8px', padding: '3px', borderRadius: '50%' };
const logoWrapperStyle = { position: 'relative', height: '40px', width: '40px' };
const logoStyle = { height: '100%', width: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 5px #D4AF37)' };
const logoGlowCircle = { position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%)', boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' };
const settingGroupStyle = { background: '#0a0a0a', padding: '15px', borderRadius: '15px', border: '1px solid #1a1a1a', marginTop: '20px' };
const settingHeaderStyle = { color: '#ccc', fontSize: '11px', marginBottom: '10px', borderBottom: '1px solid #222', paddingBottom: '5px' };
const subItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#aaa', padding: '5px 0' };
const checkboxStyle = { accentColor: '#D4AF37', cursor: 'pointer' };
const inputStyle = { background: '#111', border: '1px solid #333', color: 'white', padding: '5px', borderRadius: '5px', width: '100px', fontSize: '10px' };
const saveSecurityBtnStyle = { background: 'linear-gradient(45deg, #D4AF37 0%, #F5D76E 100%)', color: '#000', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', width: '100%', marginTop: '10px', cursor: 'pointer' };

export default AppShell;
