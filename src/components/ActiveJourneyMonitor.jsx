/**
 * Active Safe Corridor Journey Monitor
 * Shows live tracking of current journey
 */
import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, AlertTriangle, CheckCircle, X, Clock, Route, Shield } from 'lucide-react';
import safeCorridorService from '../services/safeCorridorService';

const ActiveJourneyMonitor = ({ journey, onCancel }) => {
  const [deviationStatus, setDeviationStatus] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Update elapsed time
    const interval = setInterval(() => {
      if (journey.startTime) {
        const start = new Date(journey.startTime);
        const now = new Date();
        setElapsed(Math.floor((now - start) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [journey]);

  useEffect(() => {
    // Check deviation status periodically
    const interval = setInterval(() => {
      const status = safeCorridorService.getDeviationStatus();
      setDeviationStatus(status);
    }, 1000);

    // Listen for alerts
    const handleAlert = (event) => {
      // Handle alert event
      console.log('Alert received:', event.detail);
    };

    const handleComplete = (event) => {
      // Journey completed
      console.log('Journey completed:', event.detail);
    };

    window.addEventListener('safeCorridorAlert', handleAlert);
    window.addEventListener('safeCorridorComplete', handleComplete);

    return () => {
      clearInterval(interval);
      window.removeEventListener('safeCorridorAlert', handleAlert);
      window.removeEventListener('safeCorridorComplete', handleComplete);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className={`bg-gradient-to-br rounded-2xl p-6 border-2 ${deviationStatus?.isDeviated
          ? 'from-amber-950/80 to-orange-950/80 border-amber-700/60 shadow-2xl shadow-amber-500/20'
          : 'from-emerald-950/80 to-teal-950/80 border-emerald-700/60 shadow-2xl shadow-emerald-500/20'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${deviationStatus?.isDeviated
                ? 'bg-amber-500/20 border border-amber-500/40'
                : 'bg-emerald-500/20 border border-emerald-500/40'
              }`}>
              {deviationStatus?.isDeviated ? (
                <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
              ) : (
                <Shield className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Safe Corridor Active</h3>
              <p className={`text-sm ${deviationStatus?.isDeviated ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                {deviationStatus?.isDeviated ? '⚠️ Route Deviation Detected' : '✓ On planned route'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center justify-center hover:bg-red-950/60 transition-all"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Route Info */}
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 text-white">
            <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium">{journey.origin.name}</div>
            </div>
            <Navigation className="w-5 h-5 text-gray-400" />
            <div className="flex-1 text-right">
              <div className="text-sm font-medium">{journey.destination.name}</div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Elapsed Time</span>
            </div>
            <div className="text-xl font-bold text-white">{formatTime(elapsed)}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-gray-400">Max Deviation</span>
            </div>
            <div className="text-xl font-bold text-white">{journey.maxDeviation}m</div>
          </div>
        </div>

        {/* Deviation Warning */}
        {deviationStatus?.isDeviated && (
          <div className="mt-4 bg-amber-950/50 border border-amber-800/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-amber-200 font-semibold mb-1">Route Deviation</div>
                <div className="text-sm text-amber-300/80 mb-2">
                  You've been off-route for {Math.floor(deviationStatus.duration)} seconds
                </div>
                {deviationStatus.remaining > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-amber-900/50 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${((journey.sustainedDeviationTime - deviationStatus.remaining) / journey.sustainedDeviationTime) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-amber-300 font-bold w-12">
                      {Math.ceil(deviationStatus.remaining)}s
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-amber-400 font-bold">
                    🚨 Alert triggered! Emergency contact notified.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert History */}
      {journey.deviations && journey.deviations.length > 0 && (
        <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-5">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Alert History
          </h4>
          <div className="space-y-2">
            {journey.deviations.map((deviation, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-400 font-semibold">
                    Deviation Alert #{index + 1}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(deviation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-400">
                  {deviation.distance.toFixed(0)}m off route
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Info */}
      <div className="bg-gray-950/70 border border-gray-900/40 rounded-2xl p-5">
        <h4 className="text-white font-semibold mb-3">Safety Settings</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Alert Trigger Time</span>
            <span className="text-white font-medium">{journey.sustainedDeviationTime}s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Emergency Contact</span>
            <span className="text-white font-medium">{journey.emergencyContact || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Alert Action</span>
            <span className="text-white font-medium capitalize">{journey.alertAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveJourneyMonitor;
