/**
 * Voice Call Audio Service
 * Generates realistic female voice audio for fake video calls with ambient background
 * Uses Web Speech Synthesis API for natural voice output
 */

class VoiceCallAudioService {
  constructor() {
    this.audioContext = null;
    this.backgroundSource = null;
    this.isPlaying = false;
    this.backgroundGainNode = null;
    this.loopTimeout = null;
    this.utterance = null;
    this.voiceLines = [
      "Hi, just checking in on you.",
      "Where are you now?",
      "You still over there?",
      "Oh, okay.",
      "Let me know when you're leaving.",
      "Just wanted to see if you needed anything else."
    ];
    this.currentLineIndex = 0;
    this.speechPaused = false;
  }

  /**
   * Initialize audio context
   */
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Generate ambient city/transit background noise
   */
  generateAmbientBackground(duration) {
    const ctx = this.initAudioContext();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      // Create layered ambient sound
      for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        
        // Low frequency rumble (bus/train engine)
        const rumble = Math.sin(2 * Math.PI * 45 * time) * 0.15 +
                       Math.sin(2 * Math.PI * 62 * time) * 0.12 +
                       Math.sin(2 * Math.PI * 38 * time) * 0.10;
        
        // Mid frequency hum (vehicle vibration)
        const hum = Math.sin(2 * Math.PI * 120 * time) * 0.08 +
                    Math.sin(2 * Math.PI * 180 * time) * 0.06;
        
        // White noise (air conditioning, distant traffic)
        const whiteNoise = (Math.random() * 2 - 1) * 0.03;
        
        // Pink noise for more natural sound
        const pinkNoise = (Math.random() * 2 - 1) * 0.02 * (1 - time / duration);
        
        // Combine all layers
        data[i] = (rumble + hum + whiteNoise + pinkNoise) * 0.08; // Very low volume
        
        // Apply fade in/out for smooth looping
        if (i < sampleRate * 0.5) {
          data[i] *= i / (sampleRate * 0.5); // Fade in
        } else if (i > length - sampleRate * 0.5) {
          data[i] *= (length - i) / (sampleRate * 0.5); // Fade out
        }
      }
    }

    return buffer;
  }

  /**
   * Speak a voice line using Web Speech API
   */
  speakLine(text, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.isPlaying || this.speechPaused) {
          resolve();
          return;
        }

        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Configure for female voice with natural characteristics
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          (voice.name.includes('Female') || 
           voice.name.includes('Samantha') || 
           voice.name.includes('Victoria') ||
           voice.name.includes('Karen') ||
           voice.name.includes('Moira')) &&
          voice.lang.startsWith('en')
        ) || voices.find(voice => voice.lang.startsWith('en'));

        if (femaleVoice) {
          this.utterance.voice = femaleVoice;
        }

        // Set voice characteristics for warm, relaxed tone
        this.utterance.rate = 0.95; // Slightly slower for relaxed feel
        this.utterance.pitch = 1.1; // Slightly higher for female voice
        this.utterance.volume = 0.8; // Comfortable volume

        this.utterance.onend = () => {
          resolve();
        };

        this.utterance.onerror = () => {
          resolve();
        };

        window.speechSynthesis.speak(this.utterance);
      }, delay);
    });
  }

  /**
   * Play voice conversation sequence
   */
  async playVoiceSequence() {
    if (!this.isPlaying) return;

    // Speak lines with natural pauses
    await this.speakLine(this.voiceLines[0], 500); // "Hi, just checking in on you."
    await this.speakLine(this.voiceLines[1], 1000); // "Where are you now?"
    await this.speakLine(this.voiceLines[2], 800); // "You still over there?"
    await this.speakLine(this.voiceLines[3], 600); // "Oh, okay."
    await this.speakLine(this.voiceLines[4], 1200); // "Let me know when you're leaving."
    await this.speakLine(this.voiceLines[5], 800); // "Just wanted to see if you needed anything else."

    // Schedule next loop after a pause
    if (this.isPlaying) {
      this.loopTimeout = setTimeout(() => {
        if (this.isPlaying) {
          this.playVoiceSequence();
        }
      }, 2000); // 2 second pause before repeating
    }
  }

  /**
   * Play the complete voice call audio with ambient background
   */
  async playVoiceCall() {
    try {
      this.stop(); // Stop any existing playback
      
      const ctx = this.initAudioContext();
      
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.isPlaying = true;
      this.speechPaused = false;

      // Load voices for speech synthesis
      if (window.speechSynthesis.getVoices().length === 0) {
        await new Promise(resolve => {
          window.speechSynthesis.onvoiceschanged = resolve;
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      // Create and play ambient background (loops continuously)
      const ambientBuffer = this.generateAmbientBackground(12);
      this.backgroundSource = ctx.createBufferSource();
      this.backgroundSource.buffer = ambientBuffer;
      this.backgroundSource.loop = true;
      
      this.backgroundGainNode = ctx.createGain();
      this.backgroundGainNode.gain.setValueAtTime(0.12, ctx.currentTime); // Very subtle
      
      this.backgroundSource.connect(this.backgroundGainNode);
      this.backgroundGainNode.connect(ctx.destination);
      this.backgroundSource.start(0);

      // Start voice sequence
      this.playVoiceSequence();

      console.log('Voice call audio started successfully');
      return true;
    } catch (error) {
      console.error('Error playing voice call audio:', error);
      return false;
    }
  }

  /**
   * Stop playback
   */
  stop() {
    this.isPlaying = false;
    this.speechPaused = true;

    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }

    // Stop speech synthesis
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (this.utterance) {
      this.utterance = null;
    }

    if (this.backgroundSource) {
      try {
        this.backgroundSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.backgroundSource = null;
    }

    if (this.backgroundGainNode) {
      try {
        this.backgroundGainNode.disconnect();
      } catch (e) {
        // Already disconnected
      }
      this.backgroundGainNode = null;
    }

    console.log('Voice call audio stopped');
  }

  /**
   * Pause voice playback (keep background)
   */
  pauseVoice() {
    this.speechPaused = true;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  /**
   * Resume voice playback
   */
  resumeVoice() {
    this.speechPaused = false;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
const voiceCallAudioService = new VoiceCallAudioService();
export default voiceCallAudioService;
