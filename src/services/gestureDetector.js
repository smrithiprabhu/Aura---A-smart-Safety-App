/**
 * Gesture Detector Service
 * Detects shake gestures and hidden activation triggers
 */

class GestureDetector {
  constructor() {
    this.shakeThreshold = 15;
    this.shakeTimeout = 1000;
    this.lastShake = 0;
    this.callbacks = [];
    this.isActive = false;
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    // Shake detection using DeviceMotion API
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleMotion);
    }

    // Power button simulation (volume button on web - uses visibility change + rapid key combo)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('keydown', this.handleKeyPress);
  }

  stop() {
    this.isActive = false;
    window.removeEventListener('devicemotion', this.handleMotion);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleMotion = (event) => {
    if (!this.isActive) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const deltaX = Math.abs(x - this.lastAcceleration.x);
    const deltaY = Math.abs(y - this.lastAcceleration.y);
    const deltaZ = Math.abs(z - this.lastAcceleration.z);

    const totalDelta = deltaX + deltaY + deltaZ;

    if (totalDelta > this.shakeThreshold) {
      const now = Date.now();
      if (now - this.lastShake > this.shakeTimeout) {
        this.lastShake = now;
        this.trigger('shake');
      }
    }

    this.lastAcceleration = { x, y, z };
  };

  handleVisibilityChange = () => {
    // Detect rapid app switching (simulates power button)
    if (document.hidden) {
      this.hiddenTime = Date.now();
    } else {
      if (this.hiddenTime && Date.now() - this.hiddenTime < 500) {
        this.trigger('powerButton');
      }
    }
  };

  handleKeyPress = (event) => {
    // Secret key combo: Ctrl+Shift+S (or Cmd+Shift+S on Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
      event.preventDefault();
      this.trigger('secretCombo');
    }
  };

  onTrigger(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  offTrigger(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  trigger(type) {
    this.callbacks.forEach(cb => {
      try {
        cb(type);
      } catch (error) {
        console.error('Gesture callback error:', error);
      }
    });
  }

  // Manual trigger for testing or UI button
  manualTrigger() {
    this.trigger('manual');
  }
}

export default new GestureDetector();
