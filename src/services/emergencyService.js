/**
 * Emergency Service
 * Handles silent emergency alerts and location tracking during fake calls
 */

class EmergencyService {
    constructor() {
        this.emergencyContacts = [];
        this.locationTrackingInterval = null;
        this.isTracking = false;
        this.locationHistory = [];
        this.initializeDefaultContacts();
    }

    initializeDefaultContacts() {
        // Check if contacts already exist
        const existingContacts = localStorage.getItem('aura_emergency_contacts');
        if (!existingContacts) {
            // Pre-populate with default emergency contacts
            const defaultContacts = [
                {
                    id: Date.now().toString(),
                    name: 'Shreya',
                    phone: '6260650804',
                    email: '',
                    relationship: 'Emergency Contact',
                    createdAt: new Date().toISOString()
                },
                {
                    id: (Date.now() + 1).toString(),
                    name: 'Sneha',
                    phone: '9594001738',
                    email: '',
                    relationship: 'Emergency Contact',
                    createdAt: new Date().toISOString()
                },
                {
                    id: (Date.now() + 2).toString(),
                    name: 'Lata',
                    phone: '9930702752',
                    email: '',
                    relationship: 'Emergency Contact',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('aura_emergency_contacts', JSON.stringify(defaultContacts));
            this.emergencyContacts = defaultContacts;
            console.log('✅ Default emergency contacts initialized:', defaultContacts);
        }
    }

    loadEmergencyContacts() {
        try {
            const data = localStorage.getItem('aura_emergency_contacts');
            this.emergencyContacts = data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading emergency contacts:', error);
            this.emergencyContacts = [];
        }
    }

    saveEmergencyContacts(contacts) {
        try {
            localStorage.setItem('aura_emergency_contacts', JSON.stringify(contacts));
            this.emergencyContacts = contacts;
        } catch (error) {
            console.error('Error saving emergency contacts:', error);
        }
    }

    addEmergencyContact(contact) {
        this.loadEmergencyContacts();
        this.emergencyContacts.push({
            id: Date.now().toString(),
            name: contact.name || 'Emergency Contact',
            phone: contact.phone || '',
            email: contact.email || '',
            ...contact
        });
        this.saveEmergencyContacts(this.emergencyContacts);
    }

    startLocationTracking() {
        if (this.isTracking) return;
        this.isTracking = true;
        this.locationHistory = [];

        // Get initial location
        this.updateLocation();

        // Update every 30 seconds (battery-efficient)
        this.locationTrackingInterval = setInterval(() => {
            this.updateLocation();
        }, 30000);
    }

    stopLocationTracking() {
        this.isTracking = false;
        if (this.locationTrackingInterval) {
            clearInterval(this.locationTrackingInterval);
            this.locationTrackingInterval = null;
        }
    }

    updateLocation() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                this.locationHistory.push(location);
                // Keep only last 10 locations
                if (this.locationHistory.length > 10) {
                    this.locationHistory.shift();
                }
            },
            (error) => {
                console.error('Location error:', error);
            },
            {
                enableHighAccuracy: false, // Battery-efficient
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    async triggerEmergency() {
        this.loadEmergencyContacts();

        // Start tracking if not already
        if (!this.isTracking) {
            this.startLocationTracking();
        }

        // Get current location
        const currentLocation = this.locationHistory[this.locationHistory.length - 1];

        // Create emergency alert data
        const alert = {
            timestamp: new Date().toISOString(),
            location: currentLocation || { latitude: 'Unknown', longitude: 'Unknown' },
            message: '🚨 EMERGENCY ALERT from Aura Safety App',
            status: 'ACTIVE'
        };

        // Store alert in localStorage (would be sent to backend in production)
        try {
            const alerts = JSON.parse(localStorage.getItem('aura_emergency_alerts') || '[]');
            alerts.push(alert);
            localStorage.setItem('aura_emergency_alerts', JSON.stringify(alerts));
        } catch (error) {
            console.error('Error saving emergency alert:', error);
        }

        // Simulate sending alerts (in production, this would hit an API)
        console.log('🚨 EMERGENCY TRIGGERED:', alert);
        console.log('Notifying contacts:', this.emergencyContacts);

        // Show silent confirmation (no visible UI change to attacker)
        this.vibrateDevice([200, 100, 200]); // Haptic feedback

        return alert;
    }

    async sendSMSAlerts(alertData) {
        this.loadEmergencyContacts();

        console.log('📋 Loaded contacts:', this.emergencyContacts);
        console.log('📊 Total contacts:', this.emergencyContacts.length);

        if (this.emergencyContacts.length === 0) {
            console.error('⚠️ No emergency contacts configured!');
            return { success: false, message: 'No emergency contacts found', totalSent: 0, totalFailed: 0, results: [] };
        }

        const smsResults = [];

        // Use SMS URI scheme to open device's SMS app
        for (const contact of this.emergencyContacts) {
            if (contact.phone) {
                try {
                    // Log the SMS details
                    console.log(`\n📱 ===== SMS ALERT =====`);
                    console.log(`To: ${contact.name} (${contact.phone})`);
                    console.log(`Message Preview: ${alertData.message.substring(0, 100)}...`);
                    console.log(`========================\n`);

                    // Create SMS link with proper formatting
                    const phoneNumber = contact.phone.replace(/\D/g, ''); // Remove non-digits
                    const messageBody = encodeURIComponent(alertData.message);

                    // Use SMS URI scheme (works on mobile and desktop)
                    // Format: sms:PHONE?body=MESSAGE
                    const smsLink = `sms:${phoneNumber}?body=${messageBody}`;

                    // Open SMS app with pre-filled message
                    console.log(`🔗 Opening SMS app for ${contact.name}...`);
                    window.open(smsLink, '_blank');

                    // Small delay between contacts to avoid blocking
                    await new Promise(resolve => setTimeout(resolve, 500));

                    smsResults.push({
                        contact: contact.name,
                        phone: contact.phone,
                        status: 'sent',
                        timestamp: new Date().toISOString(),
                        method: 'sms-uri'
                    });

                    // Store SMS log
                    try {
                        const smsLog = JSON.parse(localStorage.getItem('aura_sms_log') || '[]');
                        smsLog.push({
                            to: contact.phone,
                            name: contact.name,
                            message: alertData.message,
                            timestamp: new Date().toISOString(),
                            alertType: alertData.type || 'emergency',
                            status: 'sent',
                            method: 'local'
                        });
                        // Keep only last 100 SMS logs
                        if (smsLog.length > 100) {
                            smsLog.shift();
                        }
                        localStorage.setItem('aura_sms_log', JSON.stringify(smsLog));
                    } catch (error) {
                        console.error('Error saving SMS log:', error);
                    }

                    // Show browser notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification(`📱 Alert Sent to ${contact.name}`, {
                            body: `Emergency SMS dispatched to ${contact.phone}`,
                            icon: '/icon-192x192.png',
                            tag: `sms-${contact.id}`
                        });
                    }

                } catch (error) {
                    console.error(`Failed to send SMS to ${contact.name}:`, error);
                    smsResults.push({
                        contact: contact.name,
                        phone: contact.phone,
                        status: 'failed',
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }

        // Show summary notification
        if (smsResults.length > 0) {
            console.log(`\n✅ SMS ALERT SUMMARY:`);
            console.log(`Total contacts notified: ${smsResults.length}`);
            console.log(`Successful: ${smsResults.filter(r => r.status === 'sent').length}`);
            console.log(`Failed: ${smsResults.filter(r => r.status === 'failed').length}\n`);
        }

        return {
            success: true,
            results: smsResults,
            totalSent: smsResults.filter(r => r.status === 'sent').length,
            totalFailed: smsResults.filter(r => r.status === 'failed').length,
            method: 'local'
        };
    }

    vibrateDevice(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    getLocationHistory() {
        return this.locationHistory;
    }

    getCurrentLocation() {
        return this.locationHistory[this.locationHistory.length - 1] || null;
    }
}

export default new EmergencyService();
