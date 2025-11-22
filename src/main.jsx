import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuraApp from './AuraApp.jsx'

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Aura: Offline mode activated');
      })
      .catch((error) => {
        console.log('Aura: Offline setup failed', error);
      });
  });
}

// Auto-save all form inputs every 3 seconds
setInterval(() => {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input.id || input.name) {
      const key = `aura_${input.id || input.name}`;
      localStorage.setItem(key, input.value);
    }
  });
}, 3000);

// Load saved form data on page load
window.addEventListener('load', () => {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input.id || input.name) {
      const key = `aura_${input.id || input.name}`;
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        input.value = savedValue;
      }
    }
  });
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuraApp />
  </StrictMode>,
)
