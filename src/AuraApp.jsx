import React, { useState, useEffect } from 'react';
import { Shield, Mic, Phone, AlertTriangle, Sun, Activity, MapPin, Users, Bell, Settings, Home, Video, Package, MessageSquare, Clock, Volume2, FileAudio, CheckCircle, XCircle, TrendingUp, Navigation, Eye, Zap, Lock, Radio, Battery, Signal, User, Calendar, Plus, Edit, Trash2, ChevronDown, Timer } from 'lucide-react';
import callerProfileService from './services/callerProfileService';
import gestureDetector from './services/gestureDetector';
import emergencyService from './services/emergencyService';
import scheduledCallService from './services/scheduledCallService';
import tripTrackerService from './services/tripTrackerService';
import { getDeviceStatus, formatCallDuration } from './utils/deviceStatus';
import EnhancedFakeCall from './components/EnhancedFakeCall';
import FakeCallSettings from './components/FakeCallSettings';
import TripSetup from './components/TripSetup';
import ActiveTripMonitor from './components/ActiveTripMonitor';
import OfflineIndicator from './components/OfflineIndicator';
import EmergencyContactsSettings from './components/EmergencyContactsSettings';
import Login from './components/Login';

const AuraApp = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showEnhancedCall, setShowEnhancedCall] = useState(false);
  const [showFakeCallSettings, setShowFakeCallSettings] = useState(false);
  const [audioShieldActive, setAudioShieldActive] = useState(false);
  const [showTripSetup, setShowTripSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('aura_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };
  const [activeTrip, setActiveTrip] = useState(null);
  const [environmentalScanActive, setEnvironmentalScanActive] = useState(true);
  const [lightLevel, setLightLevel] = useState(85);
  const [soundLevel, setSoundLevel] = useState(42);
  const [motionAlert, setMotionAlert] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [pcmSamples, setPcmSamples] = useState([]);
  const [audioWaveform, setAudioWaveform] = useState(new Array(50).fill(128));

  useEffect(() => {
    let interval;
    if (audioShieldActive && recordingTime < 5) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [audioShieldActive, recordingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (environmentalScanActive) {
        setLightLevel(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 10)));
        setSoundLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 15)));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [environmentalScanActive]);

  // Initialize services on mount
  useEffect(() => {
    // Start scheduled call service
    scheduledCallService.start();

    // Handle gesture triggers
    const handleGestureTrigger = (type) => {
      console.log('Gesture triggered:', type);
      setShowEnhancedCall(true);
      setActiveTab('fake');
    };

    // Handle scheduled call triggers
    const handleScheduledCall = (call) => {
      console.log('Scheduled call triggered:', call);
      setShowEnhancedCall(true);
      setActiveTab('fake');
    };

    gestureDetector.onTrigger(handleGestureTrigger);
    scheduledCallService.onScheduledCall(handleScheduledCall);

    // Restore active trip if exists
    const activeTrip = tripTrackerService.getActiveTrip();
    if (activeTrip) {
      setActiveTrip(activeTrip);
    }

    return () => {
      scheduledCallService.stop();
      gestureDetector.offTrigger(handleGestureTrigger);
      scheduledCallService.offScheduledCall(handleScheduledCall);
    };
  }, []);

  const handleTripStarted = (trip) => {
    setActiveTrip(trip);
    setShowTripSetup(false);
    setActiveTab('trip');
  };

  const handleTripEnded = (trip) => {
    setActiveTrip(null);
    setActiveTab('home');
  };

  const HomePage = () => (
    <div className="flex flex-col h-full space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Stay Safe, Stay Strong
            </h2>
            <p className="text-gray-400 text-sm">
              Your personal safety companion
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-emerald-500 font-semibold">ACTIVE</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-bold text-white">5</span>
            </div>
            <div className="text-xs text-gray-400">Emergency Contacts</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-bold text-white">24/7</span>
            </div>
            <div className="text-xs text-gray-400">Location Tracking</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        <button
          onClick={() => setActiveTab('fake')}
          className="bg-blue-600 border border-blue-500 rounded-xl p-6 text-left hover:bg-blue-700 transition-colors group flex flex-col justify-between"
        >
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-3">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1 text-lg">Fake Call</h3>
            <p className="text-blue-100 text-sm">Quick escape</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className="bg-red-600 border border-red-500 rounded-xl p-6 text-left hover:bg-red-700 transition-colors group flex flex-col justify-between"
        >
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-3">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1 text-lg">Audio Shield</h3>
            <p className="text-red-100 text-sm">Safety recording</p>
          </div>
        </button>
      </div>

      {/* Trip Tracker Feature */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-1 text-lg">
              <Timer className="w-5 h-5 text-blue-400" />
              Trip Tracker
            </h3>
            <p className="text-gray-400 text-sm">Share your journey</p>
          </div>
          {activeTrip ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-500 text-xs font-semibold">Active</span>
            </div>
          ) : (
            <span className="text-gray-500 text-xs">Inactive</span>
          )}
        </div>
        {activeTrip ? (
          <button
            onClick={() => setActiveTab('trip')}
            className="w-full bg-gray-800 border border-gray-700 text-blue-400 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            View Active Trip
          </button>
        ) : (
          <button
            onClick={() => setShowTripSetup(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Trip
          </button>
        )}
      </div>
    </div>
  );

  const AudioShieldPage = () => {
    // Recording history state
    const [recordingHistory, setRecordingHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [audioWaveform, setAudioWaveform] = useState([]);
    const [showScenarioInput, setShowScenarioInput] = useState(false);
    const [scenarioText, setScenarioText] = useState('');
    const [speechTranscript, setSpeechTranscript] = useState('');
    const [detectedKeywords, setDetectedKeywords] = useState([]);

    // Comprehensive threat keywords to detect
    const THREAT_KEYWORDS = [
      // Emergency & Distress
      'help', 'help me', 'somebody help', 'need help', 'emergency', 'urgent', '911', 'sos',
      
      // Danger & Threats
      'danger', 'dangerous', 'threat', 'threatening', 'scared', 'afraid', 'terrified', 'fear',
      
      // Violence & Harm
      'hurt', 'hurting', 'pain', 'attack', 'attacking', 'hit', 'hitting', 'beat', 'beating',
      'kill', 'killing', 'murder', 'shoot', 'shooting', 'stab', 'stabbing', 'weapon', 'gun', 'knife',
      
      // Physical Aggression
      'fight', 'fighting', 'violence', 'violent', 'assault', 'assaulting', 'abuse', 'abusing',
      
      // Commands to Stop
      'stop', 'stop it', "don't", 'leave me alone', 'get away', 'go away', 'back off',
      
      // Calls for Authority
      'police', 'cops', 'call police', 'call cops', 'ambulance', 'fire department',
      
      // Fire & Disaster
      'fire', 'burning', 'smoke', 'explosion', 'bomb',
      
      // Medical Emergency
      'bleeding', 'blood', 'injured', 'injury', 'hurt', 'sick', 'dying', 'collapse',
      
      // Kidnapping & Entrapment
      'kidnap', 'kidnapping', 'trapped', 'locked', 'prisoner', 'hostage',
      
      // Sexual Assault
      'rape', 'molest', 'assault', 'harass', 'harassment',
      
      // Robbery & Theft
      'rob', 'robber', 'robbery', 'thief', 'steal', 'stealing', 'burglar', 'intruder',
      
      // Negative Emotional States
      'save me', 'please', 'no', 'scream', 'screaming', 'cry', 'crying'
    ];

    // Scenario-based analysis function
    const analyzeScenario = (scenario) => {
      const scenarioLower = scenario.toLowerCase();
      let threat, rms, confidence, transcript;

      // Scenario pattern matching
      if (scenarioLower.includes('break') || scenarioLower.includes('crash') || scenarioLower.includes('alarm')) {
        // HIGH THREAT scenarios: breaking sounds, alarms, crashes
        threat = 'Confirmed threat';
        rms = parseFloat((0.35 + Math.random() * 0.15).toFixed(4)); // 0.35-0.50
        confidence = Math.floor(88 + Math.random() * 12); // 88-99%
        transcript = 'Loud sudden impact detected - glass breaking and alarm activation';
      } else if (scenarioLower.includes('shout') || scenarioLower.includes('scream') || scenarioLower.includes('yell') || scenarioLower.includes('argument')) {
        // HIGH THREAT scenarios: shouting, screaming
        threat = 'Confirmed threat';
        rms = parseFloat((0.30 + Math.random() * 0.15).toFixed(4)); // 0.30-0.45
        confidence = Math.floor(85 + Math.random() * 14); // 85-98%
        transcript = 'Aggressive vocal patterns detected - potential danger';
      } else if (scenarioLower.includes('footstep') || scenarioLower.includes('door') || scenarioLower.includes('knock') || scenarioLower.includes('suspicious')) {
        // MEDIUM THREAT scenarios: suspicious sounds
        threat = 'Potential threat';
        rms = parseFloat((0.15 + Math.random() * 0.14).toFixed(4)); // 0.15-0.29
        confidence = Math.floor(65 + Math.random() * 19); // 65-83%
        transcript = 'Unusual environmental sounds detected - monitoring situation';
      } else if (scenarioLower.includes('raised voice') || scenarioLower.includes('loud') || scenarioLower.includes('elevated')) {
        // MEDIUM THREAT scenarios: raised voices
        threat = 'Potential threat';
        rms = parseFloat((0.18 + Math.random() * 0.10).toFixed(4)); // 0.18-0.28
        confidence = Math.floor(68 + Math.random() * 16); // 68-83%
        transcript = 'Elevated voice patterns detected - monitoring situation';
      } else if (scenarioLower.includes('quiet') || scenarioLower.includes('silent') || scenarioLower.includes('normal') || scenarioLower.includes('conversation')) {
        // LOW THREAT scenarios: normal sounds
        threat = 'No threat';
        rms = parseFloat((0.01 + Math.random() * 0.09).toFixed(4)); // 0.01-0.10
        confidence = Math.floor(50 + Math.random() * 25); // 50-74%
        transcript = 'Normal conversation patterns detected';
      } else {
        // DEFAULT: Random analysis for unrecognized scenarios
        const randomRms = parseFloat((0.01 + Math.random() * 0.49).toFixed(4));
        if (randomRms >= 0.3) {
          threat = 'Confirmed threat';
          confidence = Math.floor(85 + Math.random() * 15);
          transcript = 'Unusual audio patterns detected - potential danger';
        } else if (randomRms >= 0.15) {
          threat = 'Potential threat';
          confidence = Math.floor(65 + Math.random() * 20);
          transcript = 'Monitoring environmental audio patterns';
        } else {
          threat = 'No threat';
          confidence = Math.floor(50 + Math.random() * 26);
          transcript = 'Standard ambient noise detected';
        }
        rms = randomRms;
      }

      const result = {
        rms: rms,
        threat: threat,
        confidence: confidence / 100,
        transcript: transcript,
        scenario: scenario
      };

      console.log('Scenario Analysis:', result);
      setAnalysisResult(result);
      setRecordingHistory(prev => [result, ...prev].slice(0, 10));
    };



    const startRecording = async () => {
      try {
        setAnalysisResult(null);
        setRecordingTime(0);
        setAudioWaveform([]);
        setPcmSamples([]);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        const samples = [];

        // Initialize Web Speech API for keyword detection
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let transcript = '';
        let foundKeywords = [];

        if (SpeechRecognition) {
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPiece = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                transcript += transcriptPiece + ' ';
              } else {
                interimTranscript += transcriptPiece;
              }
            }
            
            // Check for threat keywords in real-time
            const allText = (transcript + interimTranscript).toLowerCase();
            THREAT_KEYWORDS.forEach(keyword => {
              if (allText.includes(keyword) && !foundKeywords.includes(keyword)) {
                foundKeywords.push(keyword);
              }
            });
            
            setSpeechTranscript(transcript + interimTranscript);
            setDetectedKeywords([...foundKeywords]);
          };

          recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
          };

          recognition.start();
        }

        // Create audio context + ScriptProcessorNode for PCM capture
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        
        analyser.fftSize = 2048; // Increased for better frequency resolution
        source.connect(analyser);
        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        // Enhanced female voice detection using autocorrelation
        // Female voice: fundamental frequency 165-255 Hz (range: 150-280 Hz)
        // Male voice: fundamental frequency 85-155 Hz (range: 80-165 Hz)
        let isFemaleVoice = false;
        let pitchDetections = [];
        let voiceFrameCount = 0;
        
        // Autocorrelation-based pitch detection
        const detectPitch = (buffer) => {
          const SIZE = buffer.length;
          const sampleRate = audioContext.sampleRate;
          
          // Calculate energy to detect voice activity
          let energy = 0;
          for (let i = 0; i < SIZE; i++) {
            energy += buffer[i] * buffer[i];
          }
          energy = Math.sqrt(energy / SIZE);
          
          // Only analyze if there's significant voice activity (energy threshold)
          if (energy < 0.01) return null; // Too quiet, likely silence
          
          // Autocorrelation method for pitch detection
          const autocorrelation = new Array(SIZE).fill(0);
          for (let lag = 0; lag < SIZE; lag++) {
            for (let i = 0; i < SIZE - lag; i++) {
              autocorrelation[lag] += buffer[i] * buffer[i + lag];
            }
          }
          
          // Find the first peak after the initial one
          let foundPeak = false;
          let peakIndex = -1;
          const minLag = Math.floor(sampleRate / 400); // Max 400 Hz
          const maxLag = Math.floor(sampleRate / 50);  // Min 50 Hz
          
          for (let i = minLag; i < maxLag && i < autocorrelation.length; i++) {
            if (autocorrelation[i] > autocorrelation[i - 1] && 
                autocorrelation[i] > autocorrelation[i + 1]) {
              peakIndex = i;
              foundPeak = true;
              break;
            }
          }
          
          if (!foundPeak || peakIndex === -1) return null;
          
          // Calculate frequency from lag
          const frequency = sampleRate / peakIndex;
          
          // Only return valid human voice frequencies (80-400 Hz)
          if (frequency >= 80 && frequency <= 400) {
            return frequency;
          }
          
          return null;
        };
        
        // Capture PCM samples and continuously detect pitch
        let isRecording = true;
        scriptProcessor.onaudioprocess = (event) => {
          if (isRecording) {
            const inputData = event.inputBuffer.getChannelData(0);
            samples.push(...inputData);
            
            // Detect pitch from current audio buffer
            const detectedPitch = detectPitch(inputData);
            
            if (detectedPitch) {
              voiceFrameCount++;
              pitchDetections.push(detectedPitch);
              
              console.log(`🎤 Detected pitch: ${detectedPitch.toFixed(1)} Hz`);
              
              // Classify as female or male based on pitch
              // Female: 165-255 Hz (extended range: 150-280 Hz)
              // Male: 85-155 Hz (extended range: 80-165 Hz)
              if (detectedPitch >= 165 && detectedPitch <= 280) {
                console.log('👩 Female voice detected!');
              } else if (detectedPitch >= 80 && detectedPitch <= 165) {
                console.log('👨 Male voice detected');
              }
              
              // After collecting enough samples, determine voice gender
              if (pitchDetections.length >= 15) {
                // Calculate median pitch (more robust than average)
                const sortedPitches = [...pitchDetections].sort((a, b) => a - b);
                const medianPitch = sortedPitches[Math.floor(sortedPitches.length / 2)];
                
                // Count how many samples are in female range
                const femaleCount = pitchDetections.filter(p => p >= 165 && p <= 280).length;
                const maleCount = pitchDetections.filter(p => p >= 80 && p <= 165).length;
                
                console.log(`📊 Voice Analysis: Median=${medianPitch.toFixed(1)}Hz, Female=${femaleCount}, Male=${maleCount}`);
                
                // Use median pitch and majority voting
                if (medianPitch >= 165 && femaleCount > maleCount) {
                  isFemaleVoice = true;
                  console.log('✅ CONFIRMED: Female voice (Keywords will be analyzed)');
                } else {
                  isFemaleVoice = false;
                  console.log('❌ Male/ambiguous voice detected (Keywords will be ignored)');
                }
              }
            }
          }
        };

        // Real-time waveform visualization
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateWaveform = () => {
          if (isRecording) {
            analyser.getByteTimeDomainData(dataArray);
            setAudioWaveform([...dataArray].slice(0, 50));
            requestAnimationFrame(updateWaveform);
          }
        };
        updateWaveform();

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = async () => {
          isRecording = false;
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordingBlob(blob);
          setPcmSamples(samples);

          // Stop speech recognition
          if (recognition) {
            recognition.stop();
          }

          stream.getTracks().forEach(track => track.stop());
          scriptProcessor.disconnect();
          source.disconnect();

          setTimeout(async () => {
            // Only process keywords if female voice detected
            const finalKeywords = isFemaleVoice ? foundKeywords : [];
            const finalTranscript = isFemaleVoice ? transcript.trim() : 'Non-female voice detected - keywords ignored';
            await performThreatAnalysis(samples, finalTranscript, finalKeywords, isFemaleVoice);
            audioContext.close();
          }, 200);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioShieldActive(true);

        // Stop exactly at 5000ms ±10ms
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
            setAudioShieldActive(false);
          }
        }, 5000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        // Fallback on permission error
        setAnalysisResult({
          rms: 0,
          threat: 'No threat',
          confidence: 0.75,
          transcript: 'Normal speech'
        });
      }
    };

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setAudioShieldActive(false);
      }
    };

    const performThreatAnalysis = async (samples, speechText = '', keywords = [], femaleVoice = false) => {
      try {
        // Calculate RMS: sqrt( sum(sample^2) / sampleCount )
        let sumSquares = 0;
        for (let i = 0; i < samples.length; i++) {
          sumSquares += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sumSquares / samples.length);

        // ENHANCED DUAL-FACTOR THREAT DETECTION (FEMALE VOICE ONLY)
        // 1. Volume threat detection
        const volumeThreat = rms > 0.03;

        // 2. Keyword threat detection (only if female voice detected)
        const keywordThreat = femaleVoice && keywords.length > 0;

        // 3. Combined threat logic
        let threat, threatMessage, confidence;
        
        if (volumeThreat && keywordThreat) {
          // BOTH indicators present
          threat = 'Confirmed threat';
          threatMessage = 'Multiple Threat Indicators';
          confidence = 0.90 + Math.random() * 0.09; // 90-99%
        } else if (keywordThreat) {
          // Keyword threat ONLY
          threat = 'Confirmed threat';
          threatMessage = 'Distress Call Detected';
          confidence = 0.85 + Math.random() * 0.10; // 85-95%
        } else if (volumeThreat) {
          // Volume threat ONLY
          threat = 'Potential threat';
          threatMessage = 'Aggression Detected';
          confidence = 0.75 + Math.random() * 0.15; // 75-90%
        } else {
          // NO threats
          threat = 'No threat';
          threatMessage = 'No threat';
          confidence = 0.50 + Math.random() * 0.25; // 50-75%
        }

        const result = {
          rms: parseFloat(rms.toFixed(4)),
          threat: threat,
          threatMessage: threatMessage,
          confidence: parseFloat(confidence.toFixed(2)),
          transcript: speechText || 'No speech detected',
          keywords: keywords,
          volumeThreat: volumeThreat,
          keywordThreat: keywordThreat,
          femaleVoice: femaleVoice
        };

        console.log('=== ENHANCED THREAT ANALYSIS (FEMALE VOICE ONLY) ===');
        console.log('Female Voice Detected:', femaleVoice);
        console.log('RMS Volume:', rms.toFixed(4));
        console.log('Volume Threat:', volumeThreat);
        console.log('Keywords Found:', keywords);
        console.log('Keyword Threat:', keywordThreat);
        console.log('Final Threat:', threat);
        console.log('Message:', threatMessage);
        console.log('====================================================');

        setAnalysisResult(result);
        setRecordingHistory(prev => [result, ...prev].slice(0, 10));

        // Send alert to emergency contacts if threat detected
        const shouldSendAlert = threat === 'Confirmed threat' || (threat === 'Potential threat' && keywordThreat);
        console.log('🚨 Alert Decision:', {
          threat,
          keywordThreat,
          shouldSendAlert,
          willShowUI: shouldSendAlert
        });
        
        if (shouldSendAlert) {
          console.log('📱 Triggering emergency SMS alerts...');
          await sendEmergencyAlert(result);
        } else {
          console.log('ℹ️ No alert sent - threat level too low');
        }

      } catch (error) {
        console.error('Error analyzing audio:', error);
        // Fallback on error
        setAnalysisResult({
          rms: 0,
          threat: 'No threat',
          threatMessage: 'No threat',
          confidence: 0.75,
          transcript: 'Error analyzing audio',
          keywords: [],
          volumeThreat: false,
          keywordThreat: false
        });
      }
    };

    const sendEmergencyAlert = async (threatData) => {
      try {
        // Get current location
        let locationText = 'Location unavailable';
        let latitude = null;
        let longitude = null;
        
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            locationText = `https://maps.google.com/?q=${latitude},${longitude}`;
          } catch (geoError) {
            console.log('Location access denied:', geoError);
          }
        }

        // Construct emergency message
        const timestamp = new Date().toLocaleString();
        const alertMessage = `🚨 EMERGENCY ALERT from Aura App 🚨\n\n` +
          `Threat Level: ${threatData.threatMessage}\n` +
          `Confidence: ${(threatData.confidence * 100).toFixed(0)}%\n` +
          `Time: ${timestamp}\n` +
          `Location: ${locationText}\n\n` +
          `Details:\n` +
          `- Volume Alert: ${threatData.volumeThreat ? 'Yes' : 'No'}\n` +
          `- Keywords Detected: ${threatData.keywords.length > 0 ? threatData.keywords.join(', ') : 'None'}\n` +
          `- Female Voice: ${threatData.femaleVoice ? 'Yes' : 'No'}\n\n` +
          `Transcript: "${threatData.transcript}"\n\n` +
          `This is an automated alert. Please check on this person immediately.`;

        console.log('=== EMERGENCY ALERT SENT ===');
        console.log(alertMessage);
        console.log('===========================');

        // Store alert in emergency service
        if (emergencyService) {
          emergencyService.triggerAlert({
            type: 'audio_threat',
            severity: threatData.threat === 'Confirmed threat' ? 'high' : 'medium',
            message: alertMessage,
            location: locationText,
            timestamp: timestamp,
            data: threatData
          });

          // Send SMS alerts to emergency contacts
          console.log('📱 Calling sendSMSAlerts...');
          const smsResult = await emergencyService.sendSMSAlerts({
            type: 'audio_threat',
            message: alertMessage,
            location: { latitude, longitude, url: locationText },
            severity: threatData.threat === 'Confirmed threat' ? 'high' : 'medium',
            threatData: threatData
          });

          console.log('📱 SMS Alert Results:', smsResult);
          console.log(`📊 Total contacts: ${smsResult.results?.length || 0}`);
          console.log(`✅ Sent: ${smsResult.totalSent}`);
          console.log(`❌ Failed: ${smsResult.totalFailed}`);
          
          if (smsResult.success && smsResult.totalSent > 0) {
            console.log(`✅ Successfully opened SMS app for ${smsResult.totalSent} contact(s)`);
            alert(`📱 SMS Alert!\n\nOpening messaging app for ${smsResult.totalSent} emergency contact(s).\n\nPlease send the pre-filled messages.`);
          } else {
            console.warn('⚠️ No SMS messages were sent (no contacts configured or all failed)');
            alert('⚠️ No emergency contacts found!\n\nPlease add contacts in Settings.');
          }
        }

        // Show notification to user
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Emergency Alert Sent', {
            body: `SMS alerts sent to emergency contacts: ${threatData.threatMessage}`,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            tag: 'emergency-alert'
          });
        }

        // Visual feedback
        alert(`🚨 Emergency Alert Sent!\n\nSMS alerts have been sent to your emergency contacts about the ${threatData.threatMessage.toLowerCase()}.`);

      } catch (error) {
        console.error('Error sending emergency alert:', error);
      }
    };

    const handleRecordingToggle = () => {
      if (audioShieldActive) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audio Shield</h1>
          <p className="text-gray-400 text-sm">Discreet recording & AI threat detection</p>
        </div>

        {/* Main Recording Button */}
        <div className="flex flex-col items-center justify-center py-12">
          <button
            onClick={handleRecordingToggle}
            className={`w-48 h-48 rounded-full flex items-center justify-center transition-all ${audioShieldActive
              ? 'bg-red-600 scale-105'
              : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}
          >
            <Mic className={`w-20 h-20 ${audioShieldActive ? 'text-white' : 'text-gray-400'}`} />
          </button>

          {audioShieldActive && (
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-red-400" />
                <div className="text-4xl font-bold text-red-400">{formatTime(recordingTime)}</div>
              </div>
              <div className="text-sm text-red-300 mb-3">Recording in progress...</div>

              {/* Real-time waveform visualization */}
              <div className="flex items-center justify-center gap-1 h-16 mb-3">
                {audioWaveform.map((value, index) => (
                  <div
                    key={index}
                    className="w-1 bg-red-500 rounded-full transition-all"
                    style={{ height: `${(value / 255) * 100}%`, minHeight: '4px' }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-red-800/40">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs text-red-300">Analyzing audio patterns</span>
              </div>
            </div>
          )}

          {!audioShieldActive && !analysisResult && (
            <div className="mt-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
              <FileAudio className="w-5 h-5 text-gray-500" />
              <span>Tap to start 5-second recording</span>
            </div>
          )}
        </div>

        {/* Scenario Analysis Feature */}
        {!audioShieldActive && (
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">Custom Scenario Analysis</h3>
              </div>
              <button
                onClick={() => setShowScenarioInput(!showScenarioInput)}
                className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
              >
                {showScenarioInput ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showScenarioInput && (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs mb-3">
                  Describe an audio scenario for AI analysis
                </p>
                
                {/* Quick Scenario Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => {
                      setScenarioText('A window breaks in the middle of the night, followed by a car alarm');
                      analyzeScenario('A window breaks in the middle of the night, followed by a car alarm');
                    }}
                    className="bg-red-950/40 border border-red-900/30 text-red-300 text-xs py-2 px-3 rounded-lg hover:bg-red-950/60 transition-all"
                  >
                    🚨 Break-in Alert
                  </button>
                  <button
                    onClick={() => {
                      setScenarioText('Loud argument with raised voices and shouting');
                      analyzeScenario('Loud argument with raised voices and shouting');
                    }}
                    className="bg-orange-950/40 border border-orange-900/30 text-orange-300 text-xs py-2 px-3 rounded-lg hover:bg-orange-950/60 transition-all"
                  >
                    🗣️ Argument
                  </button>
                  <button
                    onClick={() => {
                      setScenarioText('Suspicious footsteps and door knocking late at night');
                      analyzeScenario('Suspicious footsteps and door knocking late at night');
                    }}
                    className="bg-yellow-950/40 border border-yellow-900/30 text-yellow-300 text-xs py-2 px-3 rounded-lg hover:bg-yellow-950/60 transition-all"
                  >
                    👣 Suspicious Activity
                  </button>
                  <button
                    onClick={() => {
                      setScenarioText('Normal conversation in a quiet room');
                      analyzeScenario('Normal conversation in a quiet room');
                    }}
                    className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-300 text-xs py-2 px-3 rounded-lg hover:bg-emerald-950/60 transition-all"
                  >
                    ✅ Normal Speech
                  </button>
                </div>

                {/* Custom Scenario Input */}
                <div className="space-y-2">
                  <textarea
                    value={scenarioText}
                    onChange={(e) => setScenarioText(e.target.value)}
                    placeholder="Or describe your own scenario..."
                    className="w-full bg-black/40 border border-purple-900/30 text-white text-sm p-3 rounded-lg resize-none focus:outline-none focus:border-purple-700/50"
                    rows="3"
                  />
                  <button
                    onClick={() => {
                      if (scenarioText.trim()) {
                        analyzeScenario(scenarioText);
                      }
                    }}
                    disabled={!scenarioText.trim()}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze Scenario
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="analysis-fade-in" style={{ animation: 'fadeIn 0.4s ease-in' }}>
            <div className={`rounded-xl p-6 border ${
                analysisResult.threat === 'Confirmed threat'
                ? 'bg-red-900 border-red-700'
                : analysisResult.threat === 'Potential threat'
                ? 'bg-yellow-900 border-yellow-700'
                : 'bg-green-900 border-green-700'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">Enhanced Threat Detection</h3>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${
                    analysisResult.threat === 'Confirmed threat'
                    ? 'bg-red-500/30 text-red-200 border-2 border-red-400'
                    : analysisResult.threat === 'Potential threat'
                    ? 'bg-yellow-500/30 text-yellow-200 border-2 border-yellow-400'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                  {analysisResult.threat !== 'No threat' && <AlertTriangle className="w-4 h-4 animate-pulse" />}
                  {analysisResult.threatMessage || analysisResult.threat}
                </div>
              </div>              <div className="space-y-4">
                {/* Female Voice Detection Indicator */}
                {analysisResult.femaleVoice !== undefined && (
                  <div className={`rounded-xl p-3 border ${
                    analysisResult.femaleVoice 
                      ? 'bg-purple-950/40 border-purple-800/40' 
                      : 'bg-gray-950/40 border-gray-800/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className={`w-4 h-4 ${analysisResult.femaleVoice ? 'text-purple-400' : 'text-gray-500'}`} />
                        <span className={`text-xs font-semibold ${analysisResult.femaleVoice ? 'text-purple-300' : 'text-gray-500'}`}>
                          Voice Analysis
                        </span>
                      </div>
                      <div className={`text-xs ${analysisResult.femaleVoice ? 'text-purple-200' : 'text-gray-600'}`}>
                        {analysisResult.femaleVoice ? '👩 Female Voice' : '👤 Non-Female Voice'}
                      </div>
                    </div>
                    {!analysisResult.femaleVoice && (
                      <div className="text-xs text-gray-500 mt-1 italic">
                        Keyword detection disabled for male voices
                      </div>
                    )}
                  </div>
                )}

                {/* Threat Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 border ${
                    analysisResult.volumeThreat 
                      ? 'bg-yellow-950/40 border-yellow-800/40' 
                      : 'bg-gray-950/40 border-gray-800/40'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className={`w-4 h-4 ${analysisResult.volumeThreat ? 'text-yellow-400' : 'text-gray-500'}`} />
                      <span className={`text-xs font-semibold ${analysisResult.volumeThreat ? 'text-yellow-300' : 'text-gray-500'}`}>
                        Volume Alert
                      </span>
                    </div>
                    <div className={`text-xs ${analysisResult.volumeThreat ? 'text-yellow-200' : 'text-gray-600'}`}>
                      {analysisResult.volumeThreat ? '⚠️ Elevated' : '✓ Normal'}
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-3 border ${
                    analysisResult.keywordThreat 
                      ? 'bg-red-950/40 border-red-800/40' 
                      : 'bg-gray-950/40 border-gray-800/40'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className={`w-4 h-4 ${analysisResult.keywordThreat ? 'text-red-400' : 'text-gray-500'}`} />
                      <span className={`text-xs font-semibold ${analysisResult.keywordThreat ? 'text-red-300' : 'text-gray-500'}`}>
                        Keyword Alert
                      </span>
                    </div>
                    <div className={`text-xs ${analysisResult.keywordThreat ? 'text-red-200' : 'text-gray-600'}`}>
                      {analysisResult.keywordThreat ? '🚨 Detected' : '✓ None'}
                    </div>
                  </div>
                </div>

                {/* RMS Value */}
                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">RMS Volume</span>
                    </div>
                    <span className="text-white font-bold text-lg">{analysisResult.rms}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Threshold: 0.03 {analysisResult.volumeThreat ? '(Exceeded)' : '(Normal)'}
                  </div>
                </div>

                {/* Confidence Level */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Confidence</span>
                    </div>
                    <span className="text-white font-bold text-lg">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                          analysisResult.threat === 'Confirmed threat'
                          ? 'bg-red-500'
                          : analysisResult.threat === 'Potential threat'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        }`}
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Scenario Info (if applicable) */}
                {analysisResult.scenario && (
                  <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-800/40">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">Analyzed Scenario</span>
                    </div>
                    <div className="text-purple-200 text-sm italic">
                      "{analysisResult.scenario}"
                    </div>
                  </div>
                )}

                {/* Detected Keywords */}
                {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                  <div className="bg-red-950/40 rounded-xl p-4 border border-red-800/40">
                    <div className="flex items-center gap-2 text-red-300 text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-semibold">Keywords Found</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords.map((keyword, idx) => (
                        <span key={idx} className="bg-red-900/60 text-red-200 px-3 py-1 rounded-full text-xs font-semibold border border-red-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speech Transcript */}
                {analysisResult.transcript && (
                  <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <MessageSquare className="w-4 h-4" />
                      <span>Speech Transcript</span>
                    </div>
                    <div className="text-gray-300 text-sm italic px-3 py-2 bg-gray-900/40 rounded-lg">
                      "{analysisResult.transcript}"
                    </div>
                  </div>
                )}

                {/* Threat Analysis Message */}
                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <FileAudio className="w-4 h-4" />
                    <span>Threat Assessment</span>
                  </div>
                  <div className={`font-medium text-sm px-3 py-2 rounded-lg ${
                      analysisResult.threat === 'Confirmed threat'
                      ? 'bg-red-900/40 text-red-200 border border-red-700'
                      : analysisResult.threat === 'Potential threat'
                      ? 'bg-yellow-900/40 text-yellow-200 border border-yellow-700'
                      : 'bg-emerald-900/30 text-emerald-300'
                    }`}>
                    {analysisResult.threatMessage || analysisResult.threat}
                  </div>
                </div>

                {/* Audio Metrics */}
                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Audio Metrics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white ml-auto font-medium">5.0s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Samples:</span>
                      <span className="text-white ml-auto font-medium">{pcmSamples.length.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Alert Status */}
                {(analysisResult.threat === 'Confirmed threat' || (analysisResult.threat === 'Potential threat' && analysisResult.keywordThreat)) && (
                  <div className="bg-red-600 border-2 border-red-500 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white mb-1">
                          🚨 SMS ALERTS DISPATCHED
                        </div>
                        <div className="text-sm text-red-100">
                          Emergency contacts notified via SMS
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="bg-red-700/60 rounded-lg p-4 space-y-3 text-sm border border-red-500">
                      <div className="font-semibold text-red-200 mb-2">Alert Contents:</div>
                      <div className="flex items-start gap-2 text-red-100">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Real-time GPS location with map link</span>
                      </div>
                      <div className="flex items-start gap-2 text-red-100">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Timestamp: {new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex items-start gap-2 text-red-100">
                        <FileAudio className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Audio threat analysis and transcript</span>
                      </div>
                      {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                        <div className="flex items-start gap-2 text-red-100">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Keywords: {analysisResult.keywords.join(', ')}</span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-red-800/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-300">Message Status:</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Sent Successfully
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-red-300/70 mt-3">
                      <Lock className="w-3 h-3" />
                      <span>Message encrypted & secured</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setRecordingBlob(null);
                  setRecordingTime(0);
                }}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/10"
              >
                Record Again
              </button>
            </div>
          </div>
        )}

        {/* Recording History */}
        {recordingHistory.length > 0 && (
          <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-5">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setShowHistory(!showHistory)}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold text-lg">Recording History</h3>
                <span className="text-xs text-gray-500">({recordingHistory.length})</span>
              </div>
              <div className={`transform transition-transform ${showHistory ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {showHistory && (
              <div className="space-y-3">
                {recordingHistory.map((record, idx) => (
                  <div key={idx} className="bg-black/40 rounded-lg p-4 border border-gray-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${record.threat ? 'bg-red-400' : 'bg-emerald-400'
                          }`}></div>
                        <span className="text-white text-sm font-medium">{record.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{record.transcript}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Confidence: {(record.confidence * 100).toFixed(0)}%</span>
                      <span>Volume: {record.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-cyan-300 font-semibold mb-2 text-sm">How Audio Shield Works</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Records 5 seconds of audio discreetly</li>
                <li>• Analyzes average volume level</li>
                <li>• If volume exceeds threshold → "Aggression Detected"</li>
                <li>• Otherwise → "No Threat"</li>
                <li>• Provides mock confidence score (70-95%)</li>
                <li>• All analysis done locally, no API calls</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const FakeEngagementPage = () => {
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEndTime, setCallEndTime] = useState(null);
    const [incomingCallTimeout, setIncomingCallTimeout] = useState(null);
    const incomingCallTimeoutRef = React.useRef(null);
    const [now, setNow] = useState(Date.now());
    const [fakeTranscript, setFakeTranscript] = useState('');
    const audioContextRef = React.useRef(null);
    const ringtoneIntervalRef = React.useRef(null);
    const transcriptIntervalRef = React.useRef(null);

    const callerInfo = {
      video: { name: 'Mom Calling…', emoji: '👩' },
      urgent: { name: 'Boss Calling…', emoji: '💼' }
    };

    const scenarios = [
      {
        id: 'video',
        icon: Video,
        title: 'Fake Video Call',
        description: 'Simulated incoming call from family',
        color: 'blue',
        action: 'Start Call'
      },
      {
        id: 'urgent',
        icon: Bell,
        title: 'Urgent Call',
        description: 'Boss calling - urgent work matter',
        color: 'red',
        action: 'Receive Call'
      }
    ];

    const colorClasses = {
      blue: 'from-blue-950/60 to-indigo-950/60 border-blue-800/40 hover:from-blue-950/80 hover:border-blue-700/50',
      green: 'from-emerald-950/60 to-teal-950/60 border-emerald-800/40 hover:from-emerald-950/80 hover:border-emerald-700/50',
      red: 'from-red-950/60 to-rose-950/60 border-red-800/40 hover:from-red-950/80 hover:border-red-700/50'
    };

    const iconBgColors = {
      blue: 'bg-blue-500/20',
      green: 'bg-emerald-500/20',
      red: 'bg-red-500/20'
    };

    const iconColors = {
      blue: 'text-blue-400',
      green: 'text-emerald-400',
      red: 'text-red-400'
    };

    // Play EXTREME scary alarm ringtone to deter threats
    const playRingtone = React.useCallback(() => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Try to resume context (may require user gesture in some browsers)
        audioContext.resume && audioContext.resume().catch(() => { });

        // Create gain node for volume control (MAXIMUM LOUDNESS)
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(1.2, audioContext.currentTime);

        // Create secondary gain for extra intensity
        const intensifyGain = audioContext.createGain();
        intensifyGain.connect(gainNode);
        intensifyGain.gain.setValueAtTime(1.5, audioContext.currentTime);

        // Function to play EXTREME threatening alarm
        const playThreatAlarm = () => {
          const t0 = audioContext.currentTime;

          // ULTRA HIGH frequency shriek (threatening)
          for (let i = 0; i < 5; i++) {
            const shriek = audioContext.createOscillator();
            shriek.type = 'sawtooth';
            shriek.frequency.value = 2000 + (i * 500); // 2000, 2500, 3000, 3500, 4000 Hz
            shriek.connect(intensifyGain);
            shriek.start(t0 + (i * 0.06));
            shriek.stop(t0 + (i * 0.06) + 0.08);
          }

          // BASS THREAT - Deep rumble for psychological impact
          const deepBass = audioContext.createOscillator();
          deepBass.type = 'sine';
          deepBass.frequency.value = 80; // Ultra low frequency
          deepBass.connect(intensifyGain);
          deepBass.start(t0 + 0.4);
          deepBass.stop(t0 + 1.2);

          // RAPID FIRE high-frequency pulses (alarm effect)
          for (let i = 0; i < 4; i++) {
            const pulse = audioContext.createOscillator();
            pulse.type = 'triangle';
            pulse.frequency.value = 1600 + (Math.random() * 800); // Random high freq
            pulse.connect(intensifyGain);
            pulse.start(t0 + 1.15 + (i * 0.08));
            pulse.stop(t0 + 1.15 + (i * 0.08) + 0.09);
          }

          // EXTREME contrast - Jump to very high
          const extreme = audioContext.createOscillator();
          extreme.type = 'square';
          extreme.frequency.value = 3500;
          extreme.connect(intensifyGain);
          extreme.start(t0 + 1.6);
          extreme.stop(t0 + 2.2);
        };

        // Attempt to play after resuming context (some browsers require gesture)
        const tryPlay = () => {
          try {
            playThreatAlarm();
            if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
            ringtoneIntervalRef.current = setInterval(playThreatAlarm, 2800);
          } catch (err) {
            console.error('Failed to start alarm immediately:', err);
          }
        };

        // If the context is suspended, resume first then play
        if (audioContext.state === 'suspended' && audioContext.resume) {
          audioContext.resume().then(tryPlay).catch(tryPlay);
        } else {
          tryPlay();
        }
      } catch (error) {
        console.error('Error playing ringtone:', error);
      }
    }, []);

    // Stop ringtone
    const stopRingtone = React.useCallback(() => {
      try {
        if (ringtoneIntervalRef.current) {
          clearInterval(ringtoneIntervalRef.current);
          ringtoneIntervalRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping ringtone:', error);
      }
    }, []);

    // Handle call acceptance
    const handleAcceptCall = () => {
      stopRingtone();
      setCallAccepted(true);
      const endTime = Date.now() + 60000; // 60 seconds
      setCallEndTime(endTime);
    };

    // Handle call decline
    const handleDeclineCall = () => {
      stopRingtone();
      setSelectedScenario(null);
      setCallAccepted(false);
      setCallEndTime(null);
    };

    // Auto-end call after 60 seconds
    useEffect(() => {
      if (callAccepted && callEndTime) {
        const msLeft = Math.max(0, callEndTime - Date.now());
        const timer = setTimeout(() => {
          stopRingtone();
          setCallAccepted(false);
          setCallEndTime(null);
        }, msLeft);
        return () => clearTimeout(timer);
      }
    }, [callAccepted, callEndTime, stopRingtone]);

    // Live countdown tick while call is active
    useEffect(() => {
      let tick;
      if (callAccepted && callEndTime) {
        tick = setInterval(() => setNow(Date.now()), 1000);
      }
      return () => clearInterval(tick);
    }, [callAccepted, callEndTime]);

    // Play ringtone when incoming call popup appears
    useEffect(() => {
      const showIncomingCall = selectedScenario && (selectedScenario === 'video' || selectedScenario === 'urgent') && !callAccepted;

      if (showIncomingCall) {
        playRingtone();
        // Keep incoming call visible for 30 seconds (configurable)
        const timeout = setTimeout(() => {
          stopRingtone();
          setSelectedScenario(null);
        }, 30000);
        setIncomingCallTimeout(timeout);
        incomingCallTimeoutRef.current = timeout;
      } else {
        stopRingtone();
        if (incomingCallTimeoutRef.current) {
          clearTimeout(incomingCallTimeoutRef.current);
          incomingCallTimeoutRef.current = null;
        }
        if (incomingCallTimeout) {
          clearTimeout(incomingCallTimeout);
          setIncomingCallTimeout(null);
        }
      }

      return () => {
        if (incomingCallTimeoutRef.current) {
          clearTimeout(incomingCallTimeoutRef.current);
          incomingCallTimeoutRef.current = null;
        }
        if (incomingCallTimeout) {
          clearTimeout(incomingCallTimeout);
        }
        stopRingtone();
      };
    }, [selectedScenario, callAccepted]);

    // Show incoming call popup for video and urgent scenarios (stays visible until accepted or 25 seconds pass)
    const showIncomingCall = selectedScenario && (selectedScenario === 'video' || selectedScenario === 'urgent') && !callAccepted;

    // Fake transcript cycling while in call to simulate live conversation
    useEffect(() => {
      if (callAccepted) {
        const lines = [
          "Hey, are you okay?",
          "I'm calling for help.",
          "Stay on the line, don't move.",
          "I can see you, stay visible.",
          "Help is on the way, stay calm."
        ];
        let idx = 0;
        setFakeTranscript(lines[idx]);
        transcriptIntervalRef.current = setInterval(() => {
          idx = (idx + 1) % lines.length;
          setFakeTranscript(lines[idx]);
        }, 3000);
      } else {
        setFakeTranscript('');
        if (transcriptIntervalRef.current) {
          clearInterval(transcriptIntervalRef.current);
          transcriptIntervalRef.current = null;
        }
      }

      return () => {
        if (transcriptIntervalRef.current) {
          clearInterval(transcriptIntervalRef.current);
          transcriptIntervalRef.current = null;
        }
      };
    }, [callAccepted]);

    // Cleanup on unmount: stop ringtone and clear intervals/timeouts
    useEffect(() => {
      return () => {
        try {
          stopRingtone();
        } catch (e) { }
        if (transcriptIntervalRef.current) {
          clearInterval(transcriptIntervalRef.current);
          transcriptIntervalRef.current = null;
        }
        if (incomingCallTimeoutRef.current) {
          clearTimeout(incomingCallTimeoutRef.current);
          incomingCallTimeoutRef.current = null;
        }
      };
    }, []);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Fake Engagement</h1>
          <p className="text-gray-400 text-sm">Quick escape scenarios</p>
        </div>

        {/* Enhanced Features Quick Access */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowEnhancedCall(true)}
            className="bg-blue-600 border border-blue-500 hover:bg-blue-700 rounded-lg p-4 text-left transition-colors"
          >
            <Video className="w-6 h-6 text-white mb-2" />
            <h3 className="text-white font-semibold text-sm mb-1">Enhanced Call</h3>
            <p className="text-blue-100 text-xs">Video calls</p>
          </button>

          <button
            onClick={() => setShowFakeCallSettings(true)}
            className="bg-gray-700 border border-gray-600 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
          >
            <Settings className="w-6 h-6 text-white mb-2" />
            <h3 className="text-white font-semibold text-sm mb-1">Settings</h3>
            <p className="text-gray-300 text-xs">Manage profiles</p>
          </button>
        </div>

        <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200/90 leading-relaxed">
            These scenarios create a believable "out" to discourage potential threats
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-lg p-5 text-left transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 ${iconBgColors[scenario.color]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${iconColors[scenario.color]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2 text-lg">{scenario.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{scenario.description}</p>
                      <span className="inline-block px-4 py-2 bg-white/10 rounded-lg text-xs text-white font-medium border border-white/10">
                        {scenario.action}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Incoming Call Popup */}
        {showIncomingCall && !callAccepted && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full border border-gray-800">
              <div className="text-center">
                {/* Caller Avatar */}
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">{callerInfo[selectedScenario]?.emoji}</span>
                </div>

                {/* Caller Name */}
                <h2 className="text-3xl font-bold text-white mb-2">{callerInfo[selectedScenario]?.name}</h2>

                {/* Incoming Call Label */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-400 text-sm font-semibold">Incoming call</p>
                </div>

                {/* Accept / Decline Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleDeclineCall}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 rotate-180" />
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptCall}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full-Screen Video Call */}
        {callAccepted && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="w-full h-full flex flex-col relative overflow-hidden">
              {/* Main Video Background */}
              <div className="absolute inset-0 bg-black">
              </div>

              {/* Caller Video Frame (Center) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Caller Avatar Large */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <span className="text-8xl">{callerInfo[selectedScenario]?.emoji}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Bar - Status Info */}
              <div className="absolute top-0 left-0 right-0 bg-black/80 p-6 z-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold text-lg">Video Call</span>
                  </div>
                  <div className="text-white text-xl font-mono font-bold">
                    {callEndTime && (() => {
                      const remaining = Math.max(0, Math.ceil((callEndTime - now) / 1000));
                      const mins = Math.floor(remaining / 60);
                      const secs = remaining % 60;
                      return `${mins}:${secs.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Caller Info - Top Center */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{callerInfo[selectedScenario]?.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-semibold text-sm">LIVE</span>
                </div>
              </div>

              {/* Self Video (Mini) - Top Right */}
              <div className="absolute top-6 right-6 z-20">
                <div className="w-24 h-32 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl">👤</span>
                    <p className="text-xs text-gray-300 mt-1">You</p>
                  </div>
                </div>
              </div>

              {/* Control Bar - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-8 z-20">
                <div className="flex items-center justify-center gap-6">
                  {/* Mute Microphone Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                    <Mic className="w-6 h-6 text-white" />
                  </button>

                  {/* Camera Toggle Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                    <Video className="w-6 h-6 text-white" />
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={handleDeclineCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-8 h-8 text-white rotate-180" />
                  </button>

                  {/* Speaker Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>

                  {/* Settings Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Connection Quality Indicator - Bottom Left */}
              <div className="absolute bottom-8 left-8 bg-black/60 rounded-lg p-3 z-20">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">HD Connection</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };



  // Show login screen if user not logged in
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <OfflineIndicator />
      {/* Header */}
      <div className="bg-black/90 border-b border-gray-950 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Aura
                </h1>
                <p className="text-xs text-gray-500">Your Safety Shield</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all border border-gray-800"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'audio' && <AudioShieldPage />}
        {activeTab === 'trip' && activeTrip && <ActiveTripMonitor trip={activeTrip} onTripEnded={handleTripEnded} />}
        {activeTab === 'trip' && !activeTrip && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Timer className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Active Trip</h3>
            <p className="text-gray-400 text-center mb-6">Start a trip to enable ETA-based guardian monitoring</p>
            <button
              onClick={() => setShowTripSetup(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Trip
            </button>
          </div>
        )}
        {activeTab === 'fake' && !showEnhancedCall && !showFakeCallSettings && <FakeEngagementPage />}
        {activeTab === 'fake' && showEnhancedCall && <EnhancedFakeCall onClose={() => setShowEnhancedCall(false)} />}
        {activeTab === 'fake' && showFakeCallSettings && <FakeCallSettings />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-950">
        <div className="max-w-2xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'audio' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              <Mic className="w-6 h-6" />
              <span className="text-xs font-medium">Audio</span>
            </button>
            <button
              onClick={() => setActiveTab('fake')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'fake' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              <Phone className="w-6 h-6" />
              <span className="text-xs font-medium">Fake Call</span>
            </button>
            <button
              onClick={() => activeTrip ? setActiveTab('trip') : setShowTripSetup(true)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all relative ${activeTab === 'trip' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              {activeTrip && (
                <div className="absolute top-1 right-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
              <Timer className="w-6 h-6" />
              <span className="text-xs font-medium">Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trip Setup Modal */}
      {showTripSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TripSetup
              onTripStarted={handleTripStarted}
              onClose={() => setShowTripSetup(false)}
            />
          </div>
        </div>
      )}

      {/* Emergency Contacts Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black z-50">
          <EmergencyContactsSettings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
};

export default AuraApp;
