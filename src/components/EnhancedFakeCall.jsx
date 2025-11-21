/**
 * Enhanced Fake Call Component with all 5 improvements
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, Video, Mic, Settings, Volume2, Battery, Signal, AlertTriangle, User, Calendar, Camera } from 'lucide-react';
import callerProfileService from '../services/callerProfileService';
import emergencyService from '../services/emergencyService';
import videoLibraryService from '../services/videoLibraryService';
import ringtoneService from '../services/ringtoneService';
import { getDeviceStatus, formatCallDuration } from '../utils/deviceStatus';

export const EnhancedFakeCall = ({ onClose }) => {
  // State management
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [callState, setCallState] = useState('idle'); // idle, incoming, active
  const [callDuration, setCallDuration] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState(getDeviceStatus());
  const [emergencyHoldStart, setEmergencyHoldStart] = useState(null);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [currentVideoClip, setCurrentVideoClip] = useState(null);
  const [videoSequence, setVideoSequence] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [selfViewActive, setSelfViewActive] = useState(true);
  const [idleAnimation, setIdleAnimation] = useState('breathing'); // breathing, blinking, nodding
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callerSpeaking, setCallerSpeaking] = useState(false);
  const [lastVoiceLine, setLastVoiceLine] = useState('');
  const [micMuted, setMicMuted] = useState(false);
  
  // Refs
  const audioContextRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);
  const emergencyHoldTimerRef = useRef(null);
  const videoSequenceTimerRef = useRef(null);
  const selfViewVideoRef = useRef(null);
  const voiceResponseTimerRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Load profiles on mount
  useEffect(() => {
    const loadedProfiles = callerProfileService.getAllProfiles();
    setProfiles(loadedProfiles);
    setActiveProfile(callerProfileService.getActiveProfile());

    // Update device status every second
    const statusInterval = setInterval(() => {
      setDeviceStatus(getDeviceStatus());
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Play STRONG ringtone using the ringtone service
  const playRingtone = useCallback(() => {
    ringtoneService.playStrongRingtone();
  }, []);

  const stopRingtone = useCallback(() => {
    ringtoneService.stop();
  }, []);

  // Call actions
  const startIncomingCall = (profileId) => {
    const profile = callerProfileService.getProfile(profileId);
    setActiveProfile(profile);
    setCallState('incoming');
    playRingtone();
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (callState === 'incoming') {
        handleDecline();
      }
    }, 30000);
  };

  const handleAccept = () => {
    stopRingtone();
    setCallState('active');
    setCallDuration(0);
    
    // Load video sequence for realistic playback
    if (activeProfile) {
      const sequence = videoLibraryService.getVideoSequence(activeProfile.id, 120); // 2 minutes
      setVideoSequence(sequence);
      setVideoIndex(0);
      if (sequence.length > 0) {
        setCurrentVideoClip(sequence[0]);
      }
    }
    
    // Start camera for self-view
    startCamera();
    
    // Start voice responses for realistic conversation
    startVoiceResponses();
    
    // Start microphone simulation
    startMicrophoneSimulation();
    
    // Start emergency tracking silently
    emergencyService.startLocationTracking();
    
    // Start idle animation cycle
    startIdleAnimations();
  };

  const handleDecline = () => {
    stopRingtone();
    setCallState('idle');
    setCallDuration(0);
    setVideoSequence([]);
    setVideoIndex(0);
    setCurrentVideoClip(null);
    stopCamera();
    stopVoiceResponses();
    emergencyService.stopLocationTracking();
    stopIdleAnimations();
  };

  // Emergency mode - long press (3 seconds)
  const handleEmergencyHoldStart = () => {
    setEmergencyHoldStart(Date.now());
    emergencyHoldTimerRef.current = setTimeout(() => {
      if (!emergencyTriggered) {
        triggerEmergency();
      }
    }, 3000);
  };

  const handleEmergencyHoldEnd = () => {
    if (emergencyHoldTimerRef.current) {
      clearTimeout(emergencyHoldTimerRef.current);
      emergencyHoldTimerRef.current = null;
    }
    setEmergencyHoldStart(null);
  };

  const triggerEmergency = async () => {
    setEmergencyTriggered(true);
    await emergencyService.triggerEmergency();
    
    // Vibrate for confirmation (discreet)
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Reset after 2 seconds
    setTimeout(() => setEmergencyTriggered(false), 2000);
  };

  // Video sequence player - advance through clips
  useEffect(() => {
    if (callState === 'active' && videoSequence.length > 0 && currentVideoClip) {
      videoSequenceTimerRef.current = setTimeout(() => {
        const nextIndex = (videoIndex + 1) % videoSequence.length;
        setVideoIndex(nextIndex);
        setCurrentVideoClip(videoSequence[nextIndex]);
      }, currentVideoClip.duration * 1000);
    }
    
    return () => {
      if (videoSequenceTimerRef.current) {
        clearTimeout(videoSequenceTimerRef.current);
      }
    };
  }, [callState, videoIndex, currentVideoClip, videoSequence]);

  // Voice response system - makes caller "respond" to user
  const speakVoiceLine = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Load voices first (important for browser compatibility)
      let voices = window.speechSynthesis.getVoices();
      
      // If voices not loaded yet, wait for them
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
        };
      }
      
      // Configure voice based on profile
      if (activeProfile?.id === 'mom') {
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (activeProfile?.id === 'boss') {
        utterance.pitch = 0.8;
        utterance.rate = 1.1;
        const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Alex'));
        if (maleVoice) utterance.voice = maleVoice;
      } else if (activeProfile?.id === 'partner') {
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
      }
      
      utterance.volume = 1.0; // Max volume for clarity
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        console.log('Speaking:', text);
        setCallerSpeaking(true);
        setIdleAnimation('talking');
      };
      
      utterance.onend = () => {
        console.log('Finished speaking');
        setCallerSpeaking(false);
        setIdleAnimation('breathing');
      };
      
      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        setCallerSpeaking(false);
      };
      
      // Speak the text
      console.log('Starting speech synthesis:', text);
      window.speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
    } else {
      console.warn('Speech synthesis not supported');
    }
  }, [activeProfile]);

  // Auto-respond to simulate real conversation
  const startVoiceResponses = useCallback(() => {
    if (!activeProfile) {
      console.warn('No active profile for voice responses');
      return;
    }
    
    console.log('Starting voice responses for:', activeProfile.name);
    
    const respondWithVoiceLine = () => {
      if (callState === 'active' && activeProfile) {
        const voiceLine = activeProfile.getRandomVoiceLine();
        console.log('Generated voice line:', voiceLine);
        setLastVoiceLine(voiceLine);
        speakVoiceLine(voiceLine);
        
        // Schedule next response (random interval 5-15 seconds)
        const nextDelay = 5000 + Math.random() * 10000;
        console.log('Next response in:', nextDelay / 1000, 'seconds');
        voiceResponseTimerRef.current = setTimeout(respondWithVoiceLine, nextDelay);
      }
    };
    
    // First response after 2 seconds
    console.log('Scheduling first response in 2 seconds');
    voiceResponseTimerRef.current = setTimeout(respondWithVoiceLine, 2000);
  }, [activeProfile, callState, speakVoiceLine]);

  const stopVoiceResponses = () => {
    if (voiceResponseTimerRef.current) {
      clearTimeout(voiceResponseTimerRef.current);
      voiceResponseTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallerSpeaking(false);
  };

  // Simulate listening to user's microphone
  const startMicrophoneSimulation = () => {
    micSimulationRef.current = setInterval(() => {
      if (!micMuted && callState === 'active') {
        // Randomly simulate user speaking
        setIsListening(Math.random() > 0.7);
      } else {
        setIsListening(false);
      }
    }, 500);
  };

  const stopMicrophoneSimulation = () => {
    if (micSimulationRef.current) {
      clearInterval(micSimulationRef.current);
    }
  };

  // Camera access for self-view
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      setCameraStream(stream);
      setCameraError(false);
      
      // Attach stream to video element
      if (selfViewVideoRef.current) {
        selfViewVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Update video element when stream changes
  useEffect(() => {
    if (selfViewVideoRef.current && cameraStream) {
      selfViewVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Idle animation controller
  const startIdleAnimations = () => {
    const animations = ['breathing', 'blinking', 'nodding'];
    let animIndex = 0;
    
    const animInterval = setInterval(() => {
      setIdleAnimation(animations[animIndex % animations.length]);
      animIndex++;
    }, 3000); // Change animation every 3 seconds
    
    audioContextRef.current = animInterval; // Reuse ref for cleanup
  };

  const stopIdleAnimations = () => {
    if (audioContextRef.current) {
      clearInterval(audioContextRef.current);
      audioContextRef.current = null;
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopRingtone();
      stopCamera();
      stopVoiceResponses();
      emergencyService.stopLocationTracking();
      stopIdleAnimations();
      if (emergencyHoldTimerRef.current) {
        clearTimeout(emergencyHoldTimerRef.current);
      }
      if (videoSequenceTimerRef.current) {
        clearTimeout(videoSequenceTimerRef.current);
      }
    };
  }, [stopRingtone]);

  // Render incoming call screen
  if (callState === 'incoming') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-black/50">
          <span className="text-white text-sm">{deviceStatus.time}</span>
          <div className="flex items-center gap-3">
            <Signal className="w-4 h-4 text-white" />
            <Battery className="w-4 h-4 text-white" />
            <span className="text-white text-sm">{deviceStatus.battery.level}%</span>
          </div>
        </div>

        {/* Caller Info */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-2xl">
            <span className="text-7xl">{activeProfile?.avatar || '👤'}</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2">{activeProfile?.name || 'Unknown'}</h2>
          <p className="text-lg text-gray-400 mb-1">{activeProfile?.relationship || 'Contact'}</p>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Incoming video call...</span>
          </div>

          {/* Voice line preview */}
          {activeProfile?.voiceLines && activeProfile.voiceLines.length > 0 && (
            <div className="mt-8 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <p className="text-white/80 text-sm italic">
                "{callerProfileService.getRandomVoiceLine(activeProfile.id)}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-12 flex items-center justify-center gap-20">
          <button
            onClick={handleDecline}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
              <Phone className="w-7 h-7 text-white rotate-135" />
            </div>
            <span className="text-white text-sm">Decline</span>
          </button>

          <button
            onClick={handleAccept}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-pulse">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-sm">Accept</span>
          </button>
        </div>
      </div>
    );
  }

  // Render active call screen
  if (callState === 'active') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/80 to-transparent">
          <span className="text-white text-sm">{deviceStatus.time}</span>
          <div className="flex items-center gap-3">
            <Signal className="w-4 h-4 text-white" />
            <Battery className="w-4 h-4 text-white" />
            <span className="text-white text-sm">{deviceStatus.battery.level}%</span>
          </div>
        </div>

        {/* Call Info Bar */}
        <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <div>
            <h3 className="text-white font-semibold text-lg">{activeProfile?.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">{formatCallDuration(callDuration)}</span>
            </div>
          </div>
          <div className="text-white text-sm bg-black/40 px-3 py-1 rounded-full">HD</div>
        </div>

          {/* Video Area */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Main caller video (simulated with animations) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                idleAnimation === 'breathing' ? 'animate-pulse scale-100' : 
                idleAnimation === 'blinking' ? 'opacity-95' :
                idleAnimation === 'nodding' ? 'animate-bounce' : ''
              }`}
            >
              <span className="text-9xl">{activeProfile?.avatar || '👤'}</span>
            </div>
            
            {/* Video clip indicator */}
            {currentVideoClip && (
              <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">
                    {currentVideoClip.type === 'idle' ? '📹 Idle' : 
                     currentVideoClip.type === 'talking' ? '🗣️ Talking' : 
                     currentVideoClip.type === 'nodding' ? '👍 Nodding' : '📹 Live'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Voice status indicator */}
            {callerSpeaking && (
              <div className="absolute top-4 left-4 bg-green-500/20 border border-green-500/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-bold">SPEAKING</span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Self-view with REAL camera feed */}
          {selfViewActive && (
            <div className="absolute top-6 right-6 w-32 h-44 bg-black rounded-2xl border-3 border-cyan-400 overflow-hidden shadow-2xl transform transition-all hover:scale-105">
              {/* Real camera video feed */}
              {cameraStream && !cameraError ? (
                <video
                  ref={selfViewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect like front camera
                />
              ) : (
                <>
                  {/* Fallback when camera not available */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Camera className="w-8 h-8 text-gray-500" />
                    <span className="text-gray-400 text-xs px-2 text-center">
                      {cameraError ? 'Camera unavailable' : 'Loading camera...'}
                    </span>
                  </div>
                </>
              )}
              
              {/* Camera active indicator */}
              {cameraStream && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-[8px] font-medium">LIVE</span>
                </div>
              )}
              
              {/* Flip camera button */}
              <button
                onClick={() => setSelfViewActive(false)}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition-all z-10"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              
              {/* Self-view label */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-white text-[10px] font-medium">You</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Toggle self-view button when hidden */}
          {!selfViewActive && (
            <button
              onClick={() => setSelfViewActive(true)}
              className="absolute top-6 right-6 w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition-all shadow-lg"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          )}          {/* Hidden Emergency Button - Long press on avatar */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            onTouchStart={handleEmergencyHoldStart}
            onTouchEnd={handleEmergencyHoldEnd}
            onMouseDown={handleEmergencyHoldStart}
            onMouseUp={handleEmergencyHoldEnd}
          >
            {emergencyHoldStart && (
              <div className="absolute">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {emergencyTriggered && (
              <div className="absolute bg-red-500/20 rounded-xl px-4 py-2">
                <span className="text-red-400 text-sm font-bold">Emergency Alert Sent</span>
              </div>
            )}
          </div>
        </div>

        {/* Live subtitles / Voice feedback - makes it look real */}
        {lastVoiceLine && callerSpeaking && (
          <div className="absolute bottom-32 left-4 right-4 z-10">
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl px-4 py-3 border border-cyan-500/40 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-cyan-500/30 rounded-full flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-cyan-300 text-xs font-semibold mb-1">{activeProfile?.name}</div>
                  <p className="text-white text-sm leading-relaxed">{lastVoiceLine}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live subtitles - Shows what caller is "saying" */}
        {lastVoiceLine && callerSpeaking && (
          <div className="absolute bottom-32 left-4 right-4 z-10">
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl px-4 py-3 border border-cyan-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-cyan-500/30 rounded-full flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-cyan-300 text-xs font-semibold mb-1">{activeProfile?.name}</div>
                  <p className="text-white text-sm leading-relaxed">{lastVoiceLine}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="px-8 py-8 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => setMicMuted(!micMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative ${
                micMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Mic className="w-6 h-6 text-white" />
              {micMuted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-white rotate-45 rounded"></div>
                </div>
              )}
              {!micMuted && isListening && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-black shadow-lg shadow-green-400/50"></div>
              )}
            </button>
            
            <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Video className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={handleDecline}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/50"
            >
              <Phone className="w-8 h-8 text-white rotate-135" />
            </button>
            
            <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Volume2 className="w-6 h-6 text-white" />
            </button>
            
            <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile selector (idle state)
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Fake Video Call</h1>
        <p className="text-gray-400 text-sm">Select a caller profile to start</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => startIncomingCall(profile.id)}
            className="bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-800/40 hover:from-blue-950/80 hover:border-blue-700/50 rounded-2xl p-6 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">{profile.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{profile.name}</h3>
                <p className="text-gray-400 text-sm">{profile.relationship}</p>
                {profile.voiceLines && profile.voiceLines.length > 0 && (
                  <p className="text-gray-500 text-xs mt-1 italic">
                    {profile.voiceLines.length} voice lines available
                  </p>
                )}
              </div>
              <Phone className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90 leading-relaxed">
          <p className="font-semibold mb-1">Emergency Mode:</p>
          <p>Long-press the caller's avatar during a call to silently alert emergency contacts with your location.</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFakeCall;
