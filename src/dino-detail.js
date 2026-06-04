// dino-detail.js

import dinoData from './data/encyclopedia.json';

// Coordinates matching dino-map.js for accurate projection on world.svg
const locationCoords = {
  'Neuquén, Argentina':             { lat: -38.95, lon: -68.05 },
  'Santa Cruz, Argentina':          { lat: -48.90, lon: -70.00 },
  'Chubut, Argentina':              { lat: -43.30, lon: -65.10 },
  'Salta, Argentina':               { lat: -24.70, lon: -65.40 },
  'La Rioja, Argentina':            { lat: -29.40, lon: -66.80 },
  'San Juan, Argentina':            { lat: -31.50, lon: -68.50 },
  'Liaoning, China':                { lat: 41.80, lon: 123.40 },
  'Shandong, China':                { lat: 36.60, lon: 117.00 },
  'Sichuan, China':                 { lat: 30.60, lon: 104.00 },
  'Xinjiang, China':                { lat: 41.80, lon:  85.60 },
  'Tendaguru, Tanzania':            { lat: -9.70,  lon: 39.30 },
  'Montana, USA':                   { lat: 46.90, lon: -110.30 },
  'South Dakota, USA':              { lat: 44.20, lon: -100.20 },
  'Kansas, USA':                    { lat: 38.50, lon: -98.00 },
  'Alberta, Canada':                { lat: 53.90, lon: -116.50 },
  'Colorado, USA':                  { lat: 39.00, lon: -105.30 },
  'Arizona, USA':                   { lat: 34.00, lon: -111.90 },
  'Wyoming, USA':                   { lat: 43.00, lon: -107.20 },
  'New Mexico, USA':                { lat: 34.50, lon: -106.00 },
  'Texas, USA':                     { lat: 31.90, lon: -99.90 },
  'Utah, USA':                      { lat: 39.30, lon: -111.60 },
  'Kem Kem, Morocco':               { lat: 31.20, lon: -4.00 },
  'Bahariya Oasis, Egypt':          { lat: 28.30, lon: 28.90 },
  'Agadez, Niger':                  { lat: 16.97, lon:  7.99 },
  'Gobi Desert, Mongolia':          { lat: 42.50, lon: 103.00 },
  'Sussex, England':                { lat: 50.90, lon: -0.10 },
  'Surrey, England':                { lat: 51.20, lon: -0.40 },
  'Dorset, England':                { lat: 50.70, lon: -2.30 },
  'Bavaria, Germany':               { lat: 48.70, lon: 11.40 },
  'Baden-Württemberg, Germany':     { lat: 48.60, lon:  9.00 },
  'Thuringia, Germany':             { lat: 50.90, lon: 11.00 },
  'Queensland, Australia':          { lat: -20.90, lon: 142.70 },
  'Victoria, Australia':            { lat: -37.00, lon: 144.00 },
  'Mount Kirkpatrick, Antarctica':  { lat: -84.30, lon: 166.20 },
  'Cape Province, South Africa':    { lat: -33.90, lon: 18.40 },
  'Rio Grande do Sul, Brazil':      { lat: -30.00, lon: -51.20 },
  'Madhya Pradesh, India':          { lat: 23.50, lon: 78.60 },
  'Tamil Nadu, India':              { lat: 11.10, lon: 78.60 },
  'Madagascar':                     { lat: -18.70, lon: 46.80 },
};

// Helper to determine active diets
function getActiveDiets(dietString) {
  const ds = (dietString || '').toLowerCase();
  const diets = { fish: false, bug: false, leaf: false, meat: false };
  
  if (ds.includes('carnivore')) diets.meat = true;
  if (ds.includes('herbivore')) diets.leaf = true;
  if (ds.includes('omnivore')) { diets.meat = true; diets.leaf = true; diets.bug = true; }
  if (ds.includes('piscivore')) diets.fish = true;
  if (ds.includes('insectivore')) diets.bug = true;
  
  // If no match but it's defined, maybe default to something or leave blank
  if (ds.includes('unknown') || (!diets.meat && !diets.leaf && !diets.fish && !diets.bug)) {
    // leave all false
  }
  
  return diets;
}

export function initDinoDetail() {
  const container = document.getElementById('dino-detail-container');
  if (!container) return;

  try {
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

    document.title = `${dino.name} | Dino Deets`;

    const imgSrc = dino.image && dino.image.trim() !== '' ? dino.image : '../images/dinos/trex.webp';
    const originalSrc = imgSrc.startsWith('./') ? imgSrc.replace('./', '../') : imgSrc;

    const diets = getActiveDiets(dino.diet);
    
    // Mocking missing data for the sophisticated layout
    const height = dino.height || (dino.length ? (parseFloat(dino.length) * 0.35).toFixed(1) + 'm (est.)' : 'Unknown');
    const nameMeaning = dino.nameMeaning || 'Meaning unknown.';
    const interestingFacts = dino.interestingFacts || [
      'Lived during the ' + dino.period + ' period.',
      'Fossils have been found in ' + dino.location + '.'
    ];

    const locs = (dino.location || '').split(';').map(l => l.trim());

    container.innerHTML = `
      <div class="dd-header">
        <h1 class="dd-title">${dino.name.toUpperCase()}</h1>
        <p class="dd-meaning-subtitle">${nameMeaning}</p>
      </div>
      
      <div class="dd-grid">
        
        <!-- LEFT COLUMN -->
        <div class="dd-col dd-left">
          
          <div class="dd-panel dd-diet">
            <span class="dd-label">Food:</span>
            <div class="dd-diet-icons">
              <i class="fa-solid fa-fish diet-icon ${diets.fish ? 'active' : ''}" title="Fish"></i>
              <i class="fa-solid fa-bug diet-icon ${diets.bug ? 'active' : ''}" title="Bugs"></i>
              <i class="fa-solid fa-leaf diet-icon ${diets.leaf ? 'active' : ''}" title="Plants"></i>
              <i class="fa-solid fa-drumstick-bite diet-icon ${diets.meat ? 'active' : ''}" title="Meat"></i>
            </div>
          </div>

          <div class="dd-panel dd-stat-row">
            <span class="dd-label">Length:</span>
            <span class="dd-value" style="display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><rect x="2" y="9" width="20" height="6" rx="2"></rect><path d="M6 9v3M10 9v6M14 9v3M18 9v6"></path></svg>
              ${dino.length || 'Unknown'}
            </span>
          </div>

          <div class="dd-panel dd-stat-row">
            <span class="dd-label">Height:</span>
            <span class="dd-value" style="display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4"></path></svg>
              ${height}
            </span>
          </div>

          <div class="dd-panel dd-stat-row">
            <span class="dd-label">Weight:</span>
            <span class="dd-value" style="display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M6 21v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M8 15V8a4 4 0 0 1 8 0v7"></path><rect x="4" y="21" width="16" height="2"></rect></svg>
              ${dino.weight || 'Unknown'}
            </span>
          </div>

          <div class="dd-panel dd-class">
            <h3 class="dd-class-title">Scientific Classification:</h3>
            <div class="dd-class-grid">
              <span class="c-label">SUPERORDER:</span><span class="c-val">DINOSAURIA</span>
              <span class="c-label">ORDER:</span><span class="c-val">${dino.scientificClassification?.order || 'Unknown'}</span>
              <span class="c-label">SUBORDER:</span><span class="c-val">${dino.scientificClassification?.suborder || 'Unknown'}</span>
              <span class="c-label">GENUS:</span><span class="c-val">${dino.name.toUpperCase()}</span>
              <span class="c-label">SPECIES:</span><span class="c-val">${dino.scientificClassification?.species || 'Unknown'}</span>
            </div>
          </div>

        </div>

        <!-- CENTER COLUMN -->
        <div class="dd-col dd-center">
          <div class="dd-image-container">
            <img src="${originalSrc}" alt="${dino.name}" class="dd-dino-img" />
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="dd-col dd-right">
          
          <div class="dd-panel dd-location">
            <span class="dd-label">Location & land formation:</span>
            <h3 class="dd-loc-title">${dino.location.toUpperCase()}</h3>
            <span class="dd-loc-sub">${dino.landFormation || 'PREHISTORIC FORMATION'}</span>
            <div class="dd-map-wrap">
              <!-- Loading/Fallback placeholder map -->
              <svg class="dd-map" viewBox="0 0 100 50">
                <ellipse cx="50" cy="25" rx="48" ry="24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
                <path d="M15,15 Q30,5 50,5 T85,15 M15,35 Q30,45 50,45 T85,35 M50,1 L50,49 M30,3 Q20,25 30,47 M70,3 Q80,25 70,47" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.3"/>
              </svg>
            </div>
          </div>

          <div class="dd-panel dd-timeline">
            <div class="dd-time-header">
              <span class="dd-label">Time stages:</span>
              <span class="dd-time-val">${dino.timeStages?.start || '?'}ma - ${dino.timeStages?.end || '?'}ma</span>
            </div>
            <div class="dd-time-chart">
              <div class="dd-stage ${dino.period.includes('Triassic') ? 'active' : ''}">
                <div class="stage-bar"></div>
                <span class="stage-name">TRIASSIC</span>
              </div>
              <div class="dd-stage ${dino.period.includes('Jurassic') ? 'active' : ''}">
                <div class="stage-bar"></div>
                <span class="stage-name">JURASSIC</span>
              </div>
              <div class="dd-stage ${dino.period.includes('Cretaceous') ? 'active' : ''}">
                <div class="stage-bar"></div>
                <span class="stage-name">CRETACEOUS</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BOTTOM SECTION -->
      <div class="dd-bottom-section">
        <div class="dd-panel dd-about-panel">
          <h2 class="dd-bottom-title">About ${dino.name}</h2>
          <p class="dd-desc">${dino.description || 'No description available.'}</p>
        </div>
        
        <div class="dd-panel dd-facts-panel">
          <h2 class="dd-bottom-title">Interesting Facts</h2>
          <ul class="dd-facts-list">
            ${interestingFacts.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Fetch and draw the high-fidelity minimap
    const mapWrap = container.querySelector('.dd-map-wrap');
    if (mapWrap) {
      fetch('../images/map/world-accurate.svg')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load map file');
          return res.text();
        })
        .then(svgText => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const svg = doc.querySelector('svg');
          if (svg) {
            svg.setAttribute('class', 'dd-minimap-svg');
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('viewBox', '0 63.5 3600 1693');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            // Apply theme styles to map paths
            const paths = svg.querySelectorAll('path');
            paths.forEach(p => {
              p.style.fill = '#223f2b';
              p.style.stroke = '#0a170e';
              p.style.strokeWidth = '4px';
            });

            // Create group for pins
            const ns = 'http://www.w3.org/2000/svg';
            const pinsGroup = document.createElementNS(ns, 'g');
            pinsGroup.setAttribute('class', 'dd-minimap-pins');

            locs.forEach(loc => {
              const coords = locationCoords[loc];
              if (coords) {
                // Project coordinates onto 3600x1800 viewBox
                const x = (coords.lon + 180) * 10;
                const y = (90 - coords.lat) * 10;

                // Pulsing ring marker
                const ring = document.createElementNS(ns, 'circle');
                ring.setAttribute('cx', x);
                ring.setAttribute('cy', y);
                ring.setAttribute('r', 60);
                ring.setAttribute('class', 'dd-minimap-pin-ring');

                // Inner dot marker
                const dot = document.createElementNS(ns, 'circle');
                dot.setAttribute('cx', x);
                dot.setAttribute('cy', y);
                dot.setAttribute('r', 25);
                dot.setAttribute('class', 'dd-minimap-pin-dot');

                pinsGroup.appendChild(ring);
                pinsGroup.appendChild(dot);
              }
            });

            svg.appendChild(pinsGroup);
            mapWrap.innerHTML = '';
            mapWrap.appendChild(svg);
          }
        })
        .catch(err => {
          console.error('Error loading minimap:', err);
          // Keep placeholder map visible as fallback
        });
    }

    // Mascot interactive line
    const mascotBubble = document.getElementById('mascot-text');
    if (mascotBubble) {
      mascotBubble.textContent = `Woah! The ${dino.name} weighed ${dino.weight || 'so much'}!`;
    }

  } catch (error) {
    console.error('Error loading dino details:', error);
    renderError(container, 'Oops! Something went wrong loading the dinosaur data.');
  }
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="dino-detail__error-card text-center" style="padding:4rem; color:var(--text-color);">
      <h2>Dino Data Missing</h2>
      <p>${message}</p>
      <a href="/DinoDeets_Website/explore/encyclopedia.html" class="btn btn--primary" style="margin-top: 16px; display: inline-block;">Return to Encyclopedia</a>
    </div>
  `;
}
