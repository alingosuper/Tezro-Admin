import React from 'react';

const LivePerformance = () => {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <h1 style={{ color: '#D4AF37', fontWeight: '300', marginBottom: '25px', fontSize: '22px', textAlign: 'right' }}>لائیو مانیٹرنگ (Maps)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={pulseBoxStyle}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
             <span style={{color: '#44ff44'}}>● System Normal</span>
             <h3 style={{color: '#D4AF37', margin: 0, fontSize: '16px'}}>Global Traffic</h3>
          </div>
          <div style={{fontSize: '32px', color: '#fff', fontWeight: 'bold', margin: '15px 0', textAlign: 'right'}}>1.2 GB/s</div>
        </div>
        
        <div style={pulseBoxStyle}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
             <span style={{color: '#D4AF37'}}>🛡️ Encrypted</span>
             <h3 style={{color: '#D4AF37', margin: 0, fontSize: '16px'}}>Security Shield</h3>
          </div>
          <div style={{fontSize: '32px', color: '#fff', fontWeight: 'bold', margin: '15px 0', textAlign: 'right'}}>ACTIVE</div>
        </div>
      </div>

      <div style={{marginTop: '20px', background: '#0a0a0a', padding: '30px', borderRadius: '15px', border: '1px solid #1a1a1a', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
         <p style={{color: '#444', fontSize: '12px'}}>[ Real-time Graph Placeholder - Elite Graphics Coming Soon... ]</p>
         <div style={{height: '120px', borderBottom: '1px solid #D4AF37', margin: '20px 0', opacity: 0.2}}></div>
      </div>
    </div>
  );
};

const pulseBoxStyle = {
  background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(10px)',
  padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
};

export default LivePerformance;
