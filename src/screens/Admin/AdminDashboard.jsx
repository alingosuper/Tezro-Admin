import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore";

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  
  // مرکزی کنٹرول سٹیٹس
  const [commissions, setCommissions] = useState({ RIDE: 0, FOOD: 0, SHOP: 0 });
  const [fares, setFares] = useState({ base: 0, surge: 1.0 });
  const [systemStatus, setSystemStatus] = useState({ website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
  const [pendingApprovals, setPendingApprovals] = useState(0);

  const activeTheme = theme || { bg: '#000', border: '#D4AF37', card: 'rgba(15,15,15,0.98)', text: '#F3E5AB' };

  // لائیو سنکرونائزیشن (Security First)
  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "global_config"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCommissions(data.commissions);
        setFares(data.fares);
        setSystemStatus(data.systemStatus || { website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
      }
      setLoading(false);
    });

    const unsubRequests = onSnapshot(query(collection(db, "businesses"), where("status", "==", "PENDING_VERIFICATION")), (snap) => {
      setPendingApprovals(snap.size);
    });

    return () => { unsubConfig(); unsubRequests(); };
  }, []);

  // ایمرجنسی لاک لاجک (SOS)
  const toggleSystemPanic = async (platform) => {
    const isLocked = systemStatus[platform] === 'MAINTENANCE';
    const newStatus = isLocked ? 'ONLINE' : 'MAINTENANCE';
    
    if (window.confirm(`⚠️ کیا آپ واقعی ${platform} کو ${newStatus} کرنا چاہتے ہیں؟`)) {
      await updateDoc(doc(db, "settings", "global_config"), { [`systemStatus.${platform}`]: newStatus });
    }
  };

  if (loading) return <div style={styles.loader}>INITIALIZING MASTER REPOSITORY...</div>;

  return (
    <div style={{ ...styles.container, background: activeTheme.bg }}>
      
      {/* 📡 Master Status Header */}
      <div style={{ ...styles.topBar, borderBottom: `1px solid ${activeTheme.border}22` }}>
        <div>
          <h2 style={{ color: activeTheme.border, letterSpacing: '2px', fontSize: '16px' }}>CORE COMMAND</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
             <StatusPill label="APP" status={systemStatus.mobileApp} />
             <StatusPill label="VAULT" status={systemStatus.vault} />
          </div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => toggleSystemPanic('mobileApp')} style={styles.emergencyBtn}>
            {systemStatus.mobileApp === 'ONLINE' ? '🚨 SOS LOCK' : '🔓 UNLOCK APP'}
          </button>
        </div>
      </div>

      {/* 🧭 Tactical Navigation */}
      <div style={styles.tabContainer}>
        {[
          { id: 'Overview', icon: '📊', label: 'Overview' },
          { id: 'Inventory', icon: '📦', label: 'Monitor Products' },
          { id: 'Approvals', icon: '🛡️', label: `Verifications (${pendingApprovals})` },
          { id: 'Control', icon: '⚙️', label: 'Global Rules' },
        ].map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.tab,
              borderColor: activeTab === item.id ? activeTheme.border : '#1A1A1A',
              color: activeTab === item.id ? activeTheme.border : '#555',
              background: activeTab === item.id ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
            }}>
            {item.icon} <span style={{marginLeft: '6px'}}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* 🖼️ Content Engine */}
      <div style={{ ...styles.contentArea, background: activeTheme.card, borderColor: `${activeTheme.border}11` }}>
        {activeTab === 'Overview' && <LivePerformance theme={activeTheme} />}
        
        {activeTab === 'Inventory' && (
          <div className="security-inventory-audit">
             <InventoryManager theme={activeTheme} /> 
             <p style={styles.auditNote}>⚠️ نوٹ: یہ فارم صرف ٹیسٹنگ کے لیے ہے۔ اصل ڈیٹا وینڈر پورٹل سے آئے گا۔</p>
          </div>
        )}
        
        {activeTab === 'Approvals' && <PendingVerifications theme={activeTheme} />}

        {activeTab === 'Control' && (
          <GlobalControl 
            theme={activeTheme} 
            commissions={commissions} 
            setCommissions={setCommissions} 
            fares={fares} 
            setFares={setFares}
            onSave={async () => {
              await updateDoc(doc(db, "settings", "global_config"), { commissions, fares });
              alert("🚀 GLOBAL SYNC COMPLETED");
            }}
          />
        )}
      </div>
    </div>
  );
};

// --- STYLES (Mobile-First & Secure) ---

const styles = {
  container: { minHeight: '100vh', padding: '12px', fontFamily: 'Inter, sans-serif' },
  loader: { color: '#D4AF37', textAlign: 'center', marginTop: '40vh', fontWeight: '900', letterSpacing: '3px', fontSize: '12px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' },
  headerActions: { display: 'flex', gap: '10px' },
  emergencyBtn: { background: '#7F1D1D', color: '#FECACA', border: '1px solid #B91C1C', padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  tabContainer: { display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '15px', paddingBottom: '10px' },
  tab: { padding: '12px 18px', borderRadius: '15px', border: '1px solid', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', cursor: 'pointer', transition: '0.3s' },
  contentArea: { padding: '20px', borderRadius: '30px', border: '1px solid', minHeight: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  masterInput: { width: '100%', background: '#000', border: '1px solid #1A1A1A', color: '#D4AF37', padding: '15px', borderRadius: '15px', marginBottom: '12px', fontSize: '13px' },
  masterBtn: { width: '100%', background: '#D4AF37', color: 'black', border: 'none', padding: '16px', borderRadius: '15px', fontWeight: '900', letterSpacing: '1px', cursor: 'pointer' },
  auditNote: { textAlign: 'center', fontSize: '9px', color: '#444', marginTop: '20px', letterSpacing: '1px' },
  statBox: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid #111' }
};

const StatusPill = ({ label, status }) => (
  <span style={{ fontSize: '8px', fontWeight: 'bold', color: status === 'ONLINE' ? '#22C55E' : '#EF4444', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '8px', border: `1px solid ${status === 'ONLINE' ? '#22C55E33' : '#EF444433'}` }}>
    ● {label}: {status}
  </span>
);

export default AdminDashboard;
