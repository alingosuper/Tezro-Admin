import React, { useState } from 'react';
import { auth, db } from '../../firebase/config'; // درست شدہ پاتھ
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ theme }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !pass) return alert("تمام خانے پُر کریں");
        
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // سیکیورٹی چیک: کیا یہ واقعی ایڈمن ہے؟
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                localStorage.setItem("admin_token", user.accessToken); // سیشن سیو
                navigate('/admin-dashboard');
            } else {
                await signOut(auth);
                alert("رسائی مسترد! آپ ایڈمن نہیں ہیں۔");
            }
        } catch (error) {
            alert("لاگ ان ناکام: ای میل یا پاسورڈ غلط ہے۔");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginCard}>
                <h2 style={{color: '#D4AF37'}}>🛡️ Tezro Admin Portal</h2>
                <input 
                    type="email" placeholder="Admin Email" 
                    onChange={(e) => setEmail(e.target.value)} style={styles.input}
                />
                <input 
                    type="password" placeholder="Password" 
                    onChange={(e) => setPass(e.target.value)} style={styles.input}
                />
                <button onClick={handleLogin} disabled={loading} style={styles.loginBtn}>
                    {loading ? "تصدیق ہو رہی ہے..." : "لاگ ان کریں"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    loginContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1A0F0A' },
    loginCard: { padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', textAlign: 'center', border: '1px solid #D4AF37' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #444', background: '#000', color: '#fff' },
    loginBtn: { width: '100%', padding: '12px', background: '#D4AF37', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default AdminLogin;
