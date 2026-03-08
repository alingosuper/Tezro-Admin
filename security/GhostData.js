// یہ وہ فرضی ڈیٹا ہے جو حملے یا زبردستی کے وقت نظر آئے گا
export const GhostData = {
    // فرضی بینک بیلنس (اتنا کم کہ حملہ آور کا وقت ضائع ہو)
    vault: {
        totalBalance: "PKR 1,450",
        lastDeposit: "PKR 200",
        savingsGoal: "5%",
        status: "RESTRICTED_ACCESS"
    },

    // فرضی آرڈرز (پرانے اور معمولی)
    orders: [
        { id: 'TX-9901', item: 'Mineral Water', status: 'Cancelled', price: '60' },
        { id: 'TX-9902', item: 'Bread Pack', status: 'Delivered', price: '120' }
    ],

    // فرضی ایڈمن سٹیٹس (تاکہ سسٹم خالی نہ لگے)
    stats: {
        totalRevenue: "4,500",
        activeDrivers: "1",
        systemHealth: "STABLE"
    },

    // فرضی میسجز
    notifications: [
        { id: 1, msg: "Your account is under weekly maintenance." },
        { id: 2, msg: "Last login from unknown device: Lahore, Pakistan." }
    ]
};
