import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
// اگر آپ کے پاس AuthGuard پہلے سے بنا ہوا ہے، تو اسے یہاں امپورٹ کریں
// import { useAuth } from './hooks/useAuth'; // یہ فرضی امپورٹ ہے

const AppShell = () => {
  // 🛡️ سیکیورٹی چیک (فرضی)
  // const { user, loading } = useAuth();
  // if (loading) return <div>🛡️ سیکیورٹی چیک ہو رہا ہے...</div>;
  // if (!user) return <Navigate to="/admin/login" />;

  return (
    <div style={layoutStyle}>
      {/* مستقل سائڈ بار (Right Side) */}
      <AdminSidebar />
      
      {/* متحرک کنٹینٹ (Left Side) */}
      <main style={mainContentStyle}>
        {/* 'Outlet' یہاں وہ اسکرین دکھائے گا جو آپ نے روٹر میں منتخب کی ہوگی */}
        <Outlet />
      </main>
    </div>
  );
};

// سٹائلز (RTL سپورٹ کے ساتھ)
const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#000', // Tezro بلیک تھیم
  direction: 'rtl', // اردو کے لیے دائیں سے بائیں
};

const mainContentStyle = {
  flex: 1, // باقی پوری جگہ لے لے
  marginRight: '260px', // سائڈ بار کے لیے جگہ چھوڑیں (AdminSidebar کی چوڑائی)
  padding: '30px', // مین کنٹینٹ کو تھوڑی جگہ دیں
  color: '#fff', // سفید ٹیکسٹ
  overflowY: 'auto', // اگر کنٹینٹ زیادہ ہو تو اسکرول ہو سکے
};

export default AppShell;
