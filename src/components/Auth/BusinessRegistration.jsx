import React, { useState } from 'react';
import { db, auth } from '../../firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { SecurityEngine } from '../../../Tezro_Vault/SecurityEngine';
import { RegistrationLogic } from '../../utils/RegistrationLogic';

const BusinessRegistration = ({ role, onClose }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        cnic: '',
        address: '',
        securityDeposit: 5000
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        // 🛡️ پروٹیکشن 1: CNIC ویلیڈیشن
        if (!RegistrationLogic.validateCNIC(formData.cnic)) {
            alert("Invalid CNIC! Please enter 13 digits.");
            return;
        }

        // 🔐 پروٹیکشن 2: والٹ انکرپشن (حساس ڈیٹا صرف والٹ میں جائے گا)
        const vaultPayload = SecurityEngine.encryptVault({
            uid: user.uid,
            cnic: formData.cnic,
            personalMeta: formData
        });

        // 💎 پروٹیکشن 3: ڈیٹا نارملائزیشن (صرف ضروری ڈیٹا پبلک ہوگا)
        const publicProfile = RegistrationLogic.sanitizeForPublic({
            ...formData,
            role: role
        });

        const finalProfile = {
            ...publicProfile,
            ownerId: user.uid,
            vaultHash: vaultPayload, // انکرپٹڈ ڈیٹا
            status: 'PENDING_VERIFICATION',
            joinedAt: serverTimestamp()
        };

        try {
            // ڈیٹا بیس میں محفوظ کرنا
            await setDoc(doc(db, "businesses", user.uid), finalProfile);
            await setDoc(doc(db, "users", user.uid), { 
                isVendor: true, 
                activeRole: role,
                vaultSynced: true 
            }, { merge: true });

            alert("Application Securely Submitted!");
            onClose();
        } catch (err) {
            console.error("Vault Security Breach Prevention:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-[40px] p-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                        <span className="text-2xl">🛡️</span>
                    </div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                        {role} <span className="text-[#D4AF37]">Onboarding</span>
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input 
                        placeholder="Business Name" 
                        className="reg-input-premium"
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        required 
                    />
                    <input 
                        placeholder="CNIC (13 Digits)" 
                        className="reg-input-premium"
                        onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                        required 
                    />

                    <div className="p-5 rounded-3xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Security Deposit</span>
                        <span className="text-[#D4AF37] font-black italic">Rs. 5,000</span>
                    </div>

                    <button type="submit" className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-[0.98] transition-all">
                        INITIALIZE SECURE ACCOUNT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BusinessRegistration;
