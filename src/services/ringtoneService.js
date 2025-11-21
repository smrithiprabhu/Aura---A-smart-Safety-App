/**
 * Advanced Ringtone Service
 * Generates powerful, attention-grabbing ringtones for incoming fake calls
 */

class RingtoneService {
  constructor() {
    this.audioContext = null;
    this.intervalRef = null;
    this.isPlaying = false;
  }

  // Play POWERFUL ringtone - very loud and attention-grabbing
  playStrongRingtone() {
    try {
      if (this.isPlaying) return;
      
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = this.audioContext;
      
      // Try to resume context (required for some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
      }

      this.isPlaying = true;

      // Master gain - MAXIMUM VOLUME for emergency situations
      const masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.setValueAtTime(1.0, audioContext.currentTime);

      // Aggressive compressor for LOUD, attention-grabbing sound
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, audioContext.currentTime); // Very low threshold
      compressor.knee.setValueAtTime(40, audioContext.currentTime); // Hard compression
      compressor.ratio.setValueAtTime(20, audioContext.currentTime); // Aggressive ratio
      compressor.attack.setValueAtTime(0.003, audioContext.currentTime); // Fast attack
      compressor.release.setValueAtTime(0.25, audioContext.currentTime);
      compressor.connect(masterGain);

      // Function to play EXTREMELY LOUD and SCARY ringtone pattern
      const playPattern = () => {
        if (!this.isPlaying) return;

        const now = audioContext.currentTime;
        
        // Create an ALARMING, PIERCING ringtone that CANNOT be ignored
        // Designed to scare threats and draw attention
        
        // PRIMARY ALARM TONE - 900Hz (piercing frequency)
        const osc1 = audioContext.createOscillator();
        osc1.type = 'square'; // Square wave is MUCH louder and more jarring than sine
        osc1.frequency.setValueAtTime(900, now);
        
        const gain1 = audioContext.createGain();
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.exponentialRampToValueAtTime(0.8, now + 0.02); // Very fast attack
        gain1.gain.setValueAtTime(0.8, now + 0.5);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        
        osc1.connect(gain1);
        gain1.connect(compressor);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // SECONDARY ALARM - 1200Hz (high-pitched, attention-grabbing)
        const osc2 = audioContext.createOscillator();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1200, now);
        
        const gain2 = audioContext.createGain();
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
        gain2.gain.setValueAtTime(0.7, now + 0.5);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        
        osc2.connect(gain2);
        gain2.connect(compressor);
        osc2.start(now);
        osc2.stop(now + 0.6);

        // THIRD TONE - Creates dissonance, more alarming
        const osc3 = audioContext.createOscillator();
        osc3.type = 'sawtooth'; // Sawtooth is harsh and cutting
        osc3.frequency.setValueAtTime(850, now);
        
        const gain3 = audioContext.createGain();
        gain3.gain.setValueAtTime(0, now);
        gain3.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
        gain3.gain.setValueAtTime(0.6, now + 0.5);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        
        osc3.connect(gain3);
        gain3.connect(compressor);
        osc3.start(now);
        osc3.stop(now + 0.6);

        // SECOND BURST - Even more urgent
        const osc4 = audioContext.createOscillator();
        osc4.type = 'square';
        osc4.frequency.setValueAtTime(950, now + 0.65);
        
        const gain4 = audioContext.createGain();
        gain4.gain.setValueAtTime(0, now + 0.65);
        gain4.gain.exponentialRampToValueAtTime(0.8, now + 0.67);
        gain4.gain.setValueAtTime(0.8, now + 1.15);
        gain4.gain.exponentialRampToValueAtTime(0.01, now + 1.25);
        
        osc4.connect(gain4);
        gain4.connect(compressor);
        osc4.start(now + 0.65);
        osc4.stop(now + 1.25);

        const osc5 = audioContext.createOscillator();
        osc5.type = 'square';
        osc5.frequency.setValueAtTime(1250, now + 0.65);
        
        const gain5 = audioContext.createGain();
        gain5.gain.setValueAtTime(0, now + 0.65);
        gain5.gain.exponentialRampToValueAtTime(0.7, now + 0.67);
        gain5.gain.setValueAtTime(0.7, now + 1.15);
        gain5.gain.exponentialRampToValueAtTime(0.01, now + 1.25);
        
        osc5.connect(gain5);
        gain5.connect(compressor);
        osc5.start(now + 0.65);
        osc5.stop(now + 1.25);

        // DEEP BASS - Makes it feel more physical and alarming
        const bassOsc = audioContext.createOscillator();
        bassOsc.type = 'triangle'; // Triangle gives punchy bass
        bassOsc.frequency.setValueAtTime(150, now);
        
        const bassGain = audioContext.createGain();
        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
        bassGain.gain.setValueAtTime(0.5, now + 1.2);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);
        
        bassOsc.connect(bassGain);
        bassGain.connect(compressor);
        bassOsc.start(now);
        bassOsc.stop(now + 1.3);

        // SUB BASS for maximum impact
        const subBass = audioContext.createOscillator();
        subBass.type = 'sine';
        subBass.frequency.setValueAtTime(80, now);
        
        const subGain = audioContext.createGain();
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
        subGain.gain.setValueAtTime(0.4, now + 1.2);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);
        
        subBass.connect(subGain);
        subGain.connect(compressor);
        subBass.start(now);
        subBass.stop(now + 1.3);
      };

      // Play immediately - LOUD and ALARMING
      playPattern();

      // Repeat every 1.5 seconds (more frequent = more urgent and scary)
      this.intervalRef = setInterval(playPattern, 1500);

    } catch (error) {
      console.error('Error playing ringtone:', error);
      this.isPlaying = false;
    }
  }

  vibratePattern() {
    if ('vibrate' in navigator) {
      // Vibration pattern: [vibrate, pause, vibrate, pause...]
      // 300ms vibrate, 200ms pause, 300ms vibrate, 1000ms pause
      const pattern = [300, 200, 300, 1000];
      
      // Start vibration
      navigator.vibrate(pattern);
      
      // Repeat vibration every 2 seconds to match ringtone
      const vibrateInterval = setInterval(() => {
        if (this.isPlaying) {
          navigator.vibrate(pattern);
        } else {
          clearInterval(vibrateInterval);
        }
      }, 2000);
    }
  }

  stop() {
    this.isPlaying = false;
    
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  // Alternative: Play a custom uploaded ringtone (for future enhancement)
  async playCustomRingtone(audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 1.0;
      await audio.play();
      
      this.customAudio = audio;
      
    } catch (error) {
      console.error('Error playing custom ringtone:', error);
      // Fallback to generated ringtone
      this.playStrongRingtone();
    }
  }

  stopCustomRingtone() {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }
}

export default new RingtoneService();
