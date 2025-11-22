import React, { useState, useEffect } from 'react';
import {
    MapPin, Clock, Shield, Battery, BatteryLow, AlertTriangle,
    CheckCircle, Navigation, Phone, X, ChevronDown, ChevronUp
} from 'lucide-react';
import tripTrackerService from '../services/tripTrackerService';

const ActiveTripMonitor = ({ trip, onTripEnded }) => {
    const [tripStatus, setTripStatus] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    useEffect(() => {
        // Subscribe to trip updates
        const unsubscribe = tripTrackerService.subscribe((status) => {
            setTripStatus(status);
        });

        // Initial status
        setTripStatus(tripTrackerService.getTripStatus());

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSafeArrival = () => {
        try {
            const completedTrip = tripTrackerService.confirmSafeArrival();
            console.log('Safe arrival confirmed:', completedTrip);

            if (onTripEnded) {
                onTripEnded(completedTrip);
            }
        } catch (error) {
            console.error('Failed to confirm arrival:', error);
        }
    };

    const handleCancelTrip = () => {
        if (!confirmCancel) {
            setConfirmCancel(true);
            setTimeout(() => setConfirmCancel(false), 3000);
            return;
        }

        try {
            const cancelledTrip = tripTrackerService.cancelTrip();
            console.log('Trip cancelled:', cancelledTrip);

            if (onTripEnded) {
                onTripEnded(cancelledTrip);
            }
        } catch (error) {
            console.error('Failed to cancel trip:', error);
        }
    };

    if (!tripStatus) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading trip status...</div>
            </div>
        );
    }

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getBatteryIcon = (level) => {
        if (level <= 10) return <BatteryLow className="w-5 h-5 text-red-400" />;
        return <Battery className="w-5 h-5 text-green-400" />;
    };

    const getBatteryColor = (level) => {
        if (level <= 10) return 'text-red-400';
        if (level <= 30) return 'text-yellow-400';
        return 'text-green-400';
    };

    const isExpiringSoon = tripStatus.remainingTime <= 5 * 60 * 1000; // 5 minutes
    const isCritical = tripStatus.remainingTime <= 60 * 1000; // 1 minute

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Status Banner */}
            {tripStatus.escalated ? (
                <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-400 mb-2">
                                🚨 EMERGENCY ALERT SENT
                            </h3>
                            <p className="text-red-300">
                                Your guardian has been notified via high-priority SOS alert.
                            </p>
                            <p className="text-sm text-red-400 mt-2">
                                Reason: {tripStatus.escalationType === 'eta_expired' ? 'ETA Expired' : 'Critical Battery'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : tripStatus.isExpired ? (
                <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-400 mb-2">
                                ETA Expired
                            </h3>
                            <p className="text-red-300">
                                Please confirm your safe arrival immediately to prevent automatic SOS alert.
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Main Trip Card */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Trip in Progress</h2>
                            <div className="flex items-center gap-2 text-purple-100">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{tripStatus.destination}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getBatteryIcon(tripStatus.batteryLevel)}
                            <span className={`text-sm font-medium ${getBatteryColor(tripStatus.batteryLevel)}`}>
                                {tripStatus.batteryLevel}%
                            </span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                        <div className="text-sm text-purple-100 mb-2">Time Remaining</div>
                        <div className={`text-5xl font-bold mb-2 ${isCritical ? 'text-red-400 animate-pulse' :
                            isExpiringSoon ? 'text-yellow-400' : 'text-white'
                            }`}>
                            {tripStatus.isExpired ? '00:00' : formatTime(tripStatus.remainingTime)}
                        </div>
                        <div className="text-sm text-purple-100">
                            Expected arrival in {tripStatus.etaMinutes} minutes
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-purple-100 mb-2">
                            <span>Started</span>
                            <span>{Math.round(tripStatus.progress)}%</span>
                            <span>ETA</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${tripStatus.isExpired ? 'bg-red-500' :
                                    isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(100, tripStatus.progress)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Safe Arrival Button */}
                <div className="p-6">
                    {!tripStatus.escalated && (
                        <button
                            onClick={handleSafeArrival}
                            className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6" />
                            I Have Arrived Safely
                        </button>
                    )}

                    {/* Guardian Info */}
                    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Guardian Notified</div>
                                    <div className="font-medium text-white">{tripStatus.guardian.name}</div>
                                </div>
                            </div>
                            <a
                                href={`tel:${tripStatus.guardian.phone}`}
                                className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                            >
                                <Phone className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trip Details (Collapsible) */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                    <span className="font-medium text-white">Trip Details</span>
                    {showDetails ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {showDetails && (
                    <div className="px-4 pb-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-xs text-gray-400 mb-1">Started</div>
                                <div className="text-sm text-white">
                                    {new Date(tripStatus.startTime).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-xs text-gray-400 mb-1">Expected</div>
                                <div className="text-sm text-white">
                                    {new Date(tripStatus.expectedArrivalTime).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-xs text-gray-400 mb-1">Elapsed</div>
                                <div className="text-sm text-white">
                                    {formatTime(tripStatus.elapsedTime)}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-xs text-gray-400 mb-1">Status</div>
                                <div className={`text-sm font-medium ${tripStatus.escalated ? 'text-red-400' :
                                    tripStatus.isExpired ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                    {tripStatus.escalated ? 'Emergency' :
                                        tripStatus.isExpired ? 'Expired' : 'Active'}
                                </div>
                            </div>
                        </div>

                        {tripStatus.currentLocation && (
                            <div className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-xs text-gray-400 mb-2">Current Location</div>
                                <div className="flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-purple-400" />
                                    <div className="text-xs text-gray-300">
                                        {tripStatus.currentLocation.latitude.toFixed(6)}, {tripStatus.currentLocation.longitude.toFixed(6)}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Accuracy: ±{Math.round(tripStatus.currentLocation.accuracy)}m
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Warning Messages */}
            {!tripStatus.escalated && (
                <>
                    {tripStatus.batteryLevel <= 10 && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                            <BatteryLow className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-medium">Critical Battery Level</p>
                                <p className="text-sm text-red-300 mt-1">
                                    Your battery is at {tripStatus.batteryLevel}%. Please charge your phone to prevent automatic SOS alert.
                                </p>
                            </div>
                        </div>
                    )}

                    {isExpiringSoon && !tripStatus.isExpired && (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-400 font-medium">Approaching ETA</p>
                                <p className="text-sm text-yellow-300 mt-1">
                                    Less than 5 minutes remaining. Be ready to confirm your safe arrival.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Cancel Trip */}
            {!tripStatus.escalated && (
                <button
                    onClick={handleCancelTrip}
                    className={`w-full py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${confirmCancel
                        ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-400'
                        }`}
                >
                    <X className="w-4 h-4" />
                    {confirmCancel ? 'Click Again to Confirm Cancellation' : 'Cancel Trip'}
                </button>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                    <strong className="text-blue-400">Guardian notified:</strong> {tripStatus.guardian.name} received
                    an automatic notification when you started this trip and can track your location in real-time.
                </p>
            </div>
        </div>
    );
};

export default ActiveTripMonitor;
