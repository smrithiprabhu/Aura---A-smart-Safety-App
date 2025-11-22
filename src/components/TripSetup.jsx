import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Shield, User, ChevronRight, Save, AlertCircle } from 'lucide-react';
import tripTrackerService from '../services/tripTrackerService';

const TripSetup = ({ onTripStarted }) => {
    const [userName, setUserName] = useState('');
    const [destination, setDestination] = useState('');
    const [etaMinutes, setEtaMinutes] = useState(25);
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [savedGuardians, setSavedGuardians] = useState([]);
    const [selectedGuardian, setSelectedGuardian] = useState(null);
    const [savedDestinations, setSavedDestinations] = useState([]);
    const [error, setError] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);

    // Load saved data on mount
    useEffect(() => {
        loadSavedData();
    }, []);

    const loadSavedData = () => {
        try {
            // Load user name
            const storedName = localStorage.getItem('auraUserName');
            if (storedName) setUserName(storedName);

            // Load saved guardians
            const storedGuardians = localStorage.getItem('auraGuardians');
            if (storedGuardians) {
                const guardians = JSON.parse(storedGuardians);
                setSavedGuardians(guardians);
                if (guardians.length > 0) {
                    setSelectedGuardian(guardians[0]);
                }
            }

            // Load saved destinations
            const storedDestinations = localStorage.getItem('auraSavedDestinations');
            if (storedDestinations) {
                setSavedDestinations(JSON.parse(storedDestinations));
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
        }
    };

    const saveUserName = (name) => {
        setUserName(name);
        localStorage.setItem('auraUserName', name);
    };

    const saveGuardian = () => {
        if (!guardianName.trim() || !guardianPhone.trim()) {
            setError('Please enter guardian name and phone number');
            return;
        }

        const newGuardian = {
            id: Date.now(),
            name: guardianName.trim(),
            phone: guardianPhone.trim()
        };

        const updated = [...savedGuardians, newGuardian];
        setSavedGuardians(updated);
        setSelectedGuardian(newGuardian);
        localStorage.setItem('auraGuardians', JSON.stringify(updated));

        setGuardianName('');
        setGuardianPhone('');
        setError('');
    };

    const saveDestination = () => {
        if (!destination.trim()) return;

        const newDest = {
            id: Date.now(),
            name: destination.trim(),
            timestamp: Date.now()
        };

        const updated = [newDest, ...savedDestinations].slice(0, 10);
        setSavedDestinations(updated);
        localStorage.setItem('auraSavedDestinations', JSON.stringify(updated));
    };

    const handleStartTrip = async () => {
        setError('');

        // Validate inputs
        if (!userName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!destination.trim()) {
            setError('Please enter your destination');
            return;
        }

        if (!selectedGuardian) {
            setError('Please select or add a guardian');
            return;
        }

        // Get current location
        setGettingLocation(true);

        try {
            let startLocation = null;

            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        });
                    });

                    startLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };
                } catch (geoError) {
                    console.warn('Could not get location:', geoError);
                    // Continue without location
                }
            }

            // Save destination if not already saved
            if (!savedDestinations.find(d => d.name === destination)) {
                saveDestination();
            }

            // Start the trip
            const trip = tripTrackerService.startTrip({
                userName: userName.trim(),
                destination: destination.trim(),
                etaMinutes: parseInt(etaMinutes),
                guardian: selectedGuardian,
                startLocation
            });

            console.log('Trip started:', trip);

            // Notify parent component
            if (onTripStarted) {
                onTripStarted(trip);
            }

        } catch (error) {
            setError(error.message || 'Failed to start trip');
            console.error('Trip start error:', error);
        } finally {
            setGettingLocation(false);
        }
    };

    const formatETATime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                    <MapPin className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Set Up Your Trip</h2>
                <p className="text-gray-400">
                    Your guardian will be notified and can track your journey in real-time
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* User Name */}
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Your Name</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => saveUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
            </div>

            {/* Destination */}
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Destination</span>
                </label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-3"
                />

                {/* Saved Destinations */}
                {savedDestinations.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Recent destinations:</p>
                        <div className="flex flex-wrap gap-2">
                            {savedDestinations.slice(0, 5).map((dest) => (
                                <button
                                    key={dest.id}
                                    onClick={() => setDestination(dest.name)}
                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-full transition-colors"
                                >
                                    {dest.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ETA Selection */}
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <label className="flex items-center justify-between text-gray-300 mb-3">
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Expected Arrival Time</span>
                    </span>
                    <span className="text-lg font-bold text-purple-400">
                        {formatETATime(etaMinutes)}
                    </span>
                </label>

                <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={etaMinutes}
                    onChange={(e) => setEtaMinutes(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>1 hour</span>
                    <span>2 hours</span>
                </div>
            </div>

            {/* Guardian Selection */}
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Emergency Guardian</span>
                </label>

                {/* Saved Guardians */}
                {savedGuardians.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {savedGuardians.map((guardian) => (
                            <button
                                key={guardian.id}
                                onClick={() => setSelectedGuardian(guardian)}
                                className={`w-full p-3 rounded-lg border transition-all ${selectedGuardian?.id === guardian.id
                                        ? 'bg-purple-500/20 border-purple-500 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="font-medium">{guardian.name}</div>
                                        <div className="text-sm text-gray-400">{guardian.phone}</div>
                                    </div>
                                    {selectedGuardian?.id === guardian.id && (
                                        <ChevronRight className="w-5 h-5 text-purple-400" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Add New Guardian */}
                <div className="space-y-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400">Add a new guardian:</p>
                    <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Guardian name"
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                        type="tel"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                        onClick={saveGuardian}
                        disabled={!guardianName.trim() || !guardianPhone.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        Save Guardian
                    </button>
                </div>
            </div>

            {/* Start Trip Button */}
            <button
                onClick={handleStartTrip}
                disabled={gettingLocation || !userName || !destination || !selectedGuardian}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {gettingLocation ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Getting Location...
                    </>
                ) : (
                    <>
                        <MapPin className="w-5 h-5" />
                        Start Tracking Trip
                    </>
                )}
            </button>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">How it works:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Your guardian receives an instant notification with tracking link</li>
                    <li>• Timer counts down to your expected arrival time</li>
                    <li>• Tap "I Have Arrived Safely" when you reach your destination</li>
                    <li>• If timer expires or battery is critical, automatic SOS is sent</li>
                </ul>
            </div>
        </div>
    );
};

export default TripSetup;
