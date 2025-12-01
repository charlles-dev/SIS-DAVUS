import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Cleanup legacy service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      if (registration.active && registration.active.scriptURL.includes('service-worker.js')) {
        console.log('Unregistering legacy service worker:', registration.active.scriptURL);
        registration.unregister();
        window.location.reload();
      }
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);