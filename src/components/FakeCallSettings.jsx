/**
 * Fake Call Settings Page
 * Manage profiles, scheduled calls, and activation triggers
 */
import React, { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, Calendar, Clock, Bell, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import callerProfileService from '../services/callerProfileService';
import scheduledCallService from '../services/scheduledCallService';
import gestureDetector from '../services/gestureDetector';

export const FakeCallSettings = () => {
    const [activeSection, setActiveSection] = useState('profiles'); // profiles, scheduled, triggers
    const [profiles, setProfiles] = useState([]);
    const [scheduledCalls, setScheduledCalls] = useState([]);
    const [showAddProfile, setShowAddProfile] = useState(false);
    const [showAddSchedule, setShowAddSchedule] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);

    // Gesture triggers state
    const [gesturesEnabled, setGesturesEnabled] = useState(false);

    useEffect(() => {
        loadData();

        // Request notification permission
        scheduledCallService.requestNotificationPermission();
    }, []);

    const loadData = () => {
        setProfiles(callerProfileService.getAllProfiles());
        setScheduledCalls(scheduledCallService.getAllScheduledCalls());
    };

    const handleDeleteProfile = (id) => {
        if (confirm('Delete this caller profile?')) {
            callerProfileService.deleteProfile(id);
            loadData();
        }
    };

    const handleDeleteSchedule = (id) => {
        if (confirm('Delete this scheduled call?')) {
            scheduledCallService.deleteScheduledCall(id);
            loadData();
        }
    };

    const toggleSchedule = (id, enabled) => {
        scheduledCallService.toggleScheduledCall(id, enabled);
        loadData();
    };

    const toggleGestures = () => {
        if (!gesturesEnabled) {
            gestureDetector.start();
            setGesturesEnabled(true);
        } else {
            gestureDetector.stop();
            setGesturesEnabled(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Fake Call Settings</h1>
                <p className="text-gray-400 text-sm">Manage profiles, schedules & triggers</p>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 bg-gray-900/50 p-2 rounded-xl">
                <button
                    onClick={() => setActiveSection('profiles')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${activeSection === 'profiles'
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <User className="w-4 h-4 inline mr-2" />
                    Profiles
                </button>
                <button
                    onClick={() => setActiveSection('scheduled')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${activeSection === 'scheduled'
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Scheduled
                </button>
                <button
                    onClick={() => setActiveSection('triggers')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${activeSection === 'triggers'
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <Bell className="w-4 h-4 inline mr-2" />
                    Triggers
                </button>
            </div>

            {/* Profiles Section */}
            {activeSection === 'profiles' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Caller Profiles</h2>
                        <button
                            onClick={() => setShowAddProfile(true)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Profile
                        </button>
                    </div>

                    {profiles.map((profile) => (
                        <div
                            key={profile.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-gray-700 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-3xl">{profile.avatar}</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{profile.name}</h3>
                                    <p className="text-gray-400 text-sm">{profile.relationship}</p>
                                    {profile.isDefault && (
                                        <span className="text-xs text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded mt-1 inline-block">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </div>

                            {!profile.isDefault && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingProfile(profile)}
                                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-blue-400 transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProfile(profile.id)}
                                        className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Scheduled Calls Section */}
            {activeSection === 'scheduled' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Scheduled Calls</h2>
                        <button
                            onClick={() => setShowAddSchedule(true)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Schedule Call
                        </button>
                    </div>

                    {scheduledCalls.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No scheduled calls yet</p>
                            <p className="text-gray-500 text-sm mt-1">Add a scheduled call to get started</p>
                        </div>
                    ) : (
                        scheduledCalls.map((call) => {
                            const callTime = new Date(call.scheduledTime);
                            const profile = callerProfileService.getProfile(call.callerProfileId);

                            return (
                                <div
                                    key={call.id}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 group hover:border-gray-700 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                <span className="text-2xl">{profile?.avatar || '📞'}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{profile?.name || 'Unknown'}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    {callTime.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleSchedule(call.id, !call.enabled)}
                                                className={`w-12 h-7 rounded-full transition-all relative ${call.enabled ? 'bg-green-600' : 'bg-gray-700'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-1 ${call.enabled ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                ></div>
                                            </button>

                                            <button
                                                onClick={() => handleDeleteSchedule(call.id)}
                                                className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {call.repeat !== 'once' && (
                                        <div className="text-xs text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded inline-block">
                                            Repeats: {call.repeat}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Triggers Section */}
            {activeSection === 'triggers' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Activation Triggers</h2>

                    <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-200/90">
                            <p className="font-semibold mb-1">Discreet Activation</p>
                            <p>Enable gestures to trigger fake calls instantly without opening the app.</p>
                        </div>
                    </div>

                    {/* Master Toggle */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-semibold mb-1">Enable Quick Triggers</h3>
                                <p className="text-gray-400 text-sm">Activate gestures and shortcuts</p>
                            </div>
                            <button
                                onClick={toggleGestures}
                                className={`w-14 h-8 rounded-full transition-all relative ${gesturesEnabled ? 'bg-green-600' : 'bg-gray-700'
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-1 ${gesturesEnabled ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                ></div>
                            </button>
                        </div>
                    </div>

                    {/* Trigger Methods */}
                    <div className="space-y-3">
                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium mb-1">Shake Gesture</h4>
                                    <p className="text-gray-400 text-sm">Shake your device rapidly to trigger a fake call</p>
                                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${gesturesEnabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-500'
                                        }`}>
                                        {gesturesEnabled ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <SettingsIcon className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium mb-1">Secret Key Combo</h4>
                                    <p className="text-gray-400 text-sm">Press <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">Ctrl/Cmd + Shift + S</kbd> anywhere</p>
                                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${gesturesEnabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-500'
                                        }`}>
                                        {gesturesEnabled ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium mb-1">App Switch Detection</h4>
                                    <p className="text-gray-400 text-sm">Rapid app switching triggers fake call (simulates power button)</p>
                                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${gesturesEnabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-500'
                                        }`}>
                                        {gesturesEnabled ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FakeCallSettings;
