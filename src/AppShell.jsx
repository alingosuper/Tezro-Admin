import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Globe, Smartphone, ShieldAlert, Settings, Menu, X } from 'lucide-react';

const AppShell = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={20}/> },
    { label: "Tezro Web Repo", path: "/web-monitor", icon: <Globe size={20}/> },
    { label: "Tezro App Repo", path: "/app-monitor", icon: <Smartphone size={20}/> },
    { label: "Security Engine", path: "/security", icon: <ShieldAlert size={20}/> },
    { label: "Settings", path: "/settings", icon: <Settings size={20}/> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020202', color: '#fff' }}>
      
      {/* Sidebar - مانیٹرنگ کنٹرولز */}
      {isSidebarOpen && (
        <aside style={{ width: '260px', borderRight: '1px solid #1a1a1a', padding: '20px', backgroundColor: '#050505' }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '40px', textAlign: 'center' }}>
            TEZRO COMMAND
          </div>
          <nav>
            {menuItems.map((item, index) => (
              <div 
                key={index}
                onClick={() => navigate(item.path)}
                style={navItemStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.icon}
                <span style={{ marginLeft: '15px' }}>{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header - ہیڈر جہاں سسٹمز کی مانیٹرنگ نظر آئے گی */}
        <header style={headerStyle}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={iconBtn}>
            {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={statusTag}>WEB: <span style={{color: '#00FF00'}}>● LIVE</span></div>
            <div style={statusTag}>APP: <span style={{color: '#00FF00'}}>● ACTIVE</span></div>
            <div style={statusTag}>SECURITY: <span style={{color: '#FFD700'}}>● ARMED</span></div>
          </div>

          <div style={{ cursor: 'pointer', border: '1px solid #FFD700', padding: '5px 15px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            ADMIN ACCESS
          </div>
        </header>

        {/* یہاں آپ کے تمام صفحات (Dashboard, Map, etc.) نظر آئیں گے */}
        <main style={{ padding: '25px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Styles
const navItemStyle = { display: 'flex', alignItems: 'center', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '8px', transition: '0.2s', color: '#888' };
const headerStyle = { height: '70px', borderBottom: '1px solid #1a1a1a', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' };
const iconBtn = { background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer' };
const statusTag = { fontSize: '0.75rem', color: '#555', backgroundColor: '#111', padding: '5px 12px', borderRadius: '15px', border: '1px solid #222' };

export default AppShell;
