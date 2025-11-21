import React, { useState, useEffect } from 'react';
import { Shield, Mic, Phone, AlertTriangle, Sun, Activity, MapPin, Users, Bell, Settings, Home, Video, Package, MessageSquare, Clock, Volume2, FileAudio, CheckCircle, XCircle, TrendingUp, Navigation, Eye, Zap, Lock, Radio, Battery, Signal, User, Calendar, Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import callerProfileService from './services/callerProfileService';
import gestureDetector from './services/gestureDetector';
import emergencyService from './services/emergencyService';
import scheduledCallService from './services/scheduledCallService';
import { getDeviceStatus, formatCallDuration } from './utils/deviceStatus';
import EnhancedFakeCall from './components/EnhancedFakeCall';
import FakeCallSettings from './components/FakeCallSettings';

const AuraApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showEnhancedCall, setShowEnhancedCall] = useState(false);
  const [showFakeCallSettings, setShowFakeCallSettings] = useState(false);
  const [audioShieldActive, setAudioShieldActive] = useState(false);
  const [environmentalScanActive, setEnvironmentalScanActive] = useState(true);
  const [lightLevel, setLightLevel] = useState(85);
  const [soundLevel, setSoundLevel] = useState(42);
  const [motionAlert, setMotionAlert] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

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

    return () => {
      scheduledCallService.stop();
      gestureDetector.offTrigger(handleGestureTrigger);
      scheduledCallService.offScheduledCall(handleScheduledCall);
    };
  }, []);

  const HomePage = () => (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-gradient-to-br from-cyan-950/30 to-teal-950/30 rounded-2xl p-6 border border-cyan-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Aura Active</h2>
              <p className="text-cyan-300/80 text-sm">You're protected</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/60 rounded-xl p-3 border border-cyan-900/20">
            <div className="text-2xl font-bold text-cyan-400">5</div>
            <div className="text-xs text-cyan-300/70">Contacts</div>
          </div>
          <div className="bg-black/60 rounded-xl p-3 border border-cyan-900/20">
            <div className="text-2xl font-bold text-cyan-400">12</div>
            <div className="text-xs text-cyan-300/70">Volunteers</div>
          </div>
          <div className="bg-black/60 rounded-xl p-3 border border-cyan-900/20">
            <div className="text-2xl font-bold text-emerald-400">Safe</div>
            <div className="text-xs text-cyan-300/70">Zone Status</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('audio')}
          className="bg-gradient-to-br from-red-950/40 to-orange-950/40 border border-red-900/30 rounded-2xl p-6 text-left hover:from-red-950/60 hover:to-orange-950/60 hover:border-red-800/40 transition-all group"
        >
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-500/30 transition-all">
            <Mic className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">Audio Shield</h3>
          <p className="text-red-300/70 text-xs">Discreet recording</p>
        </button>

        <button
          onClick={() => setActiveTab('fake')}
          className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-900/30 rounded-2xl p-6 text-left hover:from-blue-950/60 hover:to-indigo-950/60 hover:border-blue-800/40 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-all">
            <Phone className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">Fake Call</h3>
          <p className="text-blue-300/70 text-xs">Quick escape</p>
        </button>
      </div>

      {/* Environmental Scanner Preview */}
      <div
        onClick={() => setActiveTab('scanner')}
        className="bg-gray-950/60 border border-gray-900/40 rounded-2xl p-5 cursor-pointer hover:bg-gray-900/70 hover:border-gray-800/50 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Environmental Scanner
          </h3>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${environmentalScanActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700/30 text-gray-400 border border-gray-700'}`}>
            {environmentalScanActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-300 bg-black/50 rounded-lg p-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">{Math.round(lightLevel)}%</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 bg-black/50 rounded-lg p-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">{Math.round(soundLevel)}dB</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-black/50 rounded-lg p-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AudioShieldPage = () => {
    // Threat keywords for speech analysis
    const threatKeywords = [
      'kill', 'hurt', 'attack', 'angry', 'hate', 'destroy', 'bomb',
      'weapon', 'shoot', 'stab', 'punch', 'fight', 'blood', 'death',
      'murder', 'violent', 'threat', 'beat', 'brutality', 'rape',
      'assault', 'abuse', 'harm', 'danger', 'kill you', 'hurt you',
      'attack you', 'destroy you', 'hate you'
    ];

    // Mock speech-to-text function (simulates transcript generation)
    const generateMockTranscript = (avgVolume) => {
      const volumeThreshold = 0.05;
      const isRaisedVoice = avgVolume > volumeThreshold;

      // Randomly generate different transcript scenarios for demo
      const transcripts = [
        isRaisedVoice ? "You better watch out! I'm angry!" : "Hello, how are you today?",
        isRaisedVoice ? "I'll destroy everything!" : "Yes, that sounds good to me.",
        isRaisedVoice ? "Stop! Get away from me!" : "Let's talk about this calmly.",
        isRaisedVoice ? "You hurt me again! I hate this!" : "I'm just checking in with you.",
      ];

      return transcripts[Math.floor(Math.random() * transcripts.length)];
    };

    // Detect threat keywords in transcript
    const detectThreats = (transcript) => {
      const lowerTranscript = transcript.toLowerCase();
      const detectedThreats = threatKeywords.filter(keyword =>
        lowerTranscript.includes(keyword)
      );
      return detectedThreats.length > 0;
    };

    const startRecording = async () => {
      try {
        setAnalysisResult(null);
        setRecordingTime(0);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordingBlob(blob);

          stream.getTracks().forEach(track => track.stop());

          setTimeout(async () => {
            await performThreatAnalysis(blob);
          }, 200);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioShieldActive(true);

        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
            setAudioShieldActive(false);
          }
        }, 5000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please grant permission.');
      }
    };

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setAudioShieldActive(false);
      }
    };

    const performThreatAnalysis = async (blob) => {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Sound analysis: compute average volume
        const channelData = audioBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
          sum += Math.abs(channelData[i]);
        }
        const avgVolume = sum / channelData.length;

        // Sound check: determine if raised voice
        const volumeThreshold = 0.05;
        const hasRaisedVoice = avgVolume > volumeThreshold;

        // Speech check: generate mock transcript and scan for threat keywords
        const generatedTranscript = generateMockTranscript(avgVolume);
        const hasThreateningWords = detectThreats(generatedTranscript);

        // Determine transcript label based on analysis
        let transcriptLabel = "Normal speech";
        if (hasRaisedVoice && hasThreateningWords) {
          transcriptLabel = "Raised voice + threatening words";
        } else if (hasRaisedVoice) {
          transcriptLabel = "Raised voice";
        } else if (hasThreateningWords) {
          transcriptLabel = "Threatening words";
        }

        // Final threat determination: aggression if either raised voice OR threatening words
        const isThreat = hasRaisedVoice || hasThreateningWords;
        const confidence = parseFloat((0.70 + Math.random() * 0.25).toFixed(2));

        const threatLabel = isThreat
          ? "Aggression Detected"
          : "No Threat";

        setAnalysisResult({
          threat: isThreat,
          label: threatLabel,
          confidence: confidence,
          transcript: transcriptLabel,
          volume: avgVolume.toFixed(4),
          detectedTranscript: generatedTranscript,
          hasRaisedVoice: hasRaisedVoice,
          hasThreateningWords: hasThreateningWords
        });

        audioContext.close();
      } catch (error) {
        console.error('Error analyzing audio:', error);
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
            className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${audioShieldActive
              ? 'bg-gradient-to-br from-red-600 to-red-800 shadow-red-500/60 scale-105'
              : 'bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border border-gray-800'
              }`}
          >
            <div className={`${audioShieldActive ? 'animate-pulse' : ''}`}>
              <Mic className={`w-20 h-20 ${audioShieldActive ? 'text-white' : 'text-gray-400'}`} />
            </div>
          </button>

          {audioShieldActive && (
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-red-400" />
                <div className="text-4xl font-bold text-red-400">{formatTime(recordingTime)}</div>
              </div>
              <div className="text-sm text-red-300 mb-3">Recording in progress...</div>
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

        {/* Analysis Results */}
        {analysisResult && (
          <div className="fade-in-result animate-fade-in">
            <div className={`bg-gradient-to-br rounded-2xl p-6 border ${analysisResult.threat
              ? 'from-red-950/60 to-orange-950/60 border-red-800/40'
              : 'from-emerald-950/60 to-teal-950/60 border-emerald-800/40'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">Analysis Results</h3>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${analysisResult.threat
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                  {analysisResult.label}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Confidence Level</span>
                    </div>
                    <span className="text-white font-bold text-lg">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${analysisResult.threat
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <FileAudio className="w-4 h-4" />
                    <span>Threat Analysis Summary</span>
                  </div>
                  <div className={`font-medium text-sm mb-3 px-3 py-2 rounded-lg ${analysisResult.threat ? 'bg-red-900/30 text-red-300' : 'bg-emerald-900/30 text-emerald-300'
                    }`}>
                    "{analysisResult.transcript}"
                  </div>

                  {/* Detection indicators */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${analysisResult.hasRaisedVoice ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-400">Sound Check: <span className={analysisResult.hasRaisedVoice ? 'text-red-300 font-semibold' : 'text-emerald-300'}>{analysisResult.hasRaisedVoice ? 'Raised voice detected' : 'Normal voice level'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${analysisResult.hasThreateningWords ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                      <span className="text-gray-400">Speech Check: <span className={analysisResult.hasThreateningWords ? 'text-red-300 font-semibold' : 'text-emerald-300'}>{analysisResult.hasThreateningWords ? 'Threat keywords detected' : 'No threat keywords'}</span></span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Detected Transcript</span>
                  </div>
                  <div className="text-sm italic text-gray-300 bg-black/40 p-2 rounded border border-gray-700">
                    "{analysisResult.detectedTranscript}"
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Activity className="w-4 h-4" />
                    <span>Audio Metrics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white ml-auto font-medium">5.0s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">Volume:</span>
                      <span className="text-white ml-auto font-medium">{analysisResult.volume}</span>
                    </div>
                  </div>
                </div>

                {analysisResult.threat && (
                  <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-red-200 mb-2">
                        Potential threat detected. Your location and recording have been shared with emergency contacts.
                      </div>
                      <div className="flex items-center gap-2 text-xs text-red-300/70">
                        <Lock className="w-3 h-3" />
                        <span>Encrypted & secured</span>
                      </div>
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
        id: 'friend',
        icon: MessageSquare,
        title: 'Friend Nearby',
        description: 'Friend says they can see you',
        color: 'green',
        action: 'Show Message'
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
            className="bg-gradient-to-br from-purple-950/60 to-pink-950/60 border border-purple-800/40 hover:border-purple-700/50 rounded-xl p-4 text-left transition-all group"
          >
            <Video className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-sm mb-1">Enhanced Call</h3>
            <p className="text-gray-400 text-xs">Realistic video calls with profiles</p>
          </button>

          <button
            onClick={() => setShowFakeCallSettings(true)}
            className="bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 hover:border-cyan-700/50 rounded-xl p-4 text-left transition-all group"
          >
            <Settings className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-sm mb-1">Settings</h3>
            <p className="text-gray-400 text-xs">Manage profiles & schedules</p>
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
                className={`bg-gradient-to-br ${colorClasses[scenario.color]} rounded-2xl p-6 text-left transition-all group`}
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 max-w-sm w-full border border-gray-800 shadow-2xl">
              <div className="text-center">
                {/* Caller Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/40 animate-pulse">
                  <span className="text-5xl">{callerInfo[selectedScenario]?.emoji}</span>
                </div>

                {/* Caller Name */}
                <h2 className="text-3xl font-bold text-white mb-2">{callerInfo[selectedScenario]?.name}</h2>

                {/* Incoming Call Label */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-300 text-sm font-semibold">Incoming call</p>
                </div>

                {/* Accept / Decline Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleDeclineCall}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 rotate-180" />
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptCall}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40"
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
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(100, 200, 255, 0.05) 25%, rgba(100, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, 0.05) 75%, rgba(100, 200, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(100, 200, 255, 0.05) 25%, rgba(100, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, 0.05) 75%, rgba(100, 200, 255, 0.05) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
              </div>

              {/* Caller Video Frame (Center) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Caller Avatar Large */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                      <span className="text-8xl">{callerInfo[selectedScenario]?.emoji}</span>
                    </div>
                    {/* Animated pulse ring */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Top Bar - Status Info */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6 z-20">
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
                <div className="w-24 h-32 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-xl border-2 border-cyan-400 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <span className="text-4xl">👤</span>
                    <p className="text-xs text-cyan-300 mt-1">You</p>
                  </div>
                </div>
              </div>

              {/* Control Bar - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 z-20">
                <div className="flex items-center justify-center gap-6">
                  {/* Mute Microphone Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all shadow-lg">
                    <Mic className="w-6 h-6 text-white" />
                  </button>

                  {/* Camera Toggle Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all shadow-lg">
                    <Video className="w-6 h-6 text-white" />
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={handleDeclineCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/40 transform hover:scale-110"
                  >
                    <Phone className="w-8 h-8 text-white rotate-180" />
                  </button>

                  {/* Speaker Button */}
                  <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all shadow-lg">
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

        {/* Friend Nearby Modal (existing behavior) */}
        {selectedScenario === 'friend' && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Friend Message</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Your friend says they can see you nearby and is coming to pick you up
                </p>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ScannerPage = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Environmental Scanner</h1>
        <p className="text-gray-400 text-sm">Continuous situational awareness</p>
      </div>

      {/* Scanner Toggle */}
      <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold">Scanner Status</h3>
            </div>
            <p className="text-gray-400 text-sm">Monitors environment passively</p>
          </div>
          <button
            onClick={() => setEnvironmentalScanActive(!environmentalScanActive)}
            className={`w-16 h-9 rounded-full transition-all relative ${environmentalScanActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-gray-700'
              }`}
          >
            <div className={`w-7 h-7 bg-white rounded-full transition-transform absolute top-1 ${environmentalScanActive ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
          </button>
        </div>
      </div>

      {/* Sensor Readings */}
      <div className="space-y-4">
        <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lightLevel < 40 ? 'bg-amber-500/20' : 'bg-gray-700/50'
                }`}>
                <Sun className={`w-6 h-6 ${lightLevel < 40 ? 'text-amber-400' : 'text-gray-400'}`} />
              </div>
              <span className="text-white font-semibold text-lg">Light Level</span>
            </div>
            <span className="text-3xl font-bold text-white">{Math.round(lightLevel)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all shadow-lg ${lightLevel < 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/50' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/50'
                }`}
              style={{ width: `${lightLevel}%` }}
            ></div>
          </div>
          {lightLevel < 40 && (
            <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm bg-amber-950/40 px-3 py-2 rounded-lg border border-amber-800/40">
              <AlertTriangle className="w-4 h-4" />
              <span>Low light zone detected</span>
            </div>
          )}
        </div>

        <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${soundLevel > 70 ? 'bg-red-500/20' : 'bg-gray-700/50'
                }`}>
                <Activity className={`w-6 h-6 ${soundLevel > 70 ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <span className="text-white font-semibold text-lg">Sound Level</span>
            </div>
            <span className="text-3xl font-bold text-white">{Math.round(soundLevel)}dB</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all shadow-lg ${soundLevel > 70 ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50'
                }`}
              style={{ width: `${Math.min(100, soundLevel)}%` }}
            ></div>
          </div>
          {soundLevel > 70 && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-950/40 px-3 py-2 rounded-lg border border-red-800/40">
              <AlertTriangle className="w-4 h-4" />
              <span>Elevated noise detected</span>
            </div>
          )}
        </div>

        <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Motion Tracking</div>
                <div className="text-gray-400 text-sm">Detects tailgating behavior</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full shadow-lg ${motionAlert ? 'bg-red-500 animate-pulse shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></div>
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Recent Alerts</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
            <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-300">Low light warning - 5 mins ago</span>
          </div>
          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-300">Entered safe zone - 12 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-black/90 border-b border-gray-950 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Aura
                </h1>
                <p className="text-xs text-gray-500">Your Safety Shield</p>
              </div>
            </div>
            <button className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all border border-gray-800">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'audio' && <AudioShieldPage />}
        {activeTab === 'fake' && !showEnhancedCall && !showFakeCallSettings && <FakeEngagementPage />}
        {activeTab === 'fake' && showEnhancedCall && <EnhancedFakeCall onClose={() => setShowEnhancedCall(false)} />}
        {activeTab === 'fake' && showFakeCallSettings && <FakeCallSettings />}
        {activeTab === 'scanner' && <ScannerPage />}
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
              onClick={() => setActiveTab('scanner')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'scanner' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs font-medium">Scanner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuraApp;
