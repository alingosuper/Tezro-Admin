import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from 'react';

const InventoryManager = ({ theme }) => {
    const [product, setProduct] = useState({ name: '', price: '', category: 'food' });

    const saveProduct = async () => {
        if (!product.name || !product.price) return alert("تمام خانے پُر کریں!");
        
        try {
            await addDoc(collection(db, "products"), {
                ...product,
                createdAt: serverTimestamp(),
                status: 'active'
            });
            alert("✅ پروڈکٹ کامیابی سے ایپ پر اپلوڈ ہو گئی ہے!");
            setProduct({ name: '', price: '', category: 'food' });
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    return (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}44` }} className="p-6 rounded-3xl max-w-md mx-auto">
            <h2 style={{ color: theme.border }} className="text-xl font-black mb-4 uppercase italic">Add New Product</h2>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="نام (مثلاً چکن بریانی)" 
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white"
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                />
                <input 
                    type="number" 
                    placeholder="قیمت (Rs.)" 
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white"
                    value={product.price}
                    onChange={(e) => setProduct({...product, price: e.target.value})}
                />
                <select 
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-gold-500"
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                >
                    <option value="food">Food (کھانا)</option>
                    <option value="grocery">Grocery (گروسری)</option>
                </select>
                <button 
                    onClick={saveProduct}
                    className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase hover:scale-95 transition-all"
                >
                    PUSH TO LIVE APP
                </button>
            </div>
        </div>
    );
};

export default InventoryManager;
