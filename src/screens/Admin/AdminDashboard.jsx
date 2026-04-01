import React, { useState } from 'react';
import LiveMap from '../../components/Dashboard/WarRoom/LiveMap.jsx';
import ThreatAlerts from '../../components/Dashboard/WarRoom/ThreatAlerts.jsx';

const AdminDashboard = () => {
  return (
    <div style={dashboardContainerStyle}>
      {/* 🗺️ Massive Full Screen Leaflet Map (All over the page) */}
      <div style={mapWrapperStyle}>
        {/* Overlays inside Map */}
        <div style={mapOverlayLeft}>
           <div style={statusBadge}>LIVE TRAFFIC: ACTIVE</div>
           <div style={statusBadge}>NODES: 14 ONLINE</div>
        </div>
        
        {/* Map Control Buttons (inside map) */}
        <div style={mapOverlayRight}>
           <button style={mapControlBtnStyle}>➕</button>
           <button style={mapControlBtnStyle}>➖</button>
           <button style={mapControlBtnStyle}>🌐</button>
        </div>
        
        <LiveMap />
      </div>

      {/* 🛡️ Footer (Emergency & Critical Panels) */}
      <footer style={footerStyle}>
        <ThreatAlerts />
        
        {/* Emergency Shiny Buttons */}
        <div style={{display:'flex', gap:'10px', flexDirection:'column'}}>
           <button style={emergencyBtnStyle('#ff4444')} onClick={() => alert('🚨 Terminal Lock & Force Reboot Initiated!')}>TERMINAL LOCK 🔒</button>
           <button style={emergencyBtnStyle('#ffaa44')}>VAULT REBOOT ⚡</button>
        </div>
      </footer>
    </div>
  );
};

// 🎨 Golden & Dark Emergency Styles
const dashboardContainerStyle = { display: 'flex', flexDirection: 'column', height: '100%', background: '#000', color: '#D4AF37' };
const mapWrapperStyle = { flex: 1, position: 'relative', border: '1px solid #D4AF3744', overflow: 'hidden' };
const footerStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', background: '#050505', borderTop: '1px solid #D4AF3722', padding: '15px', height: '150px' };
const emergencyBtnStyle = (color) => ({ background: 'rgba('+color+', 0.05)', color: color, border: '1px solid '+color+'44', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px rgba('+color+', 0.2)' });
const mapOverlayLeft = { position: 'absolute', top: '15px', left: '15px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' };
const mapOverlayRight = { position: 'absolute', top: '15px', right: '15px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' };
const statusBadge = { background: 'rgba(0,0,0,0.8)', color: '#44ff44', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', border: '1px solid #44ff4444', backdropFilter: 'blur(5px)' };
const mapControlBtnStyle = { background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid #D4AF3744', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminDashboard;
