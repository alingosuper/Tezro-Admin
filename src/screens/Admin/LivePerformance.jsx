import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';

// کسٹم مارکر آئیکن (ڈرائیور کے لیے)
const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854184.png',
    iconSize: [35, 35],
});

const LivePerformance = () => {
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [isShieldActive, setIsShieldActive] = useState(true);

  useEffect(() => {
    // 🛡️ سیکیورٹی ڈیلے (ڈیٹا لوڈ کرنے سے پہلے ایک چیک)
    const timer = setTimeout(() => setIsShieldActive(false), 1500);

    // فائر بیس سے لائیو لوکیشنز لینا
    const unsubscribe = onSnapshot(collection(db, "live_locations"), (snapshot) => {
      const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveDrivers(locations);
    });

    return () => {
        clearTimeout(timer);
        unsubscribe();
    };
  }, []);

  if (isShieldActive) {
    return (
      <div style={loaderStyle}>
        <div className="spinner"></div>
        <h2 style={{ color: '#FFD700', marginTop: '20px' }}>سیکیورٹی نیٹ ورک سے منسلک ہو رہا ہے...</h2>
      </div>
    );
  }

  return (
    <div style={{ height: '85vh', borderRadius: '20px', overflow: 'hidden', border: '2px solid #222' }}>
      <div style={mapHeader}>
        <h3 style={{ margin: 0 }}>لائیو ٹریکنگ: {activeDrivers.length} فعال ڈرائیورز</h3>
        <span style={statusPulse}>لائیو ڈیٹا 📡</span>
      </div>

      <MapContainer center={[31.4504, 73.1350]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; Tezro Security Maps'
        />
        
        {activeDrivers.map((driver) => (
          <Marker 
            key={driver.id} 
            position={[driver.lat, driver.lng]} 
            icon={driverIcon}
          >
            <Popup>
              <div style={{ direction: 'rtl', textAlign: 'right' }}>
                <strong style={{ color: '#d4af37' }}>ڈرائیور: {driver.name}</strong><br />
                اسٹیٹس: {driver.isOnline ? 'آن لائن ✅' : 'آف لائن ❌'}<br />
                بیٹری: {driver.batteryLevel}%
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Styles
const loaderStyle = { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000' };
const mapHeader = { background: '#111', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFD700', borderBottom: '1px solid #333' };
const statusPulse = { fontSize: '12px', background: '#003300', color: '#00ff00', padding: '4px 12px', borderRadius: '15px', border: '1px solid #00ff00' };

export default LivePerformance;
