import React from 'react';

const RegistrationRequests = () => {
  const requests = [
    { id: 1, name: "Ahmed Khan", type: "Premium", status: "Pending", date: "2026-04-01" },
    { id: 2, name: "Sara Ali", type: "Standard", status: "Pending", date: "2026-03-31" },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <h1 style={{ color: '#D4AF37', fontWeight: '300', marginBottom: '25px', fontSize: '22px', textAlign: 'right' }}>رجسٹریشن ریکویسٹ (AI)</h1>
      
      <div style={{ background: '#0a0a0a', borderRadius: '15px', border: '1px solid #1a1a1a', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#aaa', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#111', color: '#D4AF37', textAlign: 'right' }}>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>User</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #111', textAlign: 'right' }}>
                <td style={tdStyle}>
                  <button style={actionBtnStyle}>APPROVE</button>
                </td>
                <td style={tdStyle}>{req.date}</td>
                <td style={tdStyle}><span style={{color: req.type === 'Premium' ? '#D4AF37' : '#aaa'}}>{req.type}</span></td>
                <td style={tdStyle}><b style={{color: '#fff'}}>{req.name}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = { padding: '15px', fontWeight: '500', borderBottom: '1px solid #1a1a1a' };
const tdStyle = { padding: '15px' };
const actionBtnStyle = {
  background: 'linear-gradient(45deg, #D4AF37 0%, #F5D76E 100%)', border: 'none', color: '#000',
  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px',
  boxShadow: '0 2px 5px rgba(212,175,55,0.2)'
};

export default RegistrationRequests;
