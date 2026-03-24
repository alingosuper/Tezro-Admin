import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', background: '#000', minHeight: '100vh', direction: 'rtl' }}>
      <AdminSidebar />
      
      <div style={{ marginRight: '260px', flex: 1, padding: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#FFD700' }}>سسٹم اسٹیٹس (Stats)</h1>
          <div style={statusBadge}>سسٹم لائیو 🟢</div>
        </header>

        {/* فوری اعداد و شمار (Stats Cards) */}
        <div style={statsGrid}>
          <div style={statCard}><h3>کل صارفین</h3><p>1,240</p></div>
          <div style={statCard}><h3>نئی رجسٹریشنز</h3><p style={{color: '#FFD700'}}>12</p></div>
          <div style={statCard}><h3>فعال رائیڈز</h3><p>45</p></div>
          <div style={statCard}><h3>آج کی آمدنی</h3><p>Rs. 24,500</p></div>
        </div>

        <div style={infoBox}>
          <h2 style={{ color: '#FFD700' }}>AI الرٹس 🤖</h2>
          <p>تمام سیکیورٹی شیلڈز نارمل کام کر رہی ہیں۔ 12 نئی رجسٹریشنز تصدیق کی منتظر ہیں۔</p>
        </div>
      </div>
    </div>
  );
};

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' };
const statCard = { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', textAlign: 'center', color: '#fff' };
const statusBadge = { background: '#002200', color: '#00ff00', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', border: '1px solid #00ff00' };
const infoBox = { marginTop: '40px', padding: '25px', background: '#0a0a0a', borderRadius: '20px', border: '1px dashed #FFD700', color: '#ccc' };

export default AdminDashboard;
