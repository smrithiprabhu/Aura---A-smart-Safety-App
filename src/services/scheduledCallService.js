/**
 * Scheduled Call Service
 * Manages scheduled fake calls with background support
 */

class ScheduledCallService {
  constructor() {
    this.storageKey = 'aura_scheduled_calls';
    this.checkInterval = null;
    this.callbacks = [];
  }

  start() {
    if (this.checkInterval) return;
    
    // Check for due calls every 30 seconds (battery-efficient)
    this.checkInterval = setInterval(() => {
      this.checkScheduledCalls();
    }, 30000);

    // Immediate check on start
    this.checkScheduledCalls();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getAllScheduledCalls() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading scheduled calls:', error);
      return [];
    }
  }

  saveScheduledCalls(calls) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(calls));
    } catch (error) {
      console.error('Error saving scheduled calls:', error);
    }
  }

  scheduleCall(callData) {
    const calls = this.getAllScheduledCalls();
    const newCall = {
      id: Date.now().toString(),
      scheduledTime: callData.scheduledTime, // Unix timestamp
      callerProfileId: callData.callerProfileId || 'mom',
      repeat: callData.repeat || 'once', // once, daily, weekly
      enabled: true,
      lastTriggered: null,
      ...callData
    };
    calls.push(newCall);
    this.saveScheduledCalls(calls);
    return newCall;
  }

  deleteScheduledCall(id) {
    const calls = this.getAllScheduledCalls();
    const filtered = calls.filter(c => c.id !== id);
    this.saveScheduledCalls(filtered);
  }

  toggleScheduledCall(id, enabled) {
    const calls = this.getAllScheduledCalls();
    const call = calls.find(c => c.id === id);
    if (call) {
      call.enabled = enabled;
      this.saveScheduledCalls(calls);
    }
  }

  checkScheduledCalls() {
    const now = Date.now();
    const calls = this.getAllScheduledCalls();
    let updated = false;

    calls.forEach(call => {
      if (!call.enabled) return;
      
      const scheduledTime = new Date(call.scheduledTime).getTime();
      const timeDiff = now - scheduledTime;

      // Trigger if within 1 minute window
      if (timeDiff >= 0 && timeDiff < 60000) {
        // Check if not already triggered recently
        if (!call.lastTriggered || now - call.lastTriggered > 60000) {
          this.triggerScheduledCall(call);
          call.lastTriggered = now;
          updated = true;

          // Handle repeat
          if (call.repeat === 'daily') {
            call.scheduledTime = scheduledTime + 86400000; // Add 24 hours
          } else if (call.repeat === 'weekly') {
            call.scheduledTime = scheduledTime + 604800000; // Add 7 days
          } else {
            call.enabled = false; // One-time call
          }
        }
      }
    });

    if (updated) {
      this.saveScheduledCalls(calls);
    }
  }

  triggerScheduledCall(call) {
    console.log('📞 Triggering scheduled call:', call);
    
    // Vibrate device
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }

    // Trigger callbacks
    this.callbacks.forEach(cb => {
      try {
        cb(call);
      } catch (error) {
        console.error('Scheduled call callback error:', error);
      }
    });

    // Show notification if supported
    this.showNotification(call);
  }

  showNotification(call) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Incoming Call', {
        body: `${call.callerName || 'Unknown'} is calling...`,
        icon: '/aura-icon.png',
        badge: '/aura-badge.png',
        tag: 'fake-call',
        requireInteraction: true,
        vibrate: [300, 100, 300]
      });
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      return Notification.requestPermission();
    }
    return Promise.resolve(Notification.permission);
  }

  onScheduledCall(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  offScheduledCall(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }
}

export default new ScheduledCallService();
