import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import LivePerformance from './LivePerformance';

const AdminDashboard = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  const [commissions, setCommissions] = useState({ RIDE: 0, FOOD: 0, SHOP: 0 });
  const [fares, setFares] = useState({ base: 0, surge: 1.0 });
  const [systemStatus, setSystemStatus] = useState({ website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [stats, setStats] = useState({ totalRevenue: 0, activeDrivers: 0 });

  const activeTheme = colors || { bg: '#000', border: '#D4AF37', card: 'rgba(15,15,15,0.98)', text: '#F3E5AB' };

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "global_config"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCommissions(data.commissions || { RIDE: 0, FOOD: 0, SHOP: 0 });
        setFares(data.fares || { base: 0, surge: 1.0 });
        setSystemStatus(data.systemStatus || { website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
      }
      setLoading(false);
    });

    const unsubRequests = onSnapshot(query(collection(db, "businesses"), where("status", "==", "PENDING_VERIFICATION")), (snap) => {
      setPendingApprovals(snap.size);
    });

    const unsubStats = onSnapshot(doc(db, "stats", "today"), (doc) => {
      if (doc.exists()) setStats(doc.data());
    });

    return () => { unsubConfig(); unsubRequests(); unsubStats(); };
  }, []);

  const toggleSystemPanic = async (platform) => {
    const current = systemStatus[platform];
    const newStatus = current === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE';
    if (window.confirm(`⚠️ ACTIVATE ${newStatus} FOR ${platform.toUpperCase()}?`)) {
      try {
        await updateDoc(doc(db, "settings", "global_config"), { [`systemStatus.${platform}`]: newStatus });
      } catch (err) { alert("Access Denied"); }
    }
  };

  if (loading) return <div style={styles.loader}>SECURE CORE INITIALIZING...</div>;

  return (
    <div style={{ ...styles.container, background: activeTheme.bg }}>
      <div style={{ ...styles.topBar, borderBottom: `1px solid ${activeTheme.border}22` }}>
        <div>
          <h2 style={{ color: activeTheme.border, letterSpacing: '2px', fontSize: '16px', margin: 0 }}>CORE COMMAND</h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
             <StatusPill label="WEB" status={systemStatus.website} />
             <StatusPill label="APP" status={systemStatus.mobileApp} />
          </div>
        </div>
        <button onClick={() => toggleSystemPanic('mobileApp')} style={styles.emergencyBtn}>
          {systemStatus.mobileApp === 'ONLINE' ? '🚨 SOS LOCK' : '🔓 UNLOCK'}
        </button>
      </div>

      <div style={styles.tabContainer}>
        {[
          { id: 'Overview', icon: '📊', label: 'Monitor' },
          { id: 'Approvals', icon: '🛡️', label: `Reviews (${pendingApprovals})` },
          { id: 'Control', icon: '⚙️', label: 'Global Rules' },
        ].map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.tab,
              borderColor: activeTab === item.id ? activeTheme.border : '#1A1A1A',
              color: activeTab === item.id ? activeTheme.border : '#555',
              background: activeTab === item.id ? `${activeTheme.border}11` : 'transparent'
            }}>
            {item.icon} <span style={{marginLeft: '6px'}}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ ...styles.contentArea, background: activeTheme.card, borderColor: `${activeTheme.border}11` }}>
        {activeTab === 'Overview' && <LivePerformance theme={activeTheme} stats={stats} />}
        
        {activeTab === 'Approvals' && (
          <div style={styles.fadeAnim}>
            <h3 style={{color: activeTheme.border}}>System Security Reviews</h3>
            <div style={styles.placeholderCard}>Waiting for Encrypted Data...</div>
          </div>
        )}

        {activeTab === 'Control' && (
          <GlobalRulesControl 
            theme={activeTheme} 
            commissions={commissions} 
            setCommissions={setCommissions}
            fares={fares}
            setFares={setFares}
            onSave={async () => {
              await updateDoc(doc(db, "settings", "global_config"), { commissions, fares });
              alert("RULES UPDATED");
            }}
          />
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const GlobalRulesControl = ({ theme, commissions, setCommissions, fares, setFares, onSave }) => (
  <div style={styles.fadeAnim}>
    <h4 style={{color: theme.border, marginBottom: '20px'}}>Pricing Engine</h4>
    <div style={styles.controlGrid}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Ride Fee (%)</label>
        <input type="number" value={commissions.RIDE} onChange={e=>setCommissions({...commissions, RIDE: e.target.value})} style={styles.masterInput} />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Base Rate (PKR)</label>
        <input type="number" value={fares.base} onChange={e=>setFares({...fares, base: e.target.value})} style={styles.masterInput} />
      </div>
    </div>
    <button onClick={onSave} style={styles.masterBtn}>SYNC TO CLOUD</button>
  </div>
);

const StatusPill = ({ label, status }) => (
  <span style={{ fontSize: '8px', fontWeight: 'bold', color: status === 'ONLINE' ? '#22C55E' : '#EF4444', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: '8px', border: `1px solid ${status === 'ONLINE' ? '#22C55E44' : '#EF444444'}` }}>
    ● {label}: {status}
  </span>
);

const styles = {
  container: { minHeight: '100vh', padding: '15px' },
  loader: { color: '#D4AF37', textAlign: 'center', marginTop: '45vh', fontWeight: 'bold', letterSpacing: '2px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', marginBottom: '15px' },
  emergencyBtn: { background: '#7F1D1D', color: '#FECACA', border: '1px solid #B91C1C', padding: '8px 15px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold' },
  tabContainer: { display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' },
  tab: { padding: '12px 20px', borderRadius: '15px', border: '1px solid', fontSize: '11px', fontWeight: 'bold', transition: '0.3s' },
  contentArea: { padding: '20px', borderRadius: '25px', border: '1px solid', minHeight: '400px' },
  controlGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  masterInput: { width: '100%', background: '#050505', border: '1px solid #222', color: '#D4AF37', padding: '15px', borderRadius: '12px', marginTop: '5px' },
  masterBtn: { width: '100%', background: '#D4AF37', color: 'black', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: 'bold', marginTop: '20px' },
  label: { fontSize: '10px', color: '#666' },
  placeholderCard: { padding: '40px', textAlign: 'center', background: '#0A0A0A', borderRadius: '20px', border: '1px dashed #222', color: '#444' },
  fadeAnim: { animation: 'fadeIn 0.5s ease-in' }
};

export default AdminDashboard;
