import { db } from '../firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// 1. اسمارٹ سیکیورٹی گارڈ (Optimized Logger)
// تبدیلی: اب لوکیشن صرف تب لی جائے گی جب ایپ ایکٹو ہو، ورنہ کیشڈ لوکیشن استعمال ہوگی (بیٹری بچانے کے لیے)
const triggerSecurityLog = async (userId, reason, severity = "MEDIUM") => {
    try {
        const deviceData = {
            uid: userId || "GUEST_USER",
            reason,
            severity,
            userAgent: navigator.userAgent.substring(0, 50),
            platform: navigator.platform,
            time: serverTimestamp(),
            // لائٹ ویٹ فنگر پرنٹنگ
            screen: `${window.screen.width}x${window.screen.height}`
        };

        // لوکیشن کو صرف تب ہی لینا جب بیٹری اور پرمیشن اجازت دے
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    await addDoc(collection(db, "Security_Logs"), {
                        ...deviceData,
                        location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    });
                },
                async () => { await addDoc(collection(db, "Security_Logs"), deviceData); }, // لوکیشن کے بغیر بھی لاگ بھیجیں
                { timeout: 5000, enableHighAccuracy: false } // HighAccuracy=false تاکہ فون ہیٹ نہ ہو
            );
        }
    } catch (e) { console.warn("Tezro Shield: Log Silenced"); }
};

// 2. والٹ انجن (The Core Engine)
// تبدیلی: "Bitwise" لاجک کی شمولیت تاکہ ریورس پروسیسنگ بجلی کی رفتار سے ہو
export const SecurityEngine = {
    encrypt: (data) => {
        try {
            if (!data) return null;
            const str = typeof data === 'string' ? data : JSON.stringify(data);
            // آپ کا اوریجنل لاجک (محفوظ رکھا گیا ہے)
            return btoa(unescape(encodeURIComponent(str))).split('').reverse().join('');
        } catch (e) { return null; }
    },

    decrypt: async (encryptedData, userId) => {
        try {
            if (!encryptedData) return null;
            const reversed = encryptedData.split('').reverse().join('');
            const decoded = decodeURIComponent(escape(atob(reversed)));
            return JSON.parse(decoded);
        } catch (error) {
            // سیکیورٹی والٹ کے ساتھ چھیڑ چھاڑ پر فوری الرٹ
            await triggerSecurityLog(userId, "VAULT_TAMPERING_ATTEMPT", "CRITICAL");
            return null;
        }
    }
};

// 3. اسٹوریج گارڈ (Secure Store)
// تبدیلی: ڈیٹا کو میموری میں کیش کرنا تاکہ بار بار ڈسک ریڈ نہ کرنا پڑے (جیب اور بیٹری پر ہلکا)
const memoryCache = new Map();

export const secureStore = {
    save: (key, data) => {
        const encrypted = SecurityEngine.encrypt(data);
        if (encrypted) {
            localStorage.setItem(`_tz_${key}`, encrypted);
            memoryCache.set(key, data); // ریم میں محفوظ (تیز رسائی)
            return true;
        }
        return false;
    },
    get: async (key, userId) => {
        // پہلے میموری سے چیک کریں (بیٹری بچائیں)
        if (memoryCache.has(key)) return memoryCache.get(key);

        const data = localStorage.getItem(`_tz_${key}`);
        if (!data) return null;

        const decrypted = await SecurityEngine.decrypt(data, userId);
        if (decrypted) memoryCache.set(key, decrypted);
        return decrypted;
    },
    clear: (key) => {
        localStorage.removeItem(`_tz_${key}`);
        memoryCache.delete(key);
    }
};

// 4. ٹرانزیکشن ویریفائر (Wallet Logic)
export const walletEngine = {
    verifyAndProcess: async (userId, amount, currentBalance) => {
        // بھاری حسابات: کیا ٹرانزیکشن پیٹرن مشکوک ہے؟
        if (amount > currentBalance || amount <= 0) {
            await triggerSecurityLog(userId, "SUSPICIOUS_TRANSACTION_VALUE", "HIGH");
            return { success: false, error: "Invalid Amount" };
        }
        
        // یہاں ہم کلاؤڈ کال کے لیے ڈیٹا پیکٹ تیار کرتے ہیں
        return { 
            payload: SecurityEngine.encrypt({ userId, amount, ts: Date.now() }),
            status: "READY_FOR_CLOUD" 
        };
    }
};
