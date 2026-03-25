import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as faceapi from 'face-api.js';
import { loadModels, compareFaces } from '../../utils/AIFaceMatcher';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Geo-Location, 2: PIN, 3: Face ID
  const [creds, setCreds] = useState({ email: '', pass: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [adminDescriptor, setAdminDescriptor] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // 🌍 45km Geo-Fence Faisalabad Center
  const checkLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const center = { lat: 31.4504, lng: 73.1350 }; 
        const R = 6371; // زمین کا رداس (km)
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

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Camera access error:", err));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (step === 3 && videoRef.current) {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor();
        
        if (detections) {
          setFaceDescriptor(detections.descriptor);
          console.log("Face Descriptor:", detections.descriptor);
        }
      }
    }, 100);
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
      setStep(3);
      startVideo();
    } else {
      setError("غلط سیکیورٹی پن!");
    }
  };

  const verifyFace = async () => {
    setLoading(true);
    setError('');

    if (faceDescriptor && adminDescriptor) {
      const distance = faceapi.euclideanDistance(faceDescriptor, adminDescriptor);
      const matchPercentage = Math.round((1 - distance) * 100);
      
      if (matchPercentage > 85) {
        navigate('/admin/dashboard');
      } else {
        setError("❌ سیکیورٹی الرٹ: چہرہ میچ نہیں ہوا۔ رسائی ممنوع ہے!");
      }
    } else {
      setError("کیمرے میں چہرہ صحیح طرح نظر نہیں آ رہا!");
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadFaceModels = async () => {
      try {
        await loadModels(); // AI ماڈلز لوڈ کریں
      } catch (error) {
        console.error("AI Models load error:", error);
      }
    };
    loadFaceModels();

    const fetchAdminDescriptor = async () => {
      const docRef = doc(db, 'registrations', 'faisalabad_admin');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdminDescriptor(new Float32Array(Object.values(docSnap.data().face_data)));
      }
    };
    fetchAdminDescriptor();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={loginBox}>
        <h2 style={{color: '#FFD700'}}>🛡️ Tezro Security Login</h2>
        <p style={{fontSize: '10px', color: '#888'}}>Location-Locked | PIN | Face ID | Encrypted</p>
        
        {error && <div style={errorStyle}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="ایڈمن ای میل" onChange={e => setCreds({...creds, email: e.target.value})} style={inputStyle} required />
            <input type="password" placeholder="پاس ورڈ" onChange={e => setCreds({...creds, pass: e.target.value})} style={inputStyle} required />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Checking Location..." : "Verify Identity"}
            </button>
          </form>
        ) : step === 2 ? (
          <div>
            <p style={{color: '#00ff00'}}>✅ لوکیشن کنفرم! اب پن کوڈ درج کریں:</p>
            <input type="password" placeholder="4-Digit Security PIN" onChange={e => setCreds({...creds, pin: e.target.value})} style={inputStyle} maxLength="4" />
            <button onClick={finalVerify} style={btnStyle}>Unlock PIN 🔓</button>
          </div>
        ) : (
          <div>
            <p style={{color: '#00ff00'}}>✅ لوکیشن اور پن کوڈ کنفرم! اب چہرہ تصدیق کریں:</p>
            <video ref={videoRef} onPlay={handleVideoOnPlay} autoPlay muted style={videoStyle} />
            <canvas ref={canvasRef} style={canvasStyle} />
            <button onClick={verifyFace} disabled={loading} style={btnStyle}>
              {loading ? "AI Checking..." : "Verify Face ID 🛡️"}
            </button>
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
const videoStyle = { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #FFD700', objectFit: 'cover' };
const canvasStyle = { position: 'absolute', top: '10px', left: '10px' };

export default AdminLogin;
