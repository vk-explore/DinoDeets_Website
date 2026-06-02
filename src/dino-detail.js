// dino-detail.js

import dinoData from './data/encyclopedia.json';

export function initDinoDetail() {
  const container = document.getElementById('dino-detail-container');
  if (!container) return;

  try {
    // Parse query params
    const params = new URLSearchParams(window.location.search);
    const dinoName = params.get('dino');

    if (!dinoName) {
      renderError(container, 'No dinosaur specified!');
      return;
    }

    const dino = dinoData.find(d => d.name.toLowerCase() === dinoName.toLowerCase());

    if (!dino) {
      renderError(container, `We couldn't find details for "${dinoName}"!`);
      return;
    }

    // Set page title
    document.title = `${dino.name} | Dino Deets`;

    // Handle placeholder image
    const imgSrc = dino.image && dino.image.trim() !== '' ? dino.image : '../images/dinos/trex.png';
    const originalSrc = imgSrc.startsWith('./') ? imgSrc.replace('./', '../') : imgSrc;

    container.innerHTML = `
      <div class="dino-detail__header">
        <h1 class="page-title">${dino.name}</h1>
        <span class="badge badge--large">${dino.period || 'Unknown Era'}</span>
      </div>
      
      <div class="dino-detail__content-grid">
        <div class="dino-detail__image-card">
          <div class="dino-detail__img-wrap">
            <img src="${originalSrc}" alt="${dino.name}" />
          </div>
        </div>
        
        <div class="dino-detail__stats-card">
          <h2>Quick Facts</h2>
          <div class="dino-detail__stats-list">
            <div class="stats-item">
              <strong>Diet</strong>
              <span>${dino.diet || 'Unknown'}</span>
            </div>
            <div class="stats-item">
              <strong>Length</strong>
              <span>${dino.length || 'Unknown'}</span>
            </div>
            <div class="stats-item">
              <strong>Weight</strong>
              <span>${dino.weight || 'Unknown'}</span>
            </div>
            <div class="stats-item">
              <strong>Location</strong>
              <span>${dino.location || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dino-detail__bio-card">
        <h2>About ${dino.name}</h2>
        <p>${dino.description || 'No description available yet for this fascinating creature!'}</p>
      </div>
    `;

    // Mascot interactive line
    const mascotBubble = document.getElementById('mascot-text');
    if (mascotBubble) {
      mascotBubble.textContent = `${dino.name} was a ${dino.diet || 'fascinating'} dinosaur from ${dino.location || 'prehistoric worlds'}!`;
    }

  } catch (error) {
    console.error('Error loading dino details:', error);
    renderError(container, 'Oops! Something went wrong loading the dinosaur data.');
  }
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="dino-detail__error-card text-center">
      <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--color-volcanic)" stroke-width="2" fill="none" class="error-icon" style="margin-bottom: 16px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <h2>Dino Data Missing</h2>
      <p>${message}</p>
      <a href="/DinoDeets_Website/explore/encyclopedia.html" class="btn btn--primary" style="margin-top: 16px; display: inline-block;">Return to Encyclopedia</a>
    </div>
  `;
}
