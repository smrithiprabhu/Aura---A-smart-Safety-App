# Aura - A Smart Safety App 🛡️

> Your personal safety companion powered by intelligent features and real-time monitoring.

## 📱 Overview

**Aura** is a comprehensive personal safety application designed to provide users with peace of mind through advanced safety features, emergency assistance, and intelligent monitoring systems. Whether you're walking alone at night, going on a date, or traveling, Aura has your back.

## ✨ Key Features

### 🎭 Enhanced Fake Call System
- **Realistic Video Call UI** with smooth animations and authentic design
- **Multiple Caller Profiles** - Create custom personas (Mom, Boss, Friend, Partner)
- **Quick Activation Triggers**:
  - Shake gesture detection
  - Secret key combo (Ctrl/Cmd + Shift + S)
  - App switch detection
- **Scheduled Calls** - Set up fake calls at specific times with repeat options
- **Emergency Mode Integration** - Hidden emergency button during calls

### 🚨 Emergency Services
- **Silent Alerts** - Discretely notify emergency contacts
- **Location Tracking** - Real-time GPS tracking with history
- **Emergency Contacts Management** - Store and manage trusted contacts
- **Haptic Feedback** - Discreet vibration confirmations

### 🗺️ Trip Tracking & Safe Corridor
- **Trip Setup** - Plan your journey with start/end locations
- **Real-time Monitoring** - Track your progress along the route
- **Safe Corridor Detection** - Get alerts if you deviate from planned route
- **Auto Check-ins** - Periodic location updates to emergency contacts
- **Trip History** - Review past journeys and safety metrics

### 🔊 Audio Shield
- **Voice Recording** - Capture audio evidence in emergencies
- **Sound Level Monitoring** - Track ambient noise levels
- **Call Audio Service** - Simulated realistic call conversations

### 🌙 Environmental Scanning
- **Light Level Detection** - Monitor ambient lighting conditions
- **Motion Alerts** - Detect unusual movement patterns
- **Activity Monitoring** - Real-time environmental awareness

### 📡 Offline Support
- **Service Worker** - Works offline with cached resources
- **Background Sync** - Queue emergency alerts when offline
- **PWA Support** - Install as a native app on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smrithiprabhu/Aura---A-smart-Safety-App.git
cd Aura---A-smart-Safety-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Communication**: Twilio (for real calls integration)
- **PWA**: Service Workers & Web App Manifest

## 📂 Project Structure

```
src/
├── components/
│   ├── EnhancedFakeCall.jsx       # Enhanced fake video call UI
│   ├── FakeCallSettings.jsx       # Caller profiles & schedules
│   ├── TripSetup.jsx              # Trip planning interface
│   ├── ActiveTripMonitor.jsx      # Real-time trip tracking
│   ├── EmergencyContactsSettings.jsx  # Contact management
│   ├── OfflineIndicator.jsx       # Offline status display
│   └── Login.jsx                  # Authentication
├── services/
│   ├── callerProfileService.js    # Fake caller management
│   ├── scheduledCallService.js    # Call scheduling logic
│   ├── gestureDetector.js         # Shake & trigger detection
│   ├── emergencyService.js        # Emergency alert system
│   ├── tripTrackerService.js      # Trip monitoring
│   ├── safeCorridorService.js     # Route deviation detection
│   ├── ringtoneService.js         # Audio notifications
│   ├── voiceCallAudioService.js   # Call audio simulation
│   └── videoLibraryService.js     # Video assets management
├── utils/
│   └── deviceStatus.js            # Device info utilities
├── AuraApp.jsx                    # Main app component
└── main.jsx                       # App entry point
```

## 🎯 Core Services

### Caller Profile Service
Manage fake caller personas with custom avatars, names, and voice lines.

### Gesture Detector
Detect shake gestures and secret key combinations for quick fake call activation.

### Emergency Service
Handle emergency alerts, location tracking, and contact notifications.

### Trip Tracker Service
Monitor journey progress, detect route deviations, and trigger safety alerts.

### Scheduled Call Service
Schedule fake calls at specific times with repeat options (daily/weekly).

## 🔐 Privacy & Security

- All data stored locally on device
- No tracking or analytics
- Location data only shared when explicitly triggered
- Emergency contacts stored securely
- Optional cloud backup (user controlled)

## 📱 PWA Features

- Installable on mobile devices
- Works offline
- Push notifications for scheduled calls
- Background location tracking (when trip is active)
- Home screen icon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Smrithi Prabhu** - [@smrithiprabhu](https://github.com/smrithiprabhu)

## 🙏 Acknowledgments

- Built for the safety and peace of mind of users everywhere
- Inspired by real-world safety needs and community feedback
- Special thanks to all contributors and testers

## 📞 Support

For support, email support@aura-app.com or open an issue in the GitHub repository.

---

**Stay Safe with Aura** 🛡️✨
