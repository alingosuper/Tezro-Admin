import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Security Check, 3: Success
  const [creds, setCreds] = useState({ email: '', pass: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🌍 45km Geo-Fence Check (Faisalabad Center Example)
  const checkLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const center = { lat: 31.4504, lng: 73.1350 }; // فیصل آباد سینٹر
        const R = 6371; // زمین کا رداس
        const dLat = (pos.coords.latitude - center.lat) * Math.PI / 180;
        const dLon = (pos.coords.longitude - center.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(center.lat * Math.PI / 180) * Math.cos(pos.coords.latitude * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        resolve(distance <= 45); // اگر 45 کلومیٹر کے اندر ہے تو true
      }, () => resolve(false));
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Step 1: Geo-Fence Check
    const isInside = await checkLocation();
    if (!isInside) {
      setError("❌ سیکیورٹی الرٹ: آپ مخصوص لوکیشن (45km) سے باہر ہیں۔ رسائی ممنوع ہے!");
      setLoading(false);
      return;
    }

    try {
      // Step 2: Firebase Auth
      await signInWithEmailAndPassword(auth, creds.email, creds.pass);
      setStep(2); // سیکیورٹی پن اور فیس لاک پر جائیں
    } catch (err) {
      setError("غلط ای میل یا پاس ورڈ!");
    }
    setLoading(false);
  };

  const finalVerify = () => {
    if (creds.pin === "4545") { // آپ کا سیکیورٹی پن
      navigate('/admin/dashboard');
    } else {
      setError("غلط سیکیورٹی پن!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginBox}>
        <h2 style={{color: '#FFD700'}}>🛡️ Tezro Security Login</h2>
        <p style={{fontSize: '10px', color: '#888'}}>Location-Locked | Encrypted</p>
        
        {error && <div style={errorStyle}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="ایڈمن ای میل" onChange={e => setCreds({...creds, email: e.target.value})} style={inputStyle} required />
            <input type="password" placeholder="پاس ورڈ" onChange={e => setCreds({...creds, pass: e.target.value})} style={inputStyle} required />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Checking Location..." : "Verify Identity"}
            </button>
          </form>
        ) : (
          <div>
            <p style={{color: '#00ff00'}}>✅ لوکیشن کنفرم! اب پن کوڈ درج کریں:</p>
            <input type="password" placeholder="4-Digit Security PIN" onChange={e => setCreds({...creds, pin: e.target.value})} style={inputStyle} maxLength="4" />
            <button onClick={finalVerify} style={btnStyle}>Unlock Dashboard 🔓</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = { background: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const loginBox = { background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #FFD700', width: '90%', maxWidth: '350px', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px' };
const btnStyle = { width: '100%', padding: '15px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const errorStyle = { color: '#ff4444', fontSize: '12px', marginBottom: '10px', background: 'rgba(255,0,0,0.1)', padding: '5px' };

export default AdminLogin;
