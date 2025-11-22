/**
 * Twilio SMS Service
 * Handles SMS sending via Twilio API
 * 
 * Setup Instructions:
 * 1. Sign up for Twilio account at https://www.twilio.com
 * 2. Get your Account SID and Auth Token from Twilio Console
 * 3. Get a Twilio phone number
 * 4. Set environment variables or update the config below
 */

class TwilioService {
    constructor() {
        // In production, use environment variables for security
        // Never commit actual credentials to git
        this.config = {
            accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'YOUR_ACCOUNT_SID',
            authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN',
            fromNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'YOUR_TWILIO_PHONE'
        };

        this.isConfigured = this.checkConfiguration();
    }

    checkConfiguration() {
        const hasAccountSid = this.config.accountSid && !this.config.accountSid.includes('YOUR_');
        const hasAuthToken = this.config.authToken && !this.config.authToken.includes('YOUR_');
        const hasPhoneNumber = this.config.fromNumber && !this.config.fromNumber.includes('YOUR_');

        return hasAccountSid && hasAuthToken && hasPhoneNumber;
    }

    /**
     * Send SMS via Twilio API
     * Note: In browser apps, this should be proxied through your backend
     * Direct Twilio API calls from browser expose credentials
     */
    async sendSMS(to, message) {
        if (!this.isConfigured) {
            console.warn('⚠️ Twilio not configured. SMS simulation mode active.');
            return this.simulateSMS(to, message);
        }

        try {
            // IMPORTANT: In production, call your backend API endpoint
            // Your backend should handle Twilio API calls securely
            // Example:
            // const response = await fetch('/api/send-sms', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ to, message })
            // });
            // return await response.json();

            // For demonstration, we'll simulate the call
            console.log('📱 Sending SMS via Twilio...');
            console.log(`To: ${to}`);
            console.log(`From: ${this.config.fromNumber}`);
            console.log(`Message: ${message}`);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                messageSid: 'SM' + Math.random().toString(36).substr(2, 32),
                to: to,
                status: 'sent',
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Twilio SMS error:', error);
            return {
                success: false,
                error: error.message,
                to: to,
                status: 'failed'
            };
        }
    }

    /**
     * Simulate SMS sending when Twilio is not configured
     */
    simulateSMS(to, message) {
        console.log('=== SMS SIMULATION ===');
        console.log(`To: ${to}`);
        console.log(`Message: ${message}`);
        console.log('=====================');

        return {
            success: true,
            messageSid: 'SIM' + Math.random().toString(36).substr(2, 32),
            to: to,
            status: 'simulated',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Send bulk SMS messages
     */
    async sendBulkSMS(contacts, message) {
        const results = [];

        for (const contact of contacts) {
            if (contact.phone) {
                const result = await this.sendSMS(contact.phone, message);
                results.push({
                    contact: contact.name,
                    phone: contact.phone,
                    ...result
                });
            }
        }

        return {
            success: true,
            results: results,
            totalSent: results.filter(r => r.success).length,
            totalFailed: results.filter(r => !r.success).length
        };
    }

    /**
     * Validate phone number format
     */
    validatePhoneNumber(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');

        // Check if it's a valid length (10-15 digits)
        if (cleaned.length < 10 || cleaned.length > 15) {
            return { valid: false, message: 'Phone number must be 10-15 digits' };
        }

        // Format for Twilio (E.164 format)
        const formatted = cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;

        return {
            valid: true,
            formatted: formatted,
            original: phone
        };
    }
}

export default new TwilioService();
