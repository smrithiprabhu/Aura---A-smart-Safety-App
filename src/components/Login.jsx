import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    // Store user data in localStorage (never logs out)
    localStorage.setItem('aura_user', JSON.stringify({
      name,
      phone,
      loggedIn: true,
      loginTime: new Date().toISOString()
    }));

    // Store empty emergency contacts if not already set (user can add later)
    const existingContacts = localStorage.getItem('aura_emergency_contacts');
    if (!existingContacts) {
      localStorage.setItem('aura_emergency_contacts', JSON.stringify([]));
    }

    // Request permissions
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
    } catch (err) {
      console.log('Microphone access denied');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => console.log('Location access granted'),
        () => console.log('Location access denied')
      );
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    onLogin({ name, phone });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Aura
          </h1>
          <p className="text-gray-400 text-sm">Your Safety Shield</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-white font-medium mb-3">
                🛡️ Permissions Required:
              </p>
              <ul className="text-xs text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Location tracking for Trip Monitor
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Microphone access for Audio Shield
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Notifications for emergency alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Emergency contact management
                </li>
              </ul>
            </div>

            <button
              onClick={handleLogin}
              disabled={!name || !phone}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {!name || !phone ? 'Enter Details to Continue' : 'Activate Safety Shield'}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Your data is stored locally and never shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
