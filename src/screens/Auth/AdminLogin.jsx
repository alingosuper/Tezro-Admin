import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ہم نے راستہ ٹھیک کر دیا ہے (src/firebase.js کی طرف)
import { auth, signInWithGoogle } from '../../firebase'; 

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#FFD700', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>TEZRO ADMIN ACCESS</h1>
      <button 
        onClick={handleLogin}
        style={{ backgroundColor: '#FFD700', color: '#000', padding: '15px 30px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default AdminLogin;
