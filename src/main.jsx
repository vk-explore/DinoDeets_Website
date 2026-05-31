import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './engine/App';
import './style.css';

const pathname = window.location.pathname.toLowerCase();
const hash = window.location.hash.toLowerCase();
const isBuilder = pathname.includes('/scenebuilder') || hash.includes('#/scenebuilder');

console.warn("🦖 [DinoDeets Engine v2] Booting...");
console.warn("   - Pathname:", window.location.pathname);
console.warn("   - Hash:", window.location.hash);
console.warn("   - Evaluated isBuilder (case-insensitive):", isBuilder);

// Listen to hash changes. If we cross the boundary between scenebuilder and website modes, reload to cleanly load/unload Theatre.js
window.addEventListener('hashchange', () => {
  const currentPathname = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();
  const currentIsBuilder = currentPathname.includes('/scenebuilder') || currentHash.includes('#/scenebuilder');
  
  if (currentIsBuilder !== isBuilder) {
    console.warn("🔄 Hash changed crossing modes! Forcing page reload to cleanly initialize/de-initialize Theatre.js Studio.");
    window.location.reload();
  }
});

if (isBuilder) {
  console.warn("🚀 Booting in BUILDER MODE — Fetching runtime state from API...");
  fetch('/DinoDeets_Website/api/get-state?t=' + Date.now())
    .then(res => {
      console.warn("   - API Response Status:", res.status);
      return res.json();
    })
    .then(state => {
      console.warn("   - State fetched successfully from server. Rendering App...");
      createRoot(document.getElementById('root')).render(<App externalState={state} />);
    })
    .catch(err => {
      console.error("   - Failed to fetch runtime state, falling back to static animation-state.json:", err);
      createRoot(document.getElementById('root')).render(<App />);
    });
} else {
  console.warn("🌐 [DinoDeets] Booting in WEBSITE VIEW MODE — Rendering standard pages...");
  console.warn("👉 TO OPEN THE DEVELOPER SCENE BUILDER SIDEBAR, NAVIGATE TO:\n   " + window.location.origin + "/DinoDeets_Website/#/scenebuilder");
  createRoot(document.getElementById('root')).render(<App />);
}
