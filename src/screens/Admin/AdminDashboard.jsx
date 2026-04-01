import React from 'react';
import LiveMap from '../../components/Dashboard/WarRoom/LiveMap.jsx';
import ThreatAlerts from '../../components/Dashboard/WarRoom/ThreatAlerts.jsx';

const AdminDashboard = () => {
  const handleLock = () => {
    if(window.confirm("🚨 WARNING: Initiate Full System Lockdown?")) {
      alert("🔒 TERMINAL SECURED. ALL NODES ENCRYPTED.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 🗺️ Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
         <div style={mapUI}>
            <button style={uiBtn}>➕</button>
            <button style={uiBtn}>➖</button>
            <button style={uiBtn}>🛰️</button>
         </div>
         <LiveMap />
      </div>

      {/* 🛡️ Shiny Footer */}
      <footer style={footerStyle}>
        <ThreatAlerts />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleLock} style={emergencyBtn('#ff4444')}>TERMINAL LOCK 🔒</button>
          <button style={emergencyBtn('#D4AF37')}>VAULT REBOOT ⚡</button>
        </div>
      </footer>
    </div>
  );
};

const mapUI = { position: 'absolute', top: '20px', right: '20px', zIndex: 500, display: 'flex', flexDirection: 'column', gap: '10px' };
const uiBtn = { background: 'rgba(0,0,0,0.8)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '10px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 10px #D4AF3744' };
const footerStyle = { background: '#050505', borderTop: '2px solid #D4AF3744', padding: '15px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' };
const emergencyBtn = (clr) => ({
  background: '#000',
  color: clr,
  border: '1px solid ' + clr,
  padding: '15px',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: 'inset 0 0 10px ' + clr + '22, 0 0 15px ' + clr + '44',
  textTransform: 'uppercase',
  fontSize: '12px'
});

export default AdminDashboard;
