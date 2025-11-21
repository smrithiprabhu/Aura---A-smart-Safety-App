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
