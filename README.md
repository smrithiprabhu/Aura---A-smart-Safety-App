# Aura - A Smart Safety App 🛡️

> Your personal safety companion powered by intelligent features and real-time monitoring.

## 📱 Overview

**Aura** is a comprehensive personal safety application designed to provide users with peace of mind through advanced safety features, emergency assistance, and intelligent monitoring systems. Whether you're walking alone at night, going on a date, or traveling, Aura has your back.

## ✨ Key Features

### 🎭 Enhanced Fake Call System
- **Realistic Video Call UI** with smooth animations and authentic design
- **Multiple Caller Profiles** - Create custom personas (Mom, Boss, Friend, Partner)
- **Scheduled Calls** - Set up fake calls at specific times with repeat options

### 🚨 Emergency Services
- **Silent Alerts** - Discretely notify emergency contacts
- **Location Tracking** - Real-time GPS tracking with history
- **Emergency Contacts Management** - Store and manage trusted contacts
- 
### 🗺️ Trip Tracking & Safe Corridor
- **Trip Setup** - Plan your journey with start/end locations
- **Real-time Monitoring** - Track your progress along the route
- **Safe Corridor Detection** - Get alerts if you deviate from planned route

### 🔊 Audio Shield
- **Discreet Audio Recording** - Captures audio evidence in emergencies
- **Sound Analysis & Detection** - Analyzes surrounding sounds for signs of aggression
- **Automatic Emergency Alerts** - Alerts emergency contacts with evidence when danger is detected

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

## 📂 Project Structure

```
src/
├── components/
│   ├── EnhancedFakeCall.jsx       # Enhanced fake video call UI
│   ├── FakeCallSettings.jsx       # Caller profiles & schedules
│   ├── TripSetup.jsx              # Trip planning interface
│   ├── ActiveTripMonitor.jsx      # Real-time trip tracking
│   ├── EmergencyContactsSettings.jsx  # Contact management
│   └── Login.jsx                  # Authentication
├── services/
│   ├── callerProfileService.js    # Fake caller management
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

### Emergency Service
Handle emergency alerts, location tracking, and contact notifications.

### Trip Tracker Service
Monitor journey progress, detect route deviations, and trigger safety alerts.


## 🙏 Acknowledgments

- Built for the safety and peace of mind of users everywhere
- Inspired by real-world safety needs and community feedback
- Special thanks to all contributors and testers


**Stay Safe with Aura** 🛡️✨
