import encyclopediaData from './data/encyclopedia.json' with { type: 'json' };

// Real-world lat/lon for each location string.
// The SVG uses Equirectangular projection with viewBox 0 0 3600 1800:
//   svgX = (lon + 180) * 10
//   svgY = (90 - lat) * 10
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

function latLonToSvg(lat, lon) {
  return {
    x: (lon + 180) * 10,
    y: (90 - lat) * 10
  };
}

export function initDinoMapPage() {
  const svgMap = document.getElementById('vector-world-map');
  const panelTitle = document.getElementById('panel-location-title');
  const panelGrid = document.getElementById('panel-dino-grid');
  const mapWrapper = document.getElementById('vector-map-wrapper');

  if (!svgMap || !panelTitle || !panelGrid || !mapWrapper) return;

  // Create an HTML tooltip (guarantees perfect text scaling and theming)
  const htmlTooltip = document.createElement('div');
  htmlTooltip.className = 'html-map-tooltip';
  mapWrapper.appendChild(htmlTooltip);

  // Crop the viewBox tightly to the actual landmasses' bounding box
  // Based on the path data: min_x=0, min_y=63.5, max_x=3600, max_y=1756
  // Width = 3600, Height = 1693
  svgMap.setAttribute('viewBox', '0 63.5 3600 1693');
  // Use 'meet' to guarantee the entire map is always visible without chopping.
  // Any extra space from the user's screen aspect ratio will just show more ocean gradient!
  svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // ── Biome-based tinting ──────────────────────────────────────────────
  // Base land color: #3d6b52 → RGB(61, 107, 82)
  // We apply a 30% tint from each biome's characteristic color
  const BASE = [61, 107, 82];
  const TINT_STRENGTH = 0.30;

  function blendColor(base, tint) {
    return base.map((b, i) =>
      Math.round(b * (1 - TINT_STRENGTH) + tint[i] * TINT_STRENGTH)
    );
  }

  function rgbToHex([r, g, b]) {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  // Biome tint colors (RGB)
  const BIOME_TINTS = {
    ice:      [210, 230, 245], // cold white-blue
    desert:   [180, 150, 90],  // sandy brown
    tropical: [30, 100, 50],   // deeper lush green
    boreal:   [70, 110, 95],   // cool blue-green (barely noticeable)
    base:     BASE,            // no change
  };

  // Classify a path's biome by its SVG centroid (cx, cy)
  // Equirectangular: x = (lon+180)*10, y = (90-lat)*10
  function classifyBiome(cx, cy) {
    // Antarctica: y > 1540 (lat below ~-64°S)
    if (cy > 1540) return 'ice';
    // Arctic / Greenland: y < 250 (lat above ~65°N)
    if (cy < 250) return 'ice';
    // Sahara / North Africa: lat ~15-32°N, lon ~-18° to 40°E
    if (cy > 580 && cy < 780 && cx > 1620 && cx < 2200) return 'desert';
    // Arabian Peninsula / Middle East: lat ~12-35°N, lon ~35-60°E
    if (cy > 550 && cy < 800 && cx > 2150 && cx < 2400) return 'desert';
    // Central Asia (Gobi, steppes): lat ~35-50°N, lon ~60-120°E
    if (cy > 400 && cy < 580 && cx > 2350 && cx < 3000) return 'desert';
    // Australia interior: lat ~-10 to -38°S, lon ~115-150°E
    if (cy > 1000 && cy < 1300 && cx > 2950 && cx < 3300) return 'desert';
    // Tropical band: lat ~-15° to 15° (cy ~750 to 1050)
    if (cy > 750 && cy < 1050 && cx > 1400 && cx < 2100) return 'tropical'; // Africa
    if (cy > 750 && cy < 1050 && cx > 2400 && cx < 3100) return 'tropical'; // SE Asia
    // South America tropical
    if (cy > 850 && cy < 1050 && cx > 900 && cx < 1350) return 'tropical';
    // Northern forests (Canada, Scandinavia, Russia): lat ~50-65°N
    if (cy > 250 && cy < 400) return 'boreal';

    return 'base';
  }

  // Apply tints to all continent paths
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
    } catch (e) { /* skip paths with no bbox */ }
  });

  // Build site data: location string -> array of dinos
  const siteData = {};
  encyclopediaData.forEach(dino => {
    let locs = dino.location;
    if (typeof locs === 'string') {
      locs = locs.split(';').map(l => l.trim());
    }
    locs.forEach(loc => {
      if (!siteData[loc]) siteData[loc] = [];
      siteData[loc].push(dino);
    });
  });

  // Create an SVG group for markers (rendered on top)
  const ns = 'http://www.w3.org/2000/svg';
  const markersGroup = document.createElementNS(ns, 'g');
  markersGroup.setAttribute('id', 'map-markers');
  svgMap.appendChild(markersGroup);

  let activeMarker = null;

  // Stagger animation delays for the pulse effect
  let markerIndex = 0;

  Object.keys(siteData).forEach(loc => {
    const coords = locationCoords[loc];
    if (!coords) {
      console.warn(`No coordinates for location: "${loc}"`);
      return;
    }

    const { x, y } = latLonToSvg(coords.lat, coords.lon);

    // Outer glow circle (larger, pulsing)
    const glow = document.createElementNS(ns, 'circle');
    glow.setAttribute('cx', x);
    glow.setAttribute('cy', y);
    glow.setAttribute('r', 28);
    glow.setAttribute('class', 'map-marker-glow');
    // Stagger each pulse so they don't all blink in sync
    glow.style.animationDelay = `${(markerIndex * 0.3) % 2.5}s`;

    // Inner dot circle (bigger than before)
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', 12);
    dot.setAttribute('class', 'map-marker-dot');

    // Hitarea (invisible larger circle for easier clicking)
    const hitarea = document.createElementNS(ns, 'circle');
    hitarea.setAttribute('cx', x);
    hitarea.setAttribute('cy', y);
    hitarea.setAttribute('r', 30);
    hitarea.setAttribute('class', 'map-marker-hitarea');

    // Group them
    const markerGroup = document.createElementNS(ns, 'g');
    markerGroup.setAttribute('class', 'map-marker-group');
    markerGroup.appendChild(glow);
    markerGroup.appendChild(dot);
    markerGroup.appendChild(hitarea);

    // Mouse events for the HTML tooltip
    markerGroup.addEventListener('mouseenter', () => {
      htmlTooltip.textContent = loc;
      htmlTooltip.classList.add('visible');
    });

    markerGroup.addEventListener('mousemove', (e) => {
      const wrapperRect = mapWrapper.getBoundingClientRect();
      const xPos = e.clientX - wrapperRect.left;
      const yPos = e.clientY - wrapperRect.top;
      htmlTooltip.style.left = `${xPos}px`;
      htmlTooltip.style.top = `${yPos - 15}px`; // slightly above cursor
    });

    markerGroup.addEventListener('mouseleave', () => {
      htmlTooltip.classList.remove('visible');
    });

    // Click handler
    markerGroup.addEventListener('click', () => {
      if (activeMarker) activeMarker.classList.remove('active');
      markerGroup.classList.add('active');
      activeMarker = markerGroup;

      panelTitle.textContent = loc;
      panelGrid.innerHTML = '';

      siteData[loc].forEach(dino => {
        const tile = document.createElement('a');
        tile.href = `/DinoDeets_Website/explore/dino-detail.html?dino=${encodeURIComponent(dino.name)}`;
        tile.className = 'panel-dino-tile';

        const img = document.createElement('img');
        img.src = `../${dino.image.replace('./', '')}`;
        img.alt = dino.name;

        const nameLabel = document.createElement('span');
        nameLabel.textContent = dino.name;

        tile.appendChild(img);
        tile.appendChild(nameLabel);
        panelGrid.appendChild(tile);
      });
    });

    markersGroup.appendChild(markerGroup);
    markerIndex++;
  });
}
