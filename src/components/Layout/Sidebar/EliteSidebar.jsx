import React, { useState } from 'react';

const EliteSidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const menuItems = [
    { title: "Dashboard (Stats)", icon: "📊" },
    { title: "Vault LEDGER", icon: "🔐" },
    { title: "Live Traffic (Maps)", icon: "🛰️" },
  ];

  return (
    <div style={sidebarContainerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '30px', marginBottom: '10px', filter: 'drop-shadow(0 0 5px #D4AF37)' }}>⚜️</div>
        <h2 style={{ color: '#D4AF37', letterSpacing: '4px', fontSize: '16px' }}>TEZRO ELITE</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {menuItems.map(item => (
          <div key={item.title} style={menuItemStyle}>
             <span>{item.icon}</span>
             <span style={{flex: 1, textAlign: 'right'}}>{item.title} 🔒</span>
          </div>
        ))}
        
        {/* 📉 Rates Control (Shiny Golden Button) */}
        <div style={goldenGlowButtonStyle(activeMenu === 'rates')} onClick={() => toggleMenu('rates')}>
           <span>💹 RATES CONTROL {activeMenu === 'rates' ? '▲' : '▼'}</span>
           {activeMenu === 'rates' && (
              <div style={subMenuContainerStyle}>
                 <div style={subMenuItemStyle}>• VIEW RATES</div>
                 <div style={subMenuItemStyle}>• UPDATE RATES</div>
              </div>
           )}
        </div>
        
        {/* 💰 Commission Control (Shiny Golden Button) */}
        <div style={goldenGlowButtonStyle(activeMenu === 'comm')} onClick={() => toggleMenu('comm')}>
           <span>💰 COMMISSION CONTROL {activeMenu === 'comm' ? '▲' : '▼'}</span>
           {activeMenu === 'comm' && (
              <div style={subMenuContainerStyle}>
                 <div style={subMenuItemStyle}>• ACTIVE COMMISSION</div>
                 <div style={subMenuItemStyle}>• ADJUST COMMISSION</div>
              </div>
           )}
        </div>
        
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', color: '#666', fontSize: '10px' }}>
        🚪 Safe Sign Out
      </div>
    </div>
  );
};

// 🎨 Golden Glow Styles
const sidebarContainerStyle = { width: '250px', background: '#050505', borderRight: '1px solid #D4AF3744', padding: '20px', display: 'flex', flexDirection: 'column' };
const menuItemStyle = { background: '#111', color: '#D4AF37', border: '1px solid #D4AF3722', padding: '12px 15px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center' };
const subMenuContainerStyle = { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', paddingLeft: '15px' };
const subMenuItemStyle = { background: '#1a1a1a', color: '#ccc', border: '1px solid #222', padding: '8px', borderRadius: '8px', fontSize: '10px' };
const goldenGlowButtonStyle = (isOpen) => ({ ...menuItemStyle, background: isOpen ? '#1a1a1a' : 'linear-gradient(45deg, #1a1a1a 0%, #000 100%)', height: isOpen ? 'auto' : '45px', overflow: 'hidden', border: '1px solid #D4AF3766', boxShadow: isOpen ? '0 0 15px rgba(212,175,55,0.2)' : '0 0 5px rgba(212,175,55,0.1)' });

export default EliteSidebar;
