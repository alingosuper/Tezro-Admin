import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🛡️ Error Boundary Simple Implementation
const WarRoom = () => {
  const [isLive, setIsLive] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, msg: "Suspicious Login: Node-07", level: "High" },
    { id: 2, msg: "Route Diverted: Rider TZ-88", level: "Mid" }
  ]);

  // 🔥 Optimized Marker Icon (Prevents re-rendering)
  const goldIcon = useMemo(() => new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    iconSize: [25, 41], iconAnchor: [12, 41],
  }), []);

  return (
    <div style={warRoomContainer}>
      {/* 📊 Top Stats Strip - Lightweight */}
      <div style={statsStrip}>
        <div style={statBox}>ACTIVE RIDES: <span style={goldText}>142</span></div>
        <div style={statBox}>SYSTEM LOAD: <span style={{color: '#44ff44'}}>12%</span></div>
        <div style={statBox}>ENCRYPTION: <span style={goldText}>AES-256</span></div>
        <button onClick={() => setIsLive(!isLive)} style={liveBtn(isLive)}>
          {isLive ? "● LIVE FEED" : "○ FEED PAUSED"}
        </button>
      </div>

      <div style={mainGrid}>
        {/* 🗺️ Heavy Map Area (Isolated) */}
        <div style={mapSection}>
          <MapContainer center={[31.5204, 74.3587]} zoom={13} style={{ height: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <Marker position={[31.5204, 74.3587]} icon={goldIcon} />
            <Circle center={[31.5300, 74.3500]} radius={1000} pathOptions={{ color: '#D4AF37', fillOpacity: 0.05 }} />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        {/* 🚨 Real-time Security Intelligence */}
        <div style={intelSection}>
          <div style={intelHeader}>SECURITY INTELLIGENCE</div>
          <div style={logContainer}>
            {alerts.map(alert => (
              <div key={alert.id} style={logEntry}>
                <span style={{color: alert.level === 'High' ? '#ff4444' : '#D4AF37'}}>⚠ {alert.level}:</span> {alert.msg}
              </div>
            ))}
          </div>
          <button style={scanBtn}>DEEP SCAN SYSTEM</button>
        </div>
      </div>
    </div>
  );
};

// 💅 High-Performance CSS-in-JS
const warRoomContainer = { height: '100%', display: 'flex', flexDirection: 'column', background: '#000' };
const statsStrip = { display: 'flex', gap: '20px', padding: '10px 20px', background: '#050505', borderBottom: '1px solid #D4AF3722', overflowX: 'auto' };
const statBox = { fontSize: '10px', color: '#888', letterSpacing: '1px', whiteSpace: 'nowrap' };
const goldText = { color: '#D4AF37', fontWeight: 'bold' };
const liveBtn = (isLive) => ({ background: 'none', border: '1px solid ' + (isLive ? '#44ff44' : '#555'), color: isLive ? '#44ff44' : '#555', padding: '2px 10px', borderRadius: '10px', fontSize: '9px', cursor: 'pointer', marginLeft: 'auto' });
const mainGrid = { flex: 1, display: 'flex', flexWrap: 'wrap' };
const mapSection = { flex: 2, minWidth: '300px', height: '100%', position: 'relative' };
const intelSection = { flex: 1, minWidth: '250px', background: '#050505', borderLeft: '1px solid #D4AF3722', display: 'flex', flexDirection: 'column' };
const intelHeader = { padding: '15px', fontSize: '12px', color: '#D4AF37', borderBottom: '1px solid #D4AF3722', textAlign: 'center', fontWeight: 'bold' };
const logContainer = { flex: 1, padding: '15px', overflowY: 'auto' };
const logEntry = { fontSize: '11px', color: '#aaa', padding: '8px', borderBottom: '1px solid #111', fontFamily: 'monospace' };
const scanBtn = { margin: '15px', background: 'linear-gradient(135deg, #D4AF37 0%, #000 100%)', color: '#000', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '10px' };

export default WarRoom;
