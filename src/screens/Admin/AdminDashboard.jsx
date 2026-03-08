import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEmail, setShowEmail] = useState(true);
  
  // 1. اسٹیٹس (جو اب فائر بیس سے کنٹرول ہوں گی)
  const [commissions, setCommissions] = useState({ RIDE: 0, FOOD: 0, SHOP: 0, HOTEL: 0 });
  const [fares, setFares] = useState({ base: 0, surge: 0 });
  const [loading, setLoading] = useState(true);

  const activeTheme = theme || { bg: '#1A0F0A', border: '#D4AF37', card: 'rgba(45,25,15,0.9)', text: '#F3E5AB' };

  // 2. فائر بیس سے لائیو ڈیٹا اٹھانا (Real-time Sync)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global_config"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCommissions(data.commissions || { RIDE: 15, FOOD: 10, SHOP: 5, HOTEL: 12 });
        setFares(data.fares || { base: 45, surge: 1.5 });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 3. ڈیٹا بیس میں سیو کرنے کا فنکشن
  const handleSave = async () => {
    try {
      const configRef = doc(db, "settings", "global_config");
      await updateDoc(configRef, { commissions, fares });
      alert("✅ ڈیٹا بیس میں تبدیلیاں محفوظ کر لی گئی ہیں!");
    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ سیونگ ناکام: فائر بیس رولز چیک کریں۔");
    }
  };

  if (loading) return <div style={{color: activeTheme.border, textAlign: 'center', marginTop: '50px'}}>Loading Command Center...</div>;

  return (
    <div style={{ ...styles.container, background: activeTheme.bg }}>
      
      {/* --- TOP BAR --- */}
      <div style={{ ...styles.topBar, borderBottom: `2px solid ${activeTheme.border}` }}>
        <h2 style={{ color: activeTheme.border, margin: 0 }}>🛡️ Tezro Master Control</h2>
        <div style={styles.headerActions}>
          <button style={styles.emergencyBtn}>SOS Mode</button>
          <button onClick={() => navigate('/')} style={styles.exitBtn}>Exit</button>
        </div>
      </div>

      {/* --- MENU TABS --- */}
      <div style={styles.tabContainer}>
        {[
          { id: 'Overview', icon: '📊', label: 'Overview' },
          { id: 'Users', icon: '👥', label: 'Performance' },
          { id: 'Finance', icon: '💰', label: 'Commission' },
          { id: 'Rides', icon: '🚗', label: 'Fare Control' },
          { id: 'Vendors', icon: '🏪', label: 'CMS' },
        ].map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.tab,
              borderColor: activeTab === item.id ? activeTheme.border : 'transparent',
              color: activeTab === item.id ? activeTheme.border : activeTheme.text,
              background: activeTab === item.id ? `${activeTheme.border}22` : 'transparent'
            }}>
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      {/* --- DYNAMIC CONTENT --- */}
      <div style={{ ...styles.contentArea, background: activeTheme.card, borderColor: activeTheme.border }}>
        {activeTab === 'Overview' && <OverviewStats theme={activeTheme} />}
        
        {activeTab === 'Users' && <UserPerformance theme={activeTheme} />}

        {activeTab === 'Finance' && (
          <CommissionControl 
            theme={activeTheme} 
            commissions={commissions} 
            setCommissions={setCommissions} 
            onSave={handleSave}
          />
        )}

        {activeTab === 'Rides' && (
          <RideControl 
            theme={activeTheme} 
            fares={fares} 
            setFares={setFares} 
            onSave={handleSave}
          />
        )}

        {activeTab === 'Vendors' && (
          <VendorControl theme={activeTheme} showEmail={showEmail} setShowEmail={setShowEmail} />
        )}
      </div>
    </div>
  );
};

// --- ذیلی اجزاء (Sub-components) بشمول آپ کے تمام ڈیزائن فیچرز ---

const CommissionControl = ({ theme, commissions, setCommissions, onSave }) => (
  <div>
    <h4 style={{ color: theme.border }}>Global Commission Settings (%)</h4>
    {Object.keys(commissions).map(key => (
      <div key={key} style={styles.listRow}>
        <span style={{ color: theme.text }}>{key} Commission</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" value={commissions[key]} 
            onChange={(e) => setCommissions({ ...commissions, [key]: Number(e.target.value) })}
            style={styles.input} />
          <span style={{ color: theme.border }}>%</span>
        </div>
      </div>
    ))}
    <button onClick={onSave} style={{ ...styles.actionBtnWide, marginTop: '20px' }}>Save Changes to Cloud</button>
  </div>
);

const RideControl = ({ theme, fares, setFares, onSave }) => (
  <div>
    <h4 style={{ color: theme.border }}>Ride Fare & Surge Logic</h4>
    <div style={styles.listRow}>
      <span style={{ color: theme.text }}>Base Fare (per KM)</span>
      <input type="number" value={fares.base} 
        onChange={(e) => setFares({...fares, base: Number(e.target.value)})}
        style={styles.input} />
    </div>
    <div style={styles.listRow}>
      <span style={{ color: theme.text }}>Surge Multiplier</span>
      <input type="number" step="0.1" value={fares.surge} 
        onChange={(e) => setFares({...fares, surge: Number(e.target.value)})}
        style={styles.input} />
    </div>
    <button onClick={onSave} style={{ ...styles.actionBtnWide, marginTop: '20px' }}>Update Global Fares</button>
  </div>
);

// (باقی تمام فنکشنز OverviewStats, UserPerformance, VendorControl اور Styles وہی رہیں گے جو آپ کے پاس پہلے تھے)
// میں نے انہیں یہاں آپ کے ڈیزائن کے مطابق برقرار رکھا ہے۔

const OverviewStats = ({ theme }) => (
  <div style={styles.grid}>
    {[
      { label: 'Admin Profit (Comm)', val: 'PKR 42,000', up: 'Today' },
      { label: 'Total Rides', val: '124', up: '+18%' },
      { label: 'Pending Payouts', val: 'PKR 18k', up: 'Urgent' },
      { label: 'System Load', val: '24%', up: 'Optimal' }
    ].map((s, i) => (
      <div key={i} style={{ ...styles.statBox, border: `1px solid ${theme.border}44` }}>
        <p style={{ color: theme.border, fontSize: '11px' }}>{s.label}</p>
        <h3 style={{ color: theme.text, margin: '5px 0' }}>{s.val}</h3>
        <span style={{ color: '#00ff00', fontSize: '10px' }}>{s.up}</span>
      </div>
    ))}
  </div>
);

const UserPerformance = ({ theme }) => {
  const users = [
    { name: 'Ali Ahmed', role: 'Rider', rating: '4.8', earnings: 'PKR 12,400', status: 'Active' },
    { name: 'Khan Sweets', role: 'Vendor', rating: '4.5', earnings: 'PKR 45,000', status: 'Warning' },
    { name: 'Zia Khan', role: 'Driver', rating: '3.2', earnings: 'PKR 2,100', status: 'Banned' },
  ];
  return (
    <div>
      <h4 style={{ color: theme.border }}>User & Vendor Performance</h4>
      <div style={styles.tableHeader}><span>Name</span><span>Rating</span><span>Earnings</span><span>Action</span></div>
      {users.map(u => (
        <div key={u.name} style={styles.listRow}>
          <div style={{ flex: 1 }}><span style={{ color: theme.text, display: 'block' }}>{u.name}</span><small style={{ color: theme.border, fontSize: '10px' }}>{u.role}</small></div>
          <span style={{ flex: 1, color: parseFloat(u.rating) < 4 ? 'red' : '#00ff00' }}>⭐ {u.rating}</span>
          <span style={{ flex: 1, color: theme.text }}>{u.earnings}</span>
          <div style={{ display: 'flex', gap: '5px' }}><button style={styles.miniBtnAction}>Details</button><button style={{ ...styles.miniBtnAction, color: u.status === 'Banned' ? 'green' : 'red' }}>{u.status === 'Banned' ? 'Unban' : 'Ban'}</button></div>
        </div>
      ))}
    </div>
  );
};

const VendorControl = ({ theme, showEmail, setShowEmail }) => (
  <div>
    <h4 style={{ color: theme.border }}>CMS & Support Control</h4>
    <button style={styles.actionBtnWide}>Edit App Banners</button>
    <div style={{ ...styles.emailToggleCard, border: `1px dashed ${theme.border}55` }}>
      <h5 style={{ color: theme.border, margin: '0 0 10px 0' }}>Support Email Visible?</h5>
      <button onClick={() => setShowEmail(!showEmail)} style={{ ...styles.toggleBtn, background: showEmail ? '#2ecc71' : '#e74c3c' }}>{showEmail ? 'ON (Visible)' : 'OFF (Hidden)'}</button>
    </div>
  </div>
);

const styles = {
  container: { minHeight: '100vh', padding: '15px', paddingTop: '80px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '15px' },
  emergencyBtn: { background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' },
  exitBtn: { background: 'transparent', color: 'white', border: '1px solid #444', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' },
  tabContainer: { display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '20px', paddingBottom: '10px' },
  tab: { padding: '10px 15px', borderRadius: '12px', border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '12px' },
  contentArea: { padding: '20px', borderRadius: '20px', border: '1px solid', minHeight: '400px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  statBox: { padding: '15px', borderRadius: '15px', textAlign: 'center', background: 'rgba(0,0,0,0.3)' },
  listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #333' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '2px solid #444', fontSize: '11px', color: '#888' },
  miniBtnAction: { background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' },
  actionBtnWide: { width: '100%', padding: '12px', background: '#D4AF37', border: 'none', color: '#000', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  input: { background: '#000', border: '1px solid #444', color: '#D4AF37', padding: '8px', borderRadius: '8px', width: '70px', textAlign: 'center' },
  emailToggleCard: { marginTop: '15px', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' },
  toggleBtn: { border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default AdminDashboard;
