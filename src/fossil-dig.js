import encyclopediaData from './data/encyclopedia.json';

document.addEventListener('DOMContentLoaded', () => {
  const svgMap = document.getElementById('vector-world-map');
  const mapWrapper = document.getElementById('vector-map-wrapper');
  if (!svgMap || !mapWrapper) return;

  // Modals & UI
  const introState = document.getElementById('fossil-intro-state');
  const gamePlayInterface = document.getElementById('fossil-game-play-interface');
  const gameState = document.getElementById('fossil-game-state');
  const gameOverState = document.getElementById('fossil-game-over-state');
  const gameOverTitle = document.getElementById('game-over-title');
  const gameOverSubtitle = document.getElementById('game-over-subtitle');
  const statFoundCount = document.getElementById('stat-found-count');
  const statScore = document.getElementById('stat-score');
  const dinoScorecard = document.getElementById('fossil-dino-scorecard');
  const startGameBtn = document.getElementById('start-game-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const fossilTimer = document.getElementById('fossil-timer');
  const fossilTargetsContainer = document.getElementById('fossil-targets');
  const fossilGameTip = document.getElementById('fossil-game-tip');

  // Floating Game Tips Helpers
  function showTip(msg) {
    if (!fossilGameTip) return;
    fossilGameTip.textContent = msg;
    fossilGameTip.classList.add('visible');
  }

  function hideTip() {
    if (!fossilGameTip) return;
    fossilGameTip.classList.remove('visible');
  }

  // Create an HTML tooltip (guarantees perfect text scaling and theming)
  const htmlTooltip = document.createElement('div');
  htmlTooltip.className = 'html-map-tooltip';
  mapWrapper.appendChild(htmlTooltip);

  // Lens Elements
  const digLensContainer = document.getElementById('dig-lens-container');
  const digLens = document.getElementById('dig-lens');
  const digLensTitle = document.getElementById('dig-lens-title');
  const digLensRevealName = document.getElementById('dig-lens-reveal-name');
  const lensPointer = document.getElementById('lens-pointer');
  const buriedDino = document.getElementById('buried-dino');
  const scratchCanvas = document.getElementById('scratch-canvas');
  const closeLensBtn = document.getElementById('close-lens-btn');

  // Game State
  let targets = [];
  let foundCount = 0;
  let timeLeft = 60;
  let totalScore = 0;
  let currentStreak = 0;
  let timerInterval = null;
  let isPlaying = false;

  // Sound generation logic using HTML5 Web Audio API
  function playSound(type) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      
      if (type === 'reveal') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } 
      else if (type === 'success') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.3);
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
        });
      } 
      else if (type === 'failed') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
      else if (type === 'gameStart') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + idx * 0.08 + 0.2);
          osc.start(audioCtx.currentTime + idx * 0.08);
          osc.stop(audioCtx.currentTime + idx * 0.08 + 0.2);
        });
      }
      else if (type === 'ticking-normal') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }
      else if (type === 'ticking-danger') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }
      else if (type === 'timeUp') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc1.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 1.2);
        osc2.frequency.setValueAtTime(122, audioCtx.currentTime);
        osc2.frequency.linearRampToValueAtTime(61, audioCtx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 1.2);
        osc2.stop(audioCtx.currentTime + 1.2);
      }
    } catch (e) {
      console.warn("Web Audio not supported or blocked: ", e);
    }
  }
  
  // Scratch State
  let isDrawing = false;
  let ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });
  let activeDino = null;
  let activeMarkerCoords = null;
  let activeMarkerElement = null;
  const lastShownAtLocation = {};

  // Image assets for soil
  const soilImages = {
    ice: new Image(),
    mud: new Image(),
    sand: new Image(),
    red: new Image(),
    base: new Image() // fallback
  };
  soilImages.ice.src = '../images/textures/soil_ice.webp';
  soilImages.mud.src = '../images/textures/soil_mud.webp';
  soilImages.sand.src = '../images/textures/soil_sand.webp';
  soilImages.red.src = '../images/textures/soil_red.webp';
  soilImages.base.src = '../images/textures/soil_mud.webp'; // default

  // Setup SVG map ViewBox
  svgMap.setAttribute('viewBox', '0 63.5 3600 1693');
  svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Biome Logic (From dino-map.js)
  const BASE = [61, 107, 82];
  const TINT_STRENGTH = 0.30;
  const BIOME_TINTS = {
    ice:      [210, 230, 245],
    desert:   [180, 150, 90],
    tropical: [30, 100, 50],
    boreal:   [70, 110, 95],
    base:     BASE,
  };

  // Map Biome to Soil Texture
  const BIOME_SOIL_MAP = {
    ice: 'ice',
    desert: 'sand',
    tropical: 'mud',
    boreal: 'red',
    base: 'base'
  };

  function blendColor(base, tint) {
    return base.map((b, i) => Math.round(b * (1 - TINT_STRENGTH) + tint[i] * TINT_STRENGTH));
  }

  function rgbToHex([r, g, b]) {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  function classifyBiome(cx, cy) {
    if (cy > 1540) return 'ice';
    if (cy < 250) return 'ice';
    if (cy > 580 && cy < 780 && cx > 1620 && cx < 2200) return 'desert';
    if (cy > 550 && cy < 800 && cx > 2150 && cx < 2400) return 'desert';
    if (cy > 400 && cy < 580 && cx > 2350 && cx < 3000) return 'desert';
    if (cy > 1000 && cy < 1300 && cx > 2950 && cx < 3300) return 'desert';
    if (cy > 750 && cy < 1050 && cx > 1400 && cx < 2100) return 'tropical';
    if (cy > 750 && cy < 1050 && cx > 2400 && cx < 3100) return 'tropical';
    if (cy > 850 && cy < 1050 && cx > 900 && cx < 1350) return 'tropical';
    if (cy > 250 && cy < 400) return 'boreal';
    return 'base';
  }

  // Function to tint continents dynamically once the map is visible in DOM
  function tintContinents() {
    const continentPaths = svgMap.querySelectorAll('#map-continents path');
    continentPaths.forEach(path => {
      try {
        const bbox = path.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        const biome = classifyBiome(cx, cy);
        if (biome !== 'base') {
          const tinted = blendColor(BASE, BIOME_TINTS[biome]);
          path.style.fill = rgbToHex(tinted);
        }
      } catch (e) { /* skip */ }
    });
  }

  // Coordinates data (reuse from map)
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

    'Madagascar':                     { lat: -18.70, lon: 46.80 }
  };

  // Convert lat/lon to equirectangular SVG coords
  function latLonToSVG(lat, lon) {
    const x = (lon + 180) * 10;
    const y = (90 - lat) * 10;
    return { x, y };
  }

  // Game Logic Functions
  function initGame() {
    // Pick 5 random unique targets
    const shuffled = [...encyclopediaData].sort(() => 0.5 - Math.random());
    targets = shuffled.slice(0, 5).map(d => ({ ...d, found: false }));
    foundCount = 0;
    timeLeft = 60; // 1 minute
    totalScore = 0;
    currentStreak = 0;
    isPlaying = true;
    
    updateTimerDisplay();
    renderTargets();
    
    // Clear old markers immediately so they don't animate when display changes to flex
    const oldGroup = document.getElementById('game-markers-group');
    if (oldGroup) oldGroup.remove();
    
    // Clear consecutive click tracking
    for (const key in lastShownAtLocation) delete lastShownAtLocation[key];
    
    playSound('gameStart');
    
    // Toggle UI States
    introState.style.display = 'none';
    gamePlayInterface.style.display = 'flex';
    gameState.style.display = 'flex';
    gameOverState.style.display = 'none';
    digLensContainer.style.display = 'none';

    showTip("🌍 Tip: Click any glowing node on the map to pick a dig site!");

    // Tint continents now that map is visible in DOM
    tintContinents();

    // Reveal Map
    svgMap.classList.remove('fossil-map-hidden');
    svgMap.classList.add('fossil-map-reveal');

    // Delay markers to sync with map animation (reduced to 300ms for fast bouncy popup)
    setTimeout(() => {
      spawnMapMarkers();
    }, 300);

    // Start Timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        endGame(false);
      } else {
        playSound(timeLeft <= 15 ? 'ticking-danger' : 'ticking-normal');
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    fossilTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    if (timeLeft <= 15) { // danger warning at 15 seconds
      fossilTimer.classList.add('danger');
    } else {
      fossilTimer.classList.remove('danger');
    }
  }

  function renderTargets() {
    fossilTargetsContainer.innerHTML = '';
    targets.forEach((dino, idx) => {
      const el = document.createElement('div');
      el.className = `fossil-target ${dino.found ? 'found' : ''}`;
      el.id = `target-${idx}`;
      el.innerHTML = `
        <span class="fossil-target-num">${dino.found ? '✓' : idx + 1}</span>
        <img src=".${dino.image}" alt="${dino.name}">
        <span class="fossil-target-name">${dino.name}</span>
      `;
      fossilTargetsContainer.appendChild(el);
    });
  }

  function spawnMapMarkers() {
    // Clear old markers
    const oldGroup = document.getElementById('game-markers-group');
    if (oldGroup) oldGroup.remove();

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.id = 'game-markers-group';
    svgMap.appendChild(group);

    // Build site data to place ANY dinos
    const siteData = {};
    encyclopediaData.forEach(dino => {
      let locs = dino.location;
      if (typeof locs === 'string') locs = locs.split(';').map(l => l.trim());
      locs.forEach(loc => {
        if (!siteData[loc]) siteData[loc] = [];
        siteData[loc].push(dino);
      });
    });

    Object.keys(siteData).forEach((loc, index) => {
      const coords = locationCoords[loc];
      if (!coords) return;
      const { x, y } = latLonToSVG(coords.lat, coords.lon);
      const biome = classifyBiome(x, y);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'map-marker-group');
      g.style.cursor = 'pointer';
      // Pop-in animation stagger delay under 1s (scaled in place via CSS transform-box: fill-box)
      g.style.animation = `popIn 0.35s cubic-bezier(0.175, 0.885, 0.45, 1.4) ${index * 0.008}s both`;
      
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('cx', x);
      glow.setAttribute('cy', y);
      glow.setAttribute('r', '20');
      glow.setAttribute('class', 'map-marker-glow');
      glow.style.animationDelay = `${(index * 0.3) % 2.5}s`;

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '10');
      dot.setAttribute('class', 'map-marker-dot');

      const hitarea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hitarea.setAttribute('cx', x);
      hitarea.setAttribute('cy', y);
      hitarea.setAttribute('r', '30');
      hitarea.setAttribute('class', 'map-marker-hitarea');

      g.appendChild(glow);
      g.appendChild(dot);
      g.appendChild(hitarea);
      group.appendChild(g);

      // Tooltip hover bubble behavior
      g.addEventListener('mouseenter', () => {
        if (!isPlaying) return;
        htmlTooltip.textContent = loc;
        htmlTooltip.classList.add('visible');
      });

      g.addEventListener('mousemove', (e) => {
        if (!isPlaying) return;
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const xPos = e.clientX - wrapperRect.left;
        const yPos = e.clientY - wrapperRect.top;
        htmlTooltip.style.left = `${xPos}px`;
        htmlTooltip.style.top = `${yPos - 15}px`;
      });

      g.addEventListener('mouseleave', () => {
        htmlTooltip.classList.remove('visible');
      });

      // Handle Click -> Open Lens
      g.addEventListener('click', (e) => {
        activeMarkerElement = g;
        // Find if this location has a target dino
        let dinoAtLocation = null;
        const dinosHere = siteData[loc];
        // Check if any target is in this list
        const foundTarget = targets.find(t => !t.found && dinosHere.some(dh => dh.name === t.name));
        if (foundTarget) {
          dinoAtLocation = foundTarget;
        } else {
          // Select a random dino, rotating through the available ones if clicked consecutively
          const lastDino = lastShownAtLocation[loc];
          let availableDinos = dinosHere;
          if (lastDino && dinosHere.length > 1) {
            availableDinos = dinosHere.filter(d => d.name !== lastDino.name);
          }
          dinoAtLocation = availableDinos[Math.floor(Math.random() * availableDinos.length)];
        }
        lastShownAtLocation[loc] = dinoAtLocation;
        
        openLens(loc, {x, y}, dinoAtLocation, biome, e.clientX, e.clientY);
      });
    });

    // Add popIn animation keyframes if not present
    if (!document.getElementById('game-keyframes')) {
      const style = document.createElement('style');
      style.id = 'game-keyframes';
      style.innerHTML = `
        .map-marker-group {
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function openLens(locationName, svgPoint, dino, biome, clickX, clickY) {
    activeDino = dino;
    activeMarkerCoords = svgPoint;
    
    // Hide hover tooltip when digging starts
    htmlTooltip.classList.remove('visible');
    
    // Setup Lens UI
    digLensTitle.textContent = locationName;
    digLensTitle.style.color = "white";
    digLensRevealName.textContent = "";
    digLensRevealName.style.display = "none";
    
    // Reset fossil filter to B&W at starting
    buriedDino.classList.add('fossil-filter');
    buriedDino.src = `.${dino.image}`;
    buriedDino.style.opacity = '1';
    
    // Position Lens in center of map wrapper
    digLens.style.left = `50%`;
    digLens.style.top = `50%`;
    
    digLensContainer.style.display = 'block';
    digLensContainer.classList.add('active');

    showTip("⛏️ Tip: Drag your cursor or finger inside the lens to start digging!");

    // Setup Canvas dimensions to cover the lens perfectly
    const lensWidth = digLens.clientWidth || 450;
    const lensHeight = digLens.clientHeight || 450;
    scratchCanvas.width = lensWidth;
    scratchCanvas.height = lensHeight;

    // Draw the pointer from lens to dot
    drawPointer();
    
    const soilType = BIOME_SOIL_MAP[biome] || 'base';
    const img = soilImages[soilType];
    
    // Draw soil texture
    ctx.globalCompositeOperation = 'source-over';
    if (img.complete) {
      const pat = ctx.createPattern(img, 'repeat');
      // Scale down soil pattern to make it fine-grained
      const matrix = new DOMMatrix();
      matrix.scaleSelf(0.35, 0.35);
      pat.setTransform(matrix);
      
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    } else {
      ctx.fillStyle = '#4a3f35';
      ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    }
  }

  function drawPointer() {
    if (!activeMarkerElement) return;

    // Get exact marker coordinates from bounding client rect
    const markerRect = activeMarkerElement.getBoundingClientRect();
    const markerCenterX = markerRect.left + markerRect.width / 2;
    const markerCenterY = markerRect.top + markerRect.height / 2;
    
    // Get lens container rect
    const containerRect = digLensContainer.getBoundingClientRect();
    const targetX = markerCenterX - containerRect.left;
    const targetY = markerCenterY - containerRect.top;
    
    // Get lens center coordinates
    const lensRect = digLens.getBoundingClientRect();
    const lensX = (lensRect.left + lensRect.width / 2) - containerRect.left;
    const lensY = (lensRect.top + lensRect.height / 2) - containerRect.top;

    lensPointer.innerHTML = `
      <line 
        x1="${lensX}" y1="${lensY}" 
        x2="${targetX}" y2="${targetY}" 
        stroke="var(--color-amber)" 
        stroke-width="3" 
        stroke-dasharray="10, 5"
        stroke-linecap="round"
      />
      <circle cx="${targetX}" cy="${targetY}" r="15" fill="none" stroke="var(--color-amber)" stroke-width="4" />
    `;
  }

  // Canvas Scratch Logic
  function handleScratch(e) {
    // If the mouse button is not held down, reset isDrawing and return
    if (e.clientX !== undefined && e.buttons !== undefined && e.buttons !== 1) {
      isDrawing = false;
    }
    
    if (!isDrawing) return;
    
    const rect = scratchCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (Math.random() > 0.1) return;
    
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    const pixels = ctx.getImageData(0, 0, w, h).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    
    const percent = transparent / (w * h);
    if (percent > 0.45 && isDrawing) { 
      ctx.clearRect(0, 0, w, h);
      isDrawing = false;
      playSound('reveal'); // Play reveal sweep sound
      handleDinoRevealed();
    }
  }

  function handleDinoRevealed() {
    // Transition dino image to full color
    buriedDino.classList.remove('fossil-filter');

    // Show name below the lens
    digLensRevealName.textContent = activeDino.name;
    digLensRevealName.style.display = "block";

    // Did we find a target?
    const targetIdx = targets.findIndex(t => !t.found && t.name === activeDino.name);
    
    if (targetIdx !== -1) {
      // Found!
      targets[targetIdx].found = true;
      foundCount++;
      currentStreak++;
      const pointsEarned = 1000 * currentStreak;
      totalScore += pointsEarned;
      
      digLensTitle.textContent = `Target Found! +${pointsEarned.toLocaleString()} pts (${currentStreak}x Combo)`;
      digLensTitle.style.color = "var(--color-success)";
      digLensRevealName.style.color = "var(--color-success)";
      renderTargets(); // update sidebar
      triggerConfetti(); // Confetti celebration burst!
      playSound('success'); // Play happy chime arpeggio
      
      if (foundCount >= 5) {
        setTimeout(() => endGame(true), 2000);
      } else {
        setTimeout(() => closeLens(), 2000);
      }
    } else {
      // Not a target
      currentStreak = 0;
      digLensTitle.textContent = "Not a Target (Combo Reset!)";
      digLensTitle.style.color = "#ff4d4d";
      digLensRevealName.style.color = "#ff4d4d";
      playSound('failed'); // Play low buzz sound
      setTimeout(() => closeLens(), 2000);
    }
  }

  function triggerConfetti() {
    const colors = ['#FFD700', '#FF4D4D', '#2ECC71', '#3498DB', '#E74C3C', '#9B59B6', '#F1C40F'];
    const container = document.body;
    
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      
      // Random styles
      const size = Math.random() * 8 + 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = color;
      
      // Position at center of viewport
      p.style.left = `50%`;
      p.style.top = `50%`;
      
      // Random movement variables
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 80;
      const rot = Math.random() * 360 + 360;
      
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', `${rot}deg`);
      
      container.appendChild(p);
      
      // Remove after animation finishes
      setTimeout(() => {
        p.remove();
      }, 1500);
    }
  }

  function closeLens() {
    digLensContainer.style.display = 'none';
    digLensContainer.classList.remove('active');
    lensPointer.innerHTML = '';
    activeDino = null;
    activeMarkerCoords = null;
    activeMarkerElement = null;
    digLensTitle.style.color = "white";
    digLensRevealName.style.display = "none";
    buriedDino.classList.add('fossil-filter');

    if (isPlaying) {
      showTip("🌍 Tip: Click any glowing node on the map to pick a dig site!");
    }
  }

  function endGame(won) {
    isPlaying = false;
    clearInterval(timerInterval);
    closeLens();
    hideTip();
    
    if (!won) {
      playSound('timeUp');
    }
    
    // Hide play interface, show game over screen
    gamePlayInterface.style.display = 'none';
    gameOverState.style.display = 'flex';
    
    // Calculate Score
    const timeBonus = won ? (timeLeft * 100) : 0;
    const score = totalScore + timeBonus;
    
    // Populate stats
    gameOverTitle.textContent = won ? "Dino Discovery Complete!" : "Time's Up!";
    gameOverTitle.style.color = won ? "var(--color-success)" : "var(--color-amber)";
    gameOverSubtitle.textContent = won ? "All Dinosaurs Excavated!" : "Excavation Complete";
    statFoundCount.textContent = `${foundCount}`;
    
    const missingEl = document.getElementById('stat-missing-count');
    if (missingEl) {
      missingEl.textContent = `${5 - foundCount}`;
    }
    
    statScore.textContent = score.toLocaleString();
    
    const scoreBreakdown = document.getElementById('fossil-score-breakdown');
    if (scoreBreakdown) {
      scoreBreakdown.innerHTML = `Combo Digs: <strong>${totalScore.toLocaleString()}</strong> pts | Time Bonus: <strong>${timeBonus.toLocaleString()}</strong> pts`;
    }
    
    // Populate detailed scorecard list
    dinoScorecard.innerHTML = '';
    targets.forEach(dino => {
      const item = document.createElement('div');
      item.className = `scorecard-item ${dino.found ? 'found' : 'missing'}`;
      item.innerHTML = `
        <img src=".${dino.image}" alt="${dino.name}">
        <span class="scorecard-name">${dino.name}</span>
        <span class="scorecard-status">${dino.found ? 'Found ✓' : 'Missing ✗'}</span>
      `;
      dinoScorecard.appendChild(item);
    });
  }

  // Event Listeners
  startGameBtn.addEventListener('click', initGame);
  playAgainBtn.addEventListener('click', initGame);
  closeLensBtn.addEventListener('click', closeLens);

  // Close lens when clicking container backdrop or lens pointer
  digLensContainer.addEventListener('click', (e) => {
    if (e.target === digLensContainer || e.target === lensPointer) {
      closeLens();
    }
  });

  // Scratch events
  scratchCanvas.addEventListener('mousedown', (e) => {
    if (e.buttons === 1) {
      isDrawing = true;
      hideTip();
    }
  });
  scratchCanvas.addEventListener('mouseup', () => isDrawing = false);
  scratchCanvas.addEventListener('mouseenter', (e) => {
    if (e.buttons === 1) {
      isDrawing = true;
      hideTip();
    } else {
      isDrawing = false;
    }
  });
  scratchCanvas.addEventListener('mousemove', handleScratch);
  
  // Touch support
  scratchCanvas.addEventListener('touchstart', (e) => { 
    e.preventDefault(); 
    isDrawing = true; 
    hideTip();
  });
  scratchCanvas.addEventListener('touchend', () => isDrawing = false);
  scratchCanvas.addEventListener('touchcancel', () => isDrawing = false);
  scratchCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); handleScratch(e); });
  
  // Update pointer on window resize
  window.addEventListener('resize', () => {
    if (digLensContainer.style.display === 'block') {
      drawPointer();
    }
  });

});
