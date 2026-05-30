import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './engine/App';
import './style.css';

const isBuilder = window.location.pathname.includes('/scenebuilder') || window.location.hash.includes('#/scenebuilder');

if (isBuilder) {
  fetch('/DinoDeets_Website/api/get-state?t=' + Date.now())
    .then(res => res.json())
    .then(state => {
      createRoot(document.getElementById('root')).render(<App externalState={state} />);
    })
    .catch(err => {
      console.error("Failed to fetch runtime state, falling back to static state:", err);
      createRoot(document.getElementById('root')).render(<App />);
    });
} else {
  createRoot(document.getElementById('root')).render(<App />);
}
