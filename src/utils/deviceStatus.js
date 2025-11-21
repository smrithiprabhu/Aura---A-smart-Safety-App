/**
 * Device Status Utilities
 * Get realistic device status indicators for fake call UI
 */

export const getDeviceStatus = () => {
  const now = new Date();
  
  return {
    time: now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    signal: getSignalStrength(),
    battery: getBatteryLevel(),
    carrier: getCarrier()
  };
};

const getSignalStrength = () => {
  // Simulate realistic signal (3-5 bars typically)
  const bars = Math.floor(Math.random() * 3) + 3;
  return {
    bars: Math.min(5, bars),
    percentage: (bars / 5) * 100
  };
};

const getBatteryLevel = () => {
  // Try to get real battery if available
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging
      };
    });
  }
  
  // Fallback to realistic simulation
  const level = Math.floor(Math.random() * 60) + 40; // 40-100%
  return {
    level,
    charging: false
  };
};

const getCarrier = () => {
  const carriers = ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Carrier'];
  return carriers[Math.floor(Math.random() * carriers.length)];
};

export const formatCallDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getRandomVideoLoop = () => {
  // Placeholder for video loop selection
  // In production, this would return actual video URLs
  const videos = [
    { id: 1, url: '/videos/loop1.mp4', duration: 3 },
    { id: 2, url: '/videos/loop2.mp4', duration: 3 },
    { id: 3, url: '/videos/loop3.mp4', duration: 3 }
  ];
  return videos[Math.floor(Math.random() * videos.length)];
};
