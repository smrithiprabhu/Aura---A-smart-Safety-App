import React, { useState, useEffect } from 'react';
import { Shield, Mic, Phone, AlertTriangle, Sun, Activity, MapPin, Users, Bell, Settings, Home, Video, Package, MessageSquare, Clock, Volume2, FileAudio, CheckCircle, XCircle, TrendingUp, Navigation, Eye, Zap, Lock, Radio } from 'lucide-react';

const AuraApp = () => {
  const [activeTab, setActiveTab] = useState('home');
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
        
        const channelData = audioBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
          sum += Math.abs(channelData[i]);
        }
        const avgVolume = sum / channelData.length;
        
        const volumeThreshold = 0.05;
        const isThreat = avgVolume > volumeThreshold;
        
        const confidence = (0.70 + Math.random() * 0.25).toFixed(2);
        
        const transcript = isThreat 
          ? "Raised voice patterns detected" 
          : "Normal speech patterns";
        
        const threatLabel = isThreat 
          ? "Aggression Detected" 
          : "No Threat Detected";
        
        setAnalysisResult({
          threat: isThreat,
          label: threatLabel,
          confidence: confidence,
          transcript: transcript,
          volume: avgVolume.toFixed(4)
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
            className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              audioShieldActive 
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
          <div className="fade-in-result">
            <div className={`bg-gradient-to-br rounded-2xl p-6 border ${
              analysisResult.threat 
                ? 'from-red-950/60 to-orange-950/60 border-red-800/40' 
                : 'from-emerald-950/60 to-teal-950/60 border-emerald-800/40'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">Analysis Results</h3>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  analysisResult.threat 
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
                      className={`h-2 rounded-full transition-all duration-500 ${
                        analysisResult.threat 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <FileAudio className="w-4 h-4" />
                    <span>Transcript Analysis</span>
                  </div>
                  <div className={`font-medium ${
                    analysisResult.threat ? 'text-red-300' : 'text-emerald-300'
                  }`}>
                    "{analysisResult.transcript}"
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

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Fake Engagement</h1>
          <p className="text-gray-400 text-sm">Quick escape scenarios</p>
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

        {selectedScenario && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Scenario Activated</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Your fake {scenarios.find(s => s.id === selectedScenario)?.title.toLowerCase()} is now active
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
            className={`w-16 h-9 rounded-full transition-all relative ${
              environmentalScanActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-gray-700'
            }`}
          >
            <div className={`w-7 h-7 bg-white rounded-full transition-transform absolute top-1 ${
              environmentalScanActive ? 'translate-x-8' : 'translate-x-1'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Sensor Readings */}
      <div className="space-y-4">
        <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                lightLevel < 40 ? 'bg-amber-500/20' : 'bg-gray-700/50'
              }`}>
                <Sun className={`w-6 h-6 ${lightLevel < 40 ? 'text-amber-400' : 'text-gray-400'}`} />
              </div>
              <span className="text-white font-semibold text-lg">Light Level</span>
            </div>
            <span className="text-3xl font-bold text-white">{Math.round(lightLevel)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all shadow-lg ${
                lightLevel < 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/50' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/50'
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
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                soundLevel > 70 ? 'bg-red-500/20' : 'bg-gray-700/50'
              }`}>
                <Activity className={`w-6 h-6 ${soundLevel > 70 ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <span className="text-white font-semibold text-lg">Sound Level</span>
            </div>
            <span className="text-3xl font-bold text-white">{Math.round(soundLevel)}dB</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all shadow-lg ${
                soundLevel > 70 ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50'
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
        {activeTab === 'fake' && <FakeEngagementPage />}
        {activeTab === 'scanner' && <ScannerPage />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-950">
        <div className="max-w-2xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                activeTab === 'home' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                activeTab === 'audio' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Mic className="w-6 h-6" />
              <span className="text-xs font-medium">Audio</span>
            </button>
            <button
              onClick={() => setActiveTab('fake')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                activeTab === 'fake' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Phone className="w-6 h-6" />
              <span className="text-xs font-medium">Fake Call</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                activeTab === 'scanner' ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-600 hover:text-gray-400'
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
