import React, { useState } from 'react';
// ہم نے پاتھ کو پکا کر دیا ہے تاکہ Vite کو ایرر نہ ملے
import TezroMap from '../../components/Dashboard/TezroMap.jsx';

const AdminDashboard = () => {
  const [showRates, setShowRates] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', gap: '15px', color: '#fff' }}>
      
      {/* 🔝 Top Buttons (Admin Power Controls) */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => alert('ریٹس کنٹرول اوپن')} style={topBtnStyle}>💹 ریٹس</button>
        <button onClick={() => alert('کمشن کنٹرول اوپن')} style={topBtnStyle}>💰 کمشن</button>
        <button style={topBtnStyle}>🛡️ الرٹس</button>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '15px', overflow: 'hidden' }}>
        
        {/* 🚨 Notifications */}
        <div style={sidePanelStyle}>
          <h3 style={headerStyle}>THREATS ⚠️</h3>
          <div style={alertItemStyle("#ff4444")}>Unauthorized login attempt</div>
          <div style={alertItemStyle("#D4AF37")}>New High Value Transaction</div>
        </div>

        {/* 🗺️ Massive Center Map */}
        <div style={{ flex: 3, background: '#000', borderRadius: '20px', position: 'relative' }}>
          <TezroMap />
        </div>

        {/* ⚙️ System Controls */}
        <div style={sidePanelStyle}>
          <h3 style={headerStyle}>MASTER CONTROL</h3>
          <button style={controlBtnStyle}>LOCK ALL 🔐</button>
          <button style={controlBtnStyle}>REBOOT ⚡</button>
          <div style={{marginTop: 'auto', textAlign: 'center'}}>
             <small style={{color: '#444'}}>CPU: 12% | RAM: 40%</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const sidePanelStyle = { flex: 0.8, background: '#050505', borderRadius: '20px', border: '1px solid #1a1a1a', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' };
const headerStyle = { color: '#D4AF37', fontSize: '12px', textAlign: 'center', borderBottom: '1px solid #111', paddingBottom: '10px' };
const topBtnStyle = { background: '#111', color: '#D4AF37', border: '1px solid #D4AF3744', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' };
const controlBtnStyle = { background: '#111', color: '#fff', border: '1px solid #222', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px' };
const alertItemStyle = (color) => ({ fontSize: '10px', padding: '8px', borderRadius: '8px', background: '#000', borderLeft: '3px solid ' + color, color: '#888' });

export default AdminDashboard;
