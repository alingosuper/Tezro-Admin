import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { loadAIModels, matchFaces } from '../../utils/AIFaceMatcher';

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [aiResults, setAiResults] = useState({});

  useEffect(() => {
    // ماڈلز لوڈ کریں
    loadAIModels();

    const q = query(collection(db, "registrations"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // AI چیک کرنے کا فنکشن
  const checkAI = async (id, selfieUrl, cnicUrl) => {
    setAiResults(prev => ({ ...prev, [id]: { message: "🔄 AI چیک کر رہا ہے..." } }));
    const result = await matchFaces(selfieUrl, cnicUrl);
    setAiResults(prev => ({ ...prev, [id]: result }));
  };

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "registrations", id), { status: "approved", securityVerified: true });
    alert("✅ صارف منظور کر لیا گیا!");
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#041208' }}>
      <h2 style={{color: '#eab308'}}>🛡️ Tezro AI + Manual Verification</h2>
      
      {requests.map(req => (
        <div key={req.id} style={cardStyle}>
          <p><strong>Name:</strong> {req.name} ({req.category})</p>
          <p><strong>Phone:</strong> {req.phone}</p>
          
          {/* سیلفی اور شناختی کارڈ آمنے سامنے */}
          <div style={{ display: 'flex', gap: '15px', margin: '15px 0' }}>
            <img src={req.selfieUrl} alt="Selfie" style={imgStyle} />
            <img src={req.cnicFrontUrl} alt="CNIC" style={imgStyle} />
          </div>

          {/* AI رزلٹ */}
          <div style={aiStatusStyle}>
            {aiResults[req.id] ? (
              <p style={{ color: aiResults[req.id].safe ? '#4ade80' : '#f87171' }}>
                {aiResults[req.id].message}
              </p>
            ) : (
              <button onClick={() => checkAI(req.id, req.selfieUrl, req.cnicFrontUrl)} style={aiBtn}>
                AI سے تصدیق کریں 🤖
              </button>
            )}
          </div>

          {/* مینیول منظوری */}
          <button onClick={() => handleApprove(req.id)} style={approveBtn}>
            حتمی منظوری دیں (Manual)
          </button>
        </div>
      ))}
    </div>
  );
};

// سٹائلنگ
const cardStyle = { border: '1px solid #FFD700', padding: '20px', borderRadius: '15px', marginBottom: '20px', background: '#111' };
const imgStyle = { width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #333' };
const aiStatusStyle = { background: '#222', padding: '10px', borderRadius: '8px', margin: '10px 0', border: '1px dashed #FFD700' };
const aiBtn = { background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontWeight: 'bold' };
const approveBtn = { width: '100%', backgroundColor: '#FFD700', color: '#000', padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default RegistrationRequests;
