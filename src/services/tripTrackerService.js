// Trip Tracker Service - ETA-based journey monitoring with automatic escalation
// Monitors user location, battery, and time to trigger SOS if needed

class TripTrackerService {
  constructor() {
    this.activeTrip = null;
    this.tripTimer = null;
    this.locationWatcher = null;
    this.batteryMonitor = null;
    this.listeners = [];
    this.criticalBatteryThreshold = 10; // 10% battery triggers SOS
    this.locationHistory = [];
  }

  // Start a new trip with ETA monitoring
  startTrip(config) {
    const {
      userName,
      destination,
      etaMinutes,
      guardian,
      startLocation = null
    } = config;

    // Validate inputs
    if (!destination || !etaMinutes || !guardian) {
      throw new Error('Destination, ETA, and Guardian are required');
    }

    if (etaMinutes < 5 || etaMinutes > 120) {
      throw new Error('ETA must be between 5 and 120 minutes');
    }

    // Initialize trip
    const startTime = Date.now();
    const expectedArrivalTime = startTime + (etaMinutes * 60 * 1000);

    this.activeTrip = {
      id: `trip_${startTime}`,
      userName: userName || 'User',
      destination,
      etaMinutes,
      guardian,
      startTime,
      expectedArrivalTime,
      startLocation,
      currentLocation: startLocation,
      status: 'active', // active, completed, escalated
      batteryLevel: 100,
      safeArrival: false,
      escalated: false
    };

    // Start monitoring
    this.startLocationTracking();
    this.startBatteryMonitoring();
    this.startETATimer();

    // Send initial notification to Guardian
    this.notifyGuardianTripStart();

    // Save trip to history
    this.saveTripToHistory();

    this.notifyListeners();

    console.log('Trip started:', this.activeTrip);

    return this.activeTrip;
  }

  // Start tracking user location
  startLocationTracking() {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    this.locationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        if (this.activeTrip) {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          };

          this.activeTrip.currentLocation = location;
          this.locationHistory.push(location);

          // Keep only last 100 locations
          if (this.locationHistory.length > 100) {
            this.locationHistory.shift();
          }

          this.notifyListeners();
        }
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      options
    );
  }

  // Monitor battery level
  startBatteryMonitoring() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        // Update initial battery level
        this.updateBatteryLevel(battery.level * 100);

        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          this.updateBatteryLevel(battery.level * 100);
        });

        // Store battery reference
        this.batteryMonitor = battery;
      });
    } else {
      console.warn('Battery API not supported');
    }
  }

  // Update battery level and check threshold
  updateBatteryLevel(level) {
    if (!this.activeTrip) return;

    this.activeTrip.batteryLevel = Math.round(level);

    // Check if battery dropped below critical threshold
    if (level <= this.criticalBatteryThreshold && !this.activeTrip.escalated) {
      console.warn('Critical battery level reached:', level);
      this.triggerBatteryEmergency();
    }

    this.notifyListeners();
  }

  // Start ETA countdown timer
  startETATimer() {
    // Clear any existing timer
    if (this.tripTimer) {
      clearInterval(this.tripTimer);
    }

    // Check every second if ETA has expired
    this.tripTimer = setInterval(() => {
      if (!this.activeTrip) {
        clearInterval(this.tripTimer);
        return;
      }

      const now = Date.now();
      const timeRemaining = this.activeTrip.expectedArrivalTime - now;

      // Check if time expired and user hasn't confirmed safe arrival
      if (timeRemaining <= 0 && !this.activeTrip.safeArrival && !this.activeTrip.escalated) {
        console.warn('ETA expired without safe arrival confirmation');
        this.triggerETAExpiredEmergency();
      }

      this.notifyListeners();
    }, 1000);
  }

  // Get current trip status
  getTripStatus() {
    if (!this.activeTrip) return null;

    const now = Date.now();
    const elapsed = now - this.activeTrip.startTime;
    const remaining = this.activeTrip.expectedArrivalTime - now;
    const progress = (elapsed / (this.activeTrip.etaMinutes * 60 * 1000)) * 100;

    return {
      ...this.activeTrip,
      elapsedTime: elapsed,
      remainingTime: Math.max(0, remaining),
      progress: Math.min(100, progress),
      isExpired: remaining <= 0
    };
  }

  // User confirms safe arrival
  confirmSafeArrival() {
    if (!this.activeTrip) {
      throw new Error('No active trip');
    }

    this.activeTrip.safeArrival = true;
    this.activeTrip.status = 'completed';
    this.activeTrip.completionTime = Date.now();

    // Stop all monitoring
    this.stopMonitoring();

    // Notify Guardian of safe arrival
    this.notifyGuardianSafeArrival();

    // Save to history
    this.saveTripToHistory();

    this.notifyListeners();

    console.log('Trip completed safely:', this.activeTrip);

    const completedTrip = { ...this.activeTrip };
    this.activeTrip = null;

    return completedTrip;
  }

  // Trigger emergency when ETA expires
  triggerETAExpiredEmergency() {
    if (!this.activeTrip || this.activeTrip.escalated) return;

    console.error('EMERGENCY: ETA expired without confirmation');

    this.activeTrip.escalated = true;
    this.activeTrip.status = 'escalated';
    this.activeTrip.escalationType = 'eta_expired';
    this.activeTrip.escalationTime = Date.now();

    // Send high-priority SOS to Guardian
    this.sendSOSAlert({
      reason: 'ETA Expired',
      message: `${this.activeTrip.userName}'s trip timer expired without safe arrival confirmation.`,
      priority: 'high',
      location: this.activeTrip.currentLocation
    });

    this.saveTripToHistory();
    this.notifyListeners();
  }

  // Trigger emergency when battery is critical
  triggerBatteryEmergency() {
    if (!this.activeTrip || this.activeTrip.escalated) return;

    console.error('EMERGENCY: Critical battery level');

    this.activeTrip.escalated = true;
    this.activeTrip.status = 'escalated';
    this.activeTrip.escalationType = 'critical_battery';
    this.activeTrip.escalationTime = Date.now();

    // Send high-priority SOS to Guardian
    this.sendSOSAlert({
      reason: 'Critical Battery',
      message: `${this.activeTrip.userName}'s phone battery dropped to ${this.activeTrip.batteryLevel}% during trip.`,
      priority: 'high',
      location: this.activeTrip.currentLocation
    });

    this.saveTripToHistory();
    this.notifyListeners();
  }

  // Send SOS alert to Guardian
  sendSOSAlert(details) {
    const alert = {
      type: 'SOS',
      tripId: this.activeTrip.id,
      userName: this.activeTrip.userName,
      destination: this.activeTrip.destination,
      guardian: this.activeTrip.guardian,
      reason: details.reason,
      message: details.message,
      priority: details.priority,
      location: details.location,
      batteryLevel: this.activeTrip.batteryLevel,
      timestamp: Date.now(),
      trackingLink: this.generateTrackingLink()
    };

    // In production, this would send SMS/notification to Guardian
    console.error('🚨 SOS ALERT SENT TO GUARDIAN:', alert);

    // Simulate notification
    this.showSOSNotification(alert);

    return alert;
  }

  // Generate tracking link for Guardian
  generateTrackingLink() {
    if (!this.activeTrip || !this.activeTrip.currentLocation) {
      return 'https://aura.app/track/unknown';
    }

    const { latitude, longitude } = this.activeTrip.currentLocation;
    return `https://aura.app/track/${this.activeTrip.id}?lat=${latitude}&lng=${longitude}`;
  }

  // Notify Guardian when trip starts
  notifyGuardianTripStart() {
    const message = {
      type: 'trip_start',
      text: `Aura: ${this.activeTrip.userName} has started a trip. ETA: ${this.activeTrip.etaMinutes} minutes. Live tracking link: ${this.generateTrackingLink()}`,
      guardian: this.activeTrip.guardian,
      timestamp: Date.now()
    };

    // In production, send SMS/push notification
    console.log('📱 Guardian Notification (Trip Start):', message);

    return message;
  }

  // Notify Guardian when user arrives safely
  notifyGuardianSafeArrival() {
    const message = {
      type: 'safe_arrival',
      text: `Aura: ${this.activeTrip.userName} has arrived safely at their destination.`,
      guardian: this.activeTrip.guardian,
      timestamp: Date.now()
    };

    // In production, send SMS/push notification
    console.log('📱 Guardian Notification (Safe Arrival):', message);

    return message;
  }

  // Show SOS notification in app
  showSOSNotification(alert) {
    // This will be displayed in the UI
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('🚨 EMERGENCY ALERT', {
        body: alert.message,
        icon: '/aura-icon.png',
        tag: 'sos-alert',
        requireInteraction: true
      });
    }
  }

  // Stop all monitoring
  stopMonitoring() {
    if (this.tripTimer) {
      clearInterval(this.tripTimer);
      this.tripTimer = null;
    }

    if (this.locationWatcher) {
      navigator.geolocation.clearWatch(this.locationWatcher);
      this.locationWatcher = null;
    }

    // Battery monitor automatically continues
    this.batteryMonitor = null;
    this.locationHistory = [];
  }

  // Cancel active trip
  cancelTrip() {
    if (!this.activeTrip) return;

    this.activeTrip.status = 'cancelled';
    this.activeTrip.cancelTime = Date.now();

    this.stopMonitoring();
    this.saveTripToHistory();

    console.log('Trip cancelled:', this.activeTrip);

    const cancelledTrip = { ...this.activeTrip };
    this.activeTrip = null;

    this.notifyListeners();

    return cancelledTrip;
  }

  // Save trip to localStorage history
  saveTripToHistory() {
    try {
      const trips = this.getTripHistory();
      const existingIndex = trips.findIndex(t => t.id === this.activeTrip.id);

      if (existingIndex >= 0) {
        trips[existingIndex] = { ...this.activeTrip };
      } else {
        trips.unshift({ ...this.activeTrip });
      }

      // Keep only last 50 trips
      const trimmedTrips = trips.slice(0, 50);
      localStorage.setItem('auraTripHistory', JSON.stringify(trimmedTrips));
    } catch (error) {
      console.error('Failed to save trip:', error);
    }
  }

  // Get trip history from localStorage
  getTripHistory() {
    try {
      const stored = localStorage.getItem('auraTripHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load trip history:', error);
      return [];
    }
  }

  // Clear trip history
  clearHistory() {
    localStorage.removeItem('auraTripHistory');
  }

  // Subscribe to trip updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getTripStatus());
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  // Get active trip
  getActiveTrip() {
    return this.activeTrip;
  }

  // Check if trip is active
  isActive() {
    return this.activeTrip !== null;
  }
}

// Create singleton instance
const tripTrackerService = new TripTrackerService();

export default tripTrackerService;
