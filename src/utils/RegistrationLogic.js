/**
 * TEZRO MASTER REGISTRATION LOGIC
 * پیتھ: src/utils/RegistrationLogic.js
 */

const RegistrationLogic = {
  // 1. ڈائنامک کنفیگریشن
  getRequiredFields: (role) => {
    const common = {
      fullName: { label: "مکمل نام", type: "text", required: true },
      phone: { label: "فون نمبر", type: "tel", required: true },
      address: { label: "پتہ", type: "text", required: true }
    };

    const roles = {
      driver: { ...common, vehicleNo: "text", cnic: "number" },
      vendor: { ...common, businessName: "text", ntn: "text" },
      BUYER: { ...common, emergencyContacts: "array" } 
    };

    return roles[role] || common;
  },

  // 2. ڈیٹا سینیٹائزیشن (پوپ اپ کے لیے لازمی فنکشن)
  sanitizeAfterVerification: (data) => {
    if (!data) return {};
    return {
      ...data,
      fullName: data.fullName?.trim().toUpperCase(),
      isVerified: true,
      processedAt: new Date().toISOString()
    };
  },

  // 3. سیکیورٹی فلٹر
  sanitizeForPublic: (data) => {
    if (!data || !data.businessName) return {};
    return {
      bizName: data.businessName,
      category: data.role,
      isVerified: true,
      displayName: data.businessName.split(' ')[0] + "...",
      joinedAt: Date.now()
    };
  },

  // 4. ڈیٹا ویلیڈیشن
  validateCNIC: (cnic) => {
    return /^[0-9]{13}$/.test(cnic); 
  }
};

export default RegistrationLogic;
