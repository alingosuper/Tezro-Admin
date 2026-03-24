import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ریئل ٹائم لسنر - صرف پینڈنگ درخواستیں
    const q = query(
      collection(db, "registrations"), 
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      const userRef = doc(db, "registrations", id);
      await updateDoc(userRef, { 
        status: "approved",
        approvedAt: serverTimestamp(),
        message: "Welcome to Tezro! Your account is now active."
      });
      alert(`✅ ${name} has been approved successfully!`);
    } catch (error) {
      alert("❌ Error approving user: " + error.message);
    }
  };

  if (loading) return <div style={{color: '#eab308', textAlign: 'center', marginTop: '50px'}}>Loading Requests...</div>;

  return (
    <div style={{ padding: '25px', color: 'white', backgroundColor: '#041208', minHeight: '100vh' }}>
      <h2 style={{ borderBottom: '2px solid #eab308', paddingBottom: '10px', color: '#eab308' }}>
        🛡️ Tezro Admin: Registration Requests
      </h2>
      
      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>No pending requests found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {requests.map(req => (
            <div key={req.id} style={{ 
              background: 'rgba(234, 179, 8, 0.05)', 
              border: '1px solid rgba(234, 179, 8, 0.3)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img src={req.photoUrl || 'https://via.placeholder.com/100'} alt="Profile" 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #eab308' }} 
                />
                <div>
                  <h3 style={{ margin: '0', color: '#eab308' }}>{req.name}</h3>
                  <span style={{ fontSize: '12px', background: '#eab308', color: 'black', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {req.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '15px', fontSize: '14px', color: '#ccc' }}>
                <p style={{ margin: '5px 0' }}>📍 <strong>City:</strong> {req.city}</p>
                <p style={{ margin: '5px 0' }}>📞 <strong>Phone:</strong> {req.phone || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}>📅 <strong>Applied:</strong> {req.createdAt?.toDate().toLocaleDateString() || 'Recent'}</p>
              </div>

              <button 
                onClick={() => handleApprove(req.id, req.name)}
                style={{ 
                  width: '100%', 
                  backgroundColor: '#eab308', 
                  color: 'black', 
                  padding: '12px', 
                  border: 'none', 
                  borderRadius: '8px', 
                  marginTop: '15px', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.8'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                APPROVE ACCESS
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationRequests;
