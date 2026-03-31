import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';

const AppShell = () => {
  return (
    <div style={layoutStyle}>
      {/* مستقل سائڈ بار (Right Side) */}
      <AdminSidebar />

      {/* متحرک کنٹینٹ (Left Side) */}
      <main style={mainContentStyle}>
        <Outlet />
      </main>
    </div>
  );
};

// سٹائلز (Tezro Premium Dark Theme)
const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#0a0a0a', 
  direction: 'rtl', 
};

const mainContentStyle = {
  flex: 1,
  marginRight: '260px', 
  padding: '40px',
  color: '#fff',
  overflowY: 'auto',
};

export default AppShell;
