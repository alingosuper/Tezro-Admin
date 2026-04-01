import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'ڈیش بورڈ (Stats)', path: '/admin/dashboard', icon: '📊' },
    { name: 'رجسٹریشن ریکویسٹ (AI)', path: '/admin/requests', icon: '📩' },
    { name: 'لائیو مانیٹرنگ (Maps)', path: '/admin/live', icon: '🛰️' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* 🏰 Elite Slim Sidebar */}
      <div style={{ width: '240px', background: '#050505', borderRight: '1px solid #1a1a1a', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '10px', borderBottom: '1px solid #111' }}>
           <div style={{fontSize: '30px', filter: 'drop-shadow(0 0 5px #D4AF37)'}}>⚜️</div>
           <h2 style={{ color: '#D4AF37', letterSpacing: '2px', fontSize: '16px', margin: '5px 0' }}>TEZRO ADMIN</h2>
        </div>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '12px 15px', marginBottom: '8px', borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', transition: '0.3s',
                background: isActive ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                border: isActive ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
                position: 'relative',
              }}
            >
              {isActive && <div style={{ position: 'absolute', right: '-15px', top: '20%', height: '60%', width: '3px', background: '#D4AF37', borderRadius: '5px 0 0 5px', boxShadow: '0 0 10px #D4AF37' }} />}
              <span style={{ fontWeight: '500', color: isActive ? '#D4AF37' : '#aaa', fontSize: '14px', marginRight: '10px' }}>{item.name}</span>
              <span style={{ fontSize: '18px', filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)' }}>{item.icon}</span>
            </div>
          );
        })}
        
        <div style={{ marginTop: 'auto', padding: '12px', color: '#666', cursor: 'pointer', textAlign: 'center', borderTop: '1px solid #111', fontSize: '12px' }}>
          🚪 Safe Sign Out
        </div>
      </div>

      {/* 🖥️ Main Content Area (Glassy Backdrop) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppShell;
