// encyclopedia.js

import dinoData from './data/encyclopedia.json';

let currentFilter = 'all';

export function initEncyclopedia() {
  const container = document.getElementById('encyclopedia-grid');
  const filters = document.getElementById('encyclopedia-filters');
  
  if (!container || !filters) return;

  try {
    // Initial Render
    renderGallery();
    
    // Setup Filters
    filters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Update active class
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update filter
        currentFilter = e.target.dataset.filter;
        renderGallery();
      }
    });

  } catch (error) {
    console.error('Error initializing encyclopedia:', error);
    container.innerHTML = '<p class="error-msg">Oops! We could not load the dinosaur data right now.</p>';
  }
}

function renderGallery() {
  const container = document.getElementById('encyclopedia-grid');
  container.innerHTML = '';
  
  // Sort order
  const periods = ['Triassic', 'Jurassic', 'Cretaceous'];
  
  if (currentFilter === 'all') {
    // Render grouped by period
    periods.forEach(p => {
      const periodDinos = dinoData.filter(d => (d.period || '').toLowerCase().includes(p.toLowerCase()));
      if (periodDinos.length > 0) {
        // Group Header
        const groupHeader = document.createElement('div');
        groupHeader.className = 'encyclopedia-group-header';
        groupHeader.innerHTML = `<h2>${p} Period</h2><hr class="period-divider" />`;
        container.appendChild(groupHeader);
        
        // Group Grid
        const groupGrid = document.createElement('div');
        groupGrid.className = 'encyclopedia-grid-inner';
        renderCards(periodDinos, groupGrid);
        container.appendChild(groupGrid);
      }
    });
  } else {
    // Render specific period
    const filteredData = dinoData.filter(d => (d.period || '').toLowerCase().includes(currentFilter.toLowerCase()));
    if (filteredData.length === 0) {
      container.innerHTML = '<p class="empty-msg">No dinosaurs found for this period.</p>';
      return;
    }
    const groupGrid = document.createElement('div');
    groupGrid.className = 'encyclopedia-grid-inner';
    renderCards(filteredData, groupGrid);
    container.appendChild(groupGrid);
  }
}

function renderCards(dinos, container) {
  dinos.forEach(dino => {
    const card = document.createElement('a');
    card.href = `/DinoDeets_Website/explore/dino-detail.html?dino=${encodeURIComponent(dino.name)}`;
    card.className = 'dino-card';
    
    // Handle placeholder image
    const imgSrc = dino.image && dino.image.trim() !== '' ? dino.image : '../images/dinos/trex.webp';
    const originalSrc = imgSrc.startsWith('./') ? imgSrc.replace('./', '../') : imgSrc;

    card.innerHTML = `
      <div class="dino-card__image-container">
        <img src="${originalSrc}" alt="${dino.name}" class="dino-card__image ${dino.image ? '' : 'placeholder'}" />
      </div>
      <div class="dino-card__info">
        <h3 class="dino-card__name">${dino.name}</h3>
        <p class="dino-card__period">${dino.period || 'Unknown Era'}</p>
      </div>
    `;
    
    container.appendChild(card);
  });
}
