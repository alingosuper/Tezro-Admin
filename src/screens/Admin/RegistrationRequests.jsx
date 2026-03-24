import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "registrations"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (id, newStatus) => {
    await updateDoc(doc(db, "registrations", id), { status: newStatus });
    alert(`Account ${newStatus} Successfully!`);
  };

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ color: '#FFD700', borderBottom: '2px solid #FFD700' }}>🛡️ سیکیورٹی آڈٹ پینل</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {requests.map(req => (
          <div key={req.id} style={cardStyle}>
            <h3 style={{color: '#FFD700'}}>{req.name} ({req.category})</h3>
            <p>CNIC: {req.cnicNumber}</p>
            <p>Phone: {req.phone}</p>
            
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              <div style={{flex: 1}}>
                <span style={labelStyle}>سیلفی</span>
                <img src={req.selfieUrl} style={imgStyle} alt="Selfie" />
              </div>
              <div style={{flex: 1}}>
                <span style={labelStyle}>شناختی کارڈ</span>
                <img src={req.cnicFrontUrl} style={imgStyle} alt="CNIC" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleAction(req.id, 'approved')} style={approveBtn}>Approve ✅</button>
              <button onClick={() => handleAction(req.id, 'rejected')} style={rejectBtn}>Reject ❌</button>
            </div>
          </div>
        ))}
      </div>
      {requests.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>کوئی نئی درخواست موجود نہیں ہے۔</p>}
    </div>
  );
};

const cardStyle = { background: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #333' };
const imgStyle = { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #FFD700' };
const labelStyle = { fontSize: '10px', display: 'block', marginBottom: '5px', color: '#888' };
const approveBtn = { flex: 1, padding: '10px', background: '#28a745', border: 'none', color: '#fff', borderRadius: '5px', cursor: 'pointer' };
const rejectBtn = { flex: 1, padding: '10px', background: '#dc3545', border: 'none', color: '#fff', borderRadius: '5px', cursor: 'pointer' };

export default RegistrationRequests;
