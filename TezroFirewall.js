export const TezroFirewall = {
    // 📊 ڈیٹا بیس (Redis/Cache) سے صارف کی حالیہ سرگرمی حاصل کرنا
    async validateAccess(userId, locationId, actionType) {
        const now = Date.now();
        const userLogs = await this.getRecentLogs(userId);

        // 1. لوکیشن بیسڈ فلٹر (10 بار رائیڈ بکنگ کی حد)
        const locationBookings = userLogs.filter(log => 
            log.locationId === locationId && 
            log.type === 'RIDE_REQUEST' && 
            (now - log.timestamp) < 600000 // پچھلے 10 منٹ
        );

        if (locationBookings.length >= 10) {
            this.triggerSecurityLock(userId, "LOCATION_SPAM_DETECTED");
            throw new Error("SECURITY_ALERT: Limit exceeded from this location. Try again later.");
        }

        // 2. ٹرانزیکشن ویلوسٹی (5 منٹ کا لازمی وقفہ)
        const lastSuccessTx = userLogs.find(log => 
            log.type === 'TRANSACTION' && 
            log.status === 'SUCCESS'
        );

        if (lastSuccessTx && (now - lastSuccessTx.timestamp) < 300000) { // 300,000ms = 5 mins
            throw new Error("COOLDOWN_ACTIVE: For your security, please wait 5 minutes between transactions.");
        }

        // 3. اسمارٹ OTP چیلنج (10 منٹ کے اندر دوبارہ ٹرانزیکشن پر)
        const recentTx = userLogs.find(log => 
            log.type === 'TRANSACTION' && 
            (now - log.timestamp) < 600000 // 10 mins
        );

        if (recentTx) {
            return { action: "REQUIRE_OTP", reason: "RAPID_TRANSACTION_REVERIFICATION" };
        }

        return { action: "PROCEED", status: "SECURE" };
    }
};
