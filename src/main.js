import './style.css';
import { initInteractiveMascot } from './mascot.js';
import { initEncyclopedia } from './encyclopedia.js';
import { initDinoDetail } from './dino-detail.js';
import { initDinoQuizPage } from './dino-quiz.js';
import { initFossilDigPage } from './fossil-dig.js';
import { initDinoMapPage } from './dino-map.js';
import fossilData from './data/fossil-dig.json';
import discoveryData from './data/dino-map.json';
import quizQuestions from './data/quiz.json';
import dinoGlossary from './data/glossary.json';
import timelineData from './data/timeline.json';
import dinoData from './data/encyclopedia.json';
import artData from './data/art.json';
import { resolveAssetPath, normalizeAllImages } from './resolve-path.js';


const { fanArtGallery, coloringPages } = artData;


// Dino image mapping for Random Deet
const dinoImages = {
  'Tyrannosaurus Rex': './images/dinos/trex.webp',
  'Velociraptor': './images/dinos/velociraptor.webp',
  'Triceratops': './images/dinos/triceratops.webp',
  'Stegosaurus': './images/dinos/stegosaurus.webp',
  'Brachiosaurus': './images/dinos/brachiosaurus.webp',
  'default': './images/dinos/trex.webp',
};

function getDinoImage(name) {
  for (const [key, val] of Object.entries(dinoImages)) {
    if (key === 'default') continue;
    if (name.toLowerCase().includes(key.toLowerCase().split(' ')[0])) return val;
  }
  // Rotate through available images for others
  const imgs = Object.values(dinoImages).filter((_, i) => i < 5);
  return imgs[Math.floor(Math.random() * imgs.length)];
}

// ===== NAVIGATION =====
function initNav() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('nav__links--open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('nav__links--open'));
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = links.querySelector(`a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  });
}

// ===== HERO PARTICLES =====
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['rgba(212, 168, 67, 0.45)', 'rgba(76, 175, 80, 0.35)', 'rgba(232, 101, 45, 0.35)'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle--enhanced';
    const size = 3 + Math.random() * 5;
    const borderRadius = 30 + Math.random() * 20;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${60 + Math.random() * 35}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: ${borderRadius}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 10}s;
      animation-duration: ${8 + Math.random() * 8}s;
      box-shadow: 0 0 6px ${colors[Math.floor(Math.random() * colors.length)]};
    `;
    container.appendChild(p);
  }
}

// ===== EPISODES (YouTube RSS) =====
async function loadEpisodes() {
  const grid = document.getElementById('episodes-grid');
  if (!grid) return;

  grid.innerHTML = Array(6).fill('').map(() => `
    <div class="episode-skeleton anim-fade-up">
      <div class="episode-skeleton__thumb"></div>
      <div class="episode-skeleton__body">
        <div class="episode-skeleton__line"></div>
        <div class="episode-skeleton__line episode-skeleton__line--short"></div>
      </div>
    </div>
  `).join('');

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=UCyUZWmztaj_lRgG4n1kt-Ug`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    if (data.status === 'ok' && data.items?.length) {
      renderEpisodes(data.items.slice(0, 6));
    } else { renderFallbackEpisodes(); }
  } catch {
    renderFallbackEpisodes();
  }
}

function renderEpisodes(items) {
  const grid = document.getElementById('episodes-grid');
  grid.innerHTML = items.map((item, i) => {
    const videoId = item.link?.match(/v=([^&]+)/)?.[1] || item.guid?.split(':').pop() || '';
    const thumb = item.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const date = new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const isNew = i === 0;
    return `
      <a href="${item.link || '#'}" target="_blank" rel="noopener"
         class="episode-card anim-fade-up" style="animation-delay: ${i * 0.1}s" id="episode-${i}">
        ${isNew ? '<span class="episode-card__badge">Fresh Release</span>' : ''}
        <div class="episode-card__thumb">
          <img src="${thumb}" alt="${item.title}" loading="lazy" />
          <div class="episode-card__play episode-card__play-mask"><span class="episode-card__play-icon">▶</span></div>
        </div>
        <div class="episode-card__body">
          <h3 class="episode-card__title">${item.title}</h3>
          <span class="episode-card__date"><svg class="inline-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle; margin-bottom: 2px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${date}</span>
        </div>
      </a>`;
  }).join('');
  initScrollAnimations();
}

function renderFallbackEpisodes() {
  const fallback = [
    { title: "The BIGGEST Dinosaur Ever Found!", img: "./images/dinos/brachiosaurus.webp" },
    { title: "T-Rex: King of the Dinosaurs", img: "./images/dinos/trex.webp" },
    { title: "Fossils: How Dinosaurs Become Stones", img: "./images/props/trex-skull.webp" },
    { title: "Underwater Monsters of the Deep", img: "./images/dinos/velociraptor.webp" },
    { title: "The Armored Stegosaurus", img: "./images/dinos/stegosaurus.webp" },
    { title: "India's Own Dinosaurs!", img: "./images/dinos/triceratops.webp" },
  ];
  const grid = document.getElementById('episodes-grid');
  grid.innerHTML = fallback.map((ep, i) => {
    const isNew = i === 0;
    return `
      <a href="https://www.youtube.com/@dinodeets" target="_blank" rel="noopener"
         class="episode-card anim-fade-up" id="episode-${i}">
        ${isNew ? '<span class="episode-card__badge">Fresh Release</span>' : ''}
        <div class="episode-card__thumb">
          <img src="${resolveAssetPath(ep.img)}" alt="${ep.title}" loading="lazy" style="object-fit: cover;" />
          <div class="episode-card__play episode-card__play-mask"><span class="episode-card__play-icon">▶</span></div>
        </div>
        <div class="episode-card__body">
          <h3 class="episode-card__title">${ep.title}</h3>
          <span class="episode-card__date">Watch on YouTube</span>
        </div>
      </a>`;
  }).join('');
  initScrollAnimations();
}



// ===== FOSSIL DIG GAME =====
function initFossilDig() {
  const canvas = document.getElementById('fossil-dig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hint = document.getElementById('fossil-dig-hint');
  const progressFill = document.getElementById('fossil-dig-progress');
  const pctEl = document.getElementById('fossil-dig-pct');
  const resultEl = document.getElementById('fossil-dig-result');
  const newBtn = document.getElementById('fossil-dig-new');

  let currentFossil = null;
  let isDrawing = false;
  let revealed = false;
  let totalPixels = 0;
  let clearedPixels = 0;

  function resizeCanvas() {
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
  }

  function startNewDig() {
    resizeCanvas();
    revealed = false;
    clearedPixels = 0;
    resultEl.style.display = 'none';
    hint.classList.remove('hidden');
    progressFill.style.width = '0%';
    pctEl.textContent = '0%';

    currentFossil = fossilData[Math.floor(Math.random() * fossilData.length)];

    // Draw fossil image underneath
    const fossilImg = new Image();
    fossilImg.src = './images/props/trex-skull.webp';
    fossilImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw dark background
      ctx.fillStyle = '#142420';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw fossil centered
      const scale = Math.min(canvas.width * 0.7 / fossilImg.width, canvas.height * 0.7 / fossilImg.height);
      const w = fossilImg.width * scale;
      const h = fossilImg.height * scale;
      ctx.drawImage(fossilImg, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

      // Draw name label
      ctx.fillStyle = '#D4A843';
      ctx.font = `bold ${Math.max(16, canvas.width * 0.03)}px 'Nunito', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(currentFossil.name, canvas.width / 2, canvas.height - 20);

      // Overlay dirt layer
      const dirtImg = new Image();
      dirtImg.src = './images/props/dig-earth.webp';
      dirtImg.onload = () => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(dirtImg, 0, 0, canvas.width, canvas.height);
        totalPixels = canvas.width * canvas.height;
        ctx.globalCompositeOperation = 'destination-out';
      };
    };
  }

  function brush(x, y) {
    if (revealed) return;
    const radius = Math.max(20, canvas.width * 0.04);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    clearedPixels += Math.PI * radius * radius;

    const pct = Math.min(100, Math.round((clearedPixels / totalPixels) * 100 * 2.5));
    progressFill.style.width = `${pct}%`;
    pctEl.textContent = `${pct}%`;

    if (pct >= 70 && !revealed) {
      revealFossil();
    }
  }

  function revealFossil() {
    revealed = true;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    progressFill.style.width = '100%';
    pctEl.textContent = '100%';

    // Show result
    document.getElementById('fossil-result-name').textContent = currentFossil.name;
    document.getElementById('fossil-result-dino').textContent = currentFossil.dino;
    document.getElementById('fossil-result-era').textContent = currentFossil.era;
    document.getElementById('fossil-result-fact').textContent = currentFossil.funFact;
    const rarityEl = document.getElementById('fossil-result-rarity');
    rarityEl.textContent = currentFossil.rarity;
    rarityEl.className = `fossil-dig__result-rarity ${currentFossil.rarity}`;
    resultEl.style.display = 'block';
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; hint.classList.add('hidden'); const p = getPos(e); brush(p.x, p.y); });
  canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e); brush(p.x, p.y); } });
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; hint.classList.add('hidden'); const p = getPos(e); brush(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) { const p = getPos(e); brush(p.x, p.y); } }, { passive: false });
  canvas.addEventListener('touchend', () => isDrawing = false);

  newBtn.addEventListener('click', startNewDig);
  window.addEventListener('resize', () => { if (!isDrawing) startNewDig(); });

  startNewDig();
}

// ===== DINO MAP =====
function initDinoMap() {
  const pinsContainer = document.getElementById('dino-map-pins');
  const detailEl = document.getElementById('dino-map-detail');
  if (!pinsContainer || !detailEl) return;

  // Map coordinates to percentage positions (Mercator-ish projection)
  function latLngToPercent(lat, lng) {
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 50 - (mercN / Math.PI) * 50;
    // Adjust for image padding/aspect
    return { x: x * 0.88 + 6, y: y * 0.82 + 9 };
  }

  discoveryData.forEach((site, i) => {
    const { x, y } = latLngToPercent(site.lat, site.lng);
    const pin = document.createElement('div');
    pin.className = 'dino-map__pin';
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    pin.style.animationDelay = `${i * 0.3}s`;
    pin.innerHTML = `<span class="dino-map__pin-label">${site.name}</span>`;

    pin.addEventListener('click', () => {
      // Remove active from all pins
      pinsContainer.querySelectorAll('.dino-map__pin').forEach(p => p.classList.remove('dino-map__pin--active'));
      pin.classList.add('dino-map__pin--active');

      detailEl.innerHTML = `
        <div class="dino-map__detail-content">
          <h3 class="dino-map__detail-name">${site.name}</h3>
          <p class="dino-map__detail-location">${site.location}</p>
          <p class="dino-map__detail-desc">${site.description}</p>
          <div class="dino-map__detail-dinos">
            ${site.dinosaurs.map(d => `<span class="dino-map__detail-dino-tag">${d}</span>`).join('')}
          </div>
          <p class="dino-map__detail-era">${site.era}</p>
          <p class="dino-map__detail-year">Discovered: ${site.year}</p>
        </div>
      `;
    });

    pinsContainer.appendChild(pin);
  });
}

// ===== MASCOT =====
// (Mascot logic moved to src/mascot.js)

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('back-to-top--visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== SCROLL ANIMATIONS =====

// ===== DROPDOWNS =====
function initDropdowns() {
  const toggles = document.querySelectorAll('.nav__dropdown-toggle');
  
  toggles.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault(); 
      const targetId = 'dropdown-' + t.dataset.dropdown;
      const targetMenu = document.getElementById(targetId);
      
      document.querySelectorAll('.nav__submenu').forEach(m => {
        if (m !== targetMenu) m.classList.remove('is-open');
      });
      
      if (targetMenu) {
        targetMenu.classList.toggle('is-open');
      }
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__dropdown')) {
      document.querySelectorAll('.nav__submenu').forEach(m => m.classList.remove('is-open'));
    }
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));
}


// ===== EPISODE COUNTDOWN =====
function initCountdown() {
  function getNextFriday() {
    const now = new Date();
    const day = now.getDay();
    let daysUntilFri = (5 - day + 7) % 7;
    
    const nextFri = new Date(now);
    nextFri.setDate(now.getDate() + daysUntilFri);
    nextFri.setUTCHours(11, 30, 0, 0); // 11:30 AM UTC = 5:00 PM IST
    
    if (nextFri <= now) {
      nextFri.setDate(nextFri.getDate() + 7);
    }
    return nextFri;
  }

  const nextFri = getNextFriday();
  const nextEl = document.getElementById('countdown-next');
  if (nextEl) {
    const dateStr = nextFri.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    nextEl.textContent = `New episode: ${dateStr} at 5:00 PM IST`;
  }

  function update() {
    const now = new Date();
    const diff = nextFri - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cd-days', d);
    set('cd-hours', String(h).padStart(2, '0'));
    set('cd-mins', String(m).padStart(2, '0'));
    set('cd-secs', String(s).padStart(2, '0'));
  }
  update();
  countdownInterval = setInterval(update, 1000);
}

// ===== DINO QUIZ =====
function initQuiz() {
  const container = document.getElementById('quiz-container');
  const resultEl = document.getElementById('quiz-result');
  if (!container) return;

  let currentQ = 0;
  let score = 0;
  let answered = false;

  function showQuestion() {
    answered = false;
    const q = quizQuestions[currentQ];
    document.getElementById('quiz-num').textContent = `Question ${currentQ + 1} of ${quizQuestions.length}`;
    document.getElementById('quiz-progress').style.width = `${((currentQ + 1) / quizQuestions.length) * 100}%`;
    document.getElementById('quiz-question').textContent = q.question;

    const imgWrap = document.getElementById('quiz-img-wrap');
    imgWrap.innerHTML = q.image ? `<img src="${resolveAssetPath(q.image)}" alt="" />` : '';

    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <button class="quiz__option" data-index="${i}">${opt}</button>
    `).join('');

    optionsEl.querySelectorAll('.quiz__option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });

    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-next').style.display = 'none';
  }

  function handleAnswer(idx) {
    if (answered) return;
    answered = true;
    const q = quizQuestions[currentQ];
    const options = document.querySelectorAll('.quiz__option');
    options.forEach((btn, i) => {
      btn.classList.add('quiz__option--disabled');
      if (i === q.correct) btn.classList.add('quiz__option--correct');
      if (i === idx && i !== q.correct) btn.classList.add('quiz__option--wrong');
    });
    if (idx === q.correct) score++;

    const feedback = document.getElementById('quiz-feedback');
    feedback.textContent = q.explanation;
    feedback.style.display = 'block';

    const nextBtn = document.getElementById('quiz-next');
    nextBtn.textContent = currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'See Results';
    nextBtn.style.display = 'block';
  }

  document.getElementById('quiz-next')?.addEventListener('click', () => {
    currentQ++;
    if (currentQ < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    container.style.display = 'none';
    resultEl.style.display = 'block';
    document.getElementById('quiz-score').textContent = score;
    const pct = score / quizQuestions.length;
    const titles = ['Keep Exploring!', 'Getting There!', 'Nice Work!', 'Dino Expert!', 'Legendary Paleontologist!'];
    const texts = [
      'Every paleontologist starts somewhere. Try the quiz again!',
      'You know your stuff! A few more episodes and you\'ll be an expert.',
      'Impressive knowledge! You\'re a true dino fan.',
      'Incredible! Devaansh Nara would be proud.',
      'PERFECT SCORE! You are a legendary dinosaur expert! 🏆'
    ];
    const tier = pct === 1 ? 4 : pct >= 0.8 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0;
    document.getElementById('quiz-result-title').textContent = titles[tier];
    document.getElementById('quiz-result-text').textContent = texts[tier];
  }

  document.getElementById('quiz-retry')?.addEventListener('click', () => {
    currentQ = 0;
    score = 0;
    container.style.display = 'block';
    resultEl.style.display = 'none';
    showQuestion();
  });

  showQuestion();
}

// ===== DINO-O-METER =====
function initMeter() {
  const search = document.getElementById('meter-search');
  if (!search) return;

  const selectorList = document.getElementById('meter-selector-list');
  const compareCount = document.getElementById('meter-compare-count');
  const compareSlots = document.getElementById('meter-compare-slots');
  const board = document.getElementById('meter-board');
  const gridOverlay = document.getElementById('meter-grid-overlay');
  const gridDimensions = document.getElementById('meter-grid-dimensions');
  const statsList = document.getElementById('meter-stats-list');

  const addedDinos = [];
  const colors = ['#FF7043', '#4CAF50', '#00BCD4', '#9C27B0'];

  const meterProfileMapping = {
    "Compsognathus": {
      image: "../images/meter/compsognathus.webp",
      comparison: "About the size of a chicken!"
    },
    "Velociraptor": {
      image: "../images/meter/velociraptor.webp",
      comparison: "About the size of a turkey!"
    },
    "Stegosaurus": {
      image: "../images/meter/stegosaurus.webp",
      comparison: "As long as a bus!"
    },
    "Triceratops": {
      image: "../images/meter/triceratops.webp",
      comparison: "Heavy as an elephant!"
    },
    "Tyrannosaurus Rex": {
      image: "../images/meter/trex.webp",
      comparison: "Tall as a giraffe!"
    },
    "Brachiosaurus": {
      image: "../images/meter/brachiosaurus.webp",
      comparison: "Could peek into a 4th-floor window!"
    },
    "Argentinosaurus": {
      image: "../images/meter/argentinosaurus.webp",
      comparison: "Heavier than 14 elephants combined!"
    },
    "Ankylosaurus": {
      image: "../images/meter/ankylosaurus.webp",
      comparison: "Low to the ground and armored like a battle tank!"
    },
    "Spinosaurus": {
      image: "../images/meter/spinosaurus.webp",
      comparison: "The longest predatory dinosaur, even longer than a Tyrannosaurus Rex!"
    },
    "Carnotaurus": {
      image: "../images/meter/carnotaurus.webp",
      comparison: "A fast meat-eater with short bull-like horns!"
    },
    "Allosaurus": {
      image: "../images/meter/allosaurus.webp",
      comparison: "The apex predator of the Jurassic period!"
    },
    "Diplodocus": {
      image: "../images/meter/diplodocus.webp",
      comparison: "Famous for its whip-like tail and long neck!"
    },
    "Parasaurolophus": {
      image: "../images/meter/parasaurolophus.webp",
      comparison: "Has a long curved crest used to trumpet calls!"
    }
  };

  function generateDynamicComparison(dino) {
    const height = parseFloat(dino.height) || 0;
    const length = parseFloat(dino.length) || 0;
    
    let weightKg = 0;
    if (dino.weight) {
      const weightVal = parseFloat(dino.weight.replace(/[^0-9.]/g, ''));
      if (!isNaN(weightVal)) {
        if (dino.weight.toLowerCase().includes('ton') || dino.weight.toLowerCase().includes('t ') || dino.weight.toLowerCase().endsWith('t')) {
          weightKg = weightVal * 1000;
        } else {
          weightKg = weightVal;
        }
      }
    }

    if (height > 12) {
      return "Taller than a 4-story building!";
    } else if (height > 6) {
      return "Could peek into a 2nd-floor window!";
    } else if (weightKg > 40000) {
      return "Heavier than 8 school buses!";
    } else if (weightKg > 20000) {
      return "Heavier than 4 large elephants!";
    } else if (weightKg > 5000) {
      return "Weighed as much as a Tyrannosaurus Rex!";
    } else if (length > 25) {
      return "Longer than two school buses parked end-to-end!";
    } else if (length > 15) {
      return "Longer than a bowling lane!";
    } else if (length > 8) {
      return "As long as a large motorhome!";
    } else if (height > 3.5) {
      return "Tall as a double-decker bus!";
    } else if (height > 1.8) {
      return "Taller than a tall adult human!";
    } else if (weightKg > 1000) {
      return "Weighed as much as a small car!";
    } else if (weightKg > 200) {
      return "Heavy as a grizzly bear!";
    } else if (length > 3) {
      return "Longer than a compact car!";
    } else if (length > 1.5) {
      return "About the size of a large dog!";
    } else if (weightKg > 0 && weightKg < 10) {
      return "Light as a house cat!";
    } else {
      return "About the size of a human!";
    }
  }

  function getDinoStats(dino) {
    const name = dino.name;
    let image = "";
    let comparison = "";

    if (meterProfileMapping.hasOwnProperty(name)) {
      image = meterProfileMapping[name].image;
      comparison = meterProfileMapping[name].comparison;
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      image = `../images/meter/${slug}.webp`;
      comparison = generateDynamicComparison(dino);
    }

    return {
      name: dino.name,
      length: parseFloat(dino.length) || 0,
      height: parseFloat(dino.height) || 0,
      weight: dino.weight || "Unknown",
      diet: dino.diet || "Unknown",
      image: image,
      comparison: comparison
    };
  }

  function renderCompare() {
    const maxHeight = Math.max(1.8, ...addedDinos.map(d => d.height));
    const H_max = Math.max(2.5, maxHeight * 1.15);

    // Build entity data
    const entities = [
      {
        name: "Human (for scale)", length: 0.5, height: 1.8,
        image: "../images/meter/human.webp", color: "#555555",
        weight: "70 kg", comparison: "That's you!", isHuman: true
      },
      ...addedDinos.map((dino, idx) => ({
        ...dino, color: colors[idx % colors.length]
      }))
    ];

    // Render entities into the flex container (no absolute positioning!)
    const entitiesRow = document.getElementById('meter-entities-row');
    const drawableHeight = entitiesRow ? (entitiesRow.clientHeight || 350) : 350;

    const html = entities.map(entity => {
      // Height in pixels based on proportion to H_max and drawable height
      const heightPx = Math.round((entity.height / H_max) * drawableHeight);
      const cleanSrc = resolveAssetPath(entity.image);
      const cls = entity.isHuman ? ' meter__entity--human' : '';
      return `
        <div class="meter__entity${cls}" style="height:${heightPx}px; --dino-color:${entity.color};">
          <img src="${cleanSrc}" alt="${entity.name}" class="meter__entity-img"/>
          <div class="meter__entity-tooltip" style="border-color:${entity.color};">
            <strong>${entity.name}</strong><br/>
            Height: ${entity.height.toFixed ? entity.height.toFixed(1) : entity.height}m<br/>
            Length: ${entity.length.toFixed ? entity.length.toFixed(1) : entity.length}m<br/>
            Weight: ${entity.weight}<br/>
            <em>${entity.comparison}</em>
          </div>
        </div>`;
    }).join('');
    entitiesRow.innerHTML = html;

    // Render height grid lines (height axis is what matters for comparison)
    gridDimensions.textContent = `${H_max.toFixed(1)}m`;

    let gridHtml = '';
    let hStep = 1;
    if (H_max > 10) hStep = 2;
    for (let y = hStep; y < H_max; y += hStep) {
      const bp = (y / H_max) * 100;
      gridHtml += `<div class="meter__grid-line-h" style="bottom:${bp}%"></div>
        <span class="meter__grid-label-h" style="bottom:${bp}%">${y}m</span>`;
    }
    gridOverlay.innerHTML = gridHtml;

    // Update slots, count, and stats (synchronous — doesn't depend on images)
    let slotsHtml = '';
    for (let i = 0; i < 4; i++) {
      const dino = addedDinos[i];
      if (dino) {
        slotsHtml += `
          <div class="meter__compare-slot meter__compare-slot--active" style="border-left: 4px solid ${colors[i]};">
            <span class="meter__compare-slot-name">${dino.name}</span>
            <button class="meter__compare-slot-remove" data-idx="${i}">&times;</button>
          </div>`;
      } else {
        slotsHtml += `
          <div class="meter__compare-slot">
            <span class="text-muted" style="font-size: 0.8rem; font-style: italic;">Empty Slot</span>
          </div>`;
      }
    }
    compareSlots.innerHTML = slotsHtml;
    compareCount.textContent = addedDinos.length;

    // Attach remove listeners
    compareSlots.querySelectorAll('.meter__compare-slot-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        addedDinos.splice(idx, 1);
        renderCompare();
        renderSelectorList();
      });
    });

    // Render comparison stats
    if (addedDinos.length === 0) {
      statsList.innerHTML = '<p class="text-muted" style="margin: 0; font-size: 0.9rem; font-style: italic;">Add some dinosaurs to see how they stack up against a human!</p>';
    } else {
      statsList.innerHTML = addedDinos.map((dino, idx) => {
        const heightTimes = (dino.height / 1.8).toFixed(1);
        const lengthTimes = (dino.length / 0.5).toFixed(1);
        const weightVal = parseFloat(dino.weight.replace(/[^0-9.]/g, ''));
        const weightTimes = !isNaN(weightVal) ? (weightVal / 70).toFixed(0) : 0;

        let factText = `The <strong>${dino.name}</strong> was ${heightTimes}x taller and ${lengthTimes}x longer than a human!`;
        if (weightTimes > 1) {
          factText += ` It weighed as much as ${weightTimes} humans!`;
        }

        return `
          <div class="meter__stat-item" style="border-left-color: ${colors[idx]}; --dino-color: ${colors[idx]};">
            <span class="meter__stat-bullet" style="color: ${colors[idx]};">&bull;</span>
            <p style="margin: 0; font-size: 0.88rem;">${factText} <em>${dino.comparison}</em></p>
          </div>`;
      }).join('');
    }
  }

  function renderSelectorList() {
    const searchVal = search.value.toLowerCase().trim();
    const activeFilterBtn = document.querySelector('.meter__filter-btn--active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    const filtered = dinoData.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchVal);
      const matchesFilter = activeFilter === 'all' || d.diet === activeFilter;
      return matchesSearch && matchesFilter;
    });

    selectorList.innerHTML = filtered.map(d => {
      const isAdded = addedDinos.some(ad => ad.name === d.name);
      const itemClass = isAdded ? 'meter__select-item meter__select-item--disabled' : 'meter__select-item';
      const icon = isAdded ? '&#10003;' : '+';
      
      const profileSrc = meterProfileMapping.hasOwnProperty(d.name)
        ? resolveAssetPath(meterProfileMapping[d.name].image)
        : resolveAssetPath(`images/meter/${d.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`);

      const parsedHeight = parseFloat(d.height) || 0;
      const parsedLength = parseFloat(d.length) || 0;

      return `
        <div class="${itemClass}" data-dino="${d.name}" style="${isAdded ? 'opacity: 0.5; pointer-events: none;' : ''}">
          <img src="${profileSrc}" alt="" class="meter__select-item-img" />
          <div class="meter__select-item-info">
            <h4 class="meter__select-item-name">${d.name}</h4>
            <p class="meter__select-item-sizes">H: ${parsedHeight.toFixed(1)}m | L: ${parsedLength.toFixed(1)}m | ${d.diet}</p>
          </div>
          <span class="meter__select-add-icon" style="${isAdded ? 'color: #4CAF50;' : ''}">${icon}</span>
        </div>
      `;
    }).join('') || '<p class="text-muted" style="text-align: center; margin: 20px 0;">No dinosaurs found.</p>';

    // Add click listeners to select items
    selectorList.querySelectorAll('.meter__select-item:not(.meter__select-item--disabled)').forEach(item => {
      item.addEventListener('click', () => {
        const dinoName = item.dataset.dino;
        const dino = dinoData.find(d => d.name === dinoName);
        const isAdded = addedDinos.some(ad => ad.name === dinoName);

        if (!isAdded && addedDinos.length < 4 && dino) {
          addedDinos.push(getDinoStats(dino));
          renderCompare();
          renderSelectorList();
          // Auto-close picker after adding
          closePicker();
        }
      });
    });
  }

  // === Modal Picker Logic ===
  const pickerOverlay = document.getElementById('meter-picker-overlay');
  const pickerCloseBtn = document.getElementById('meter-picker-close');
  const addBtn = document.getElementById('meter-add-btn');

  function openPicker() {
    if (addedDinos.length >= 4) return;
    renderSelectorList();
    pickerOverlay.classList.add('meter__picker-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closePicker() {
    pickerOverlay.classList.remove('meter__picker-overlay--open');
    document.body.style.overflow = '';
  }

  addBtn.addEventListener('click', openPicker);
  pickerCloseBtn.addEventListener('click', closePicker);
  pickerOverlay.addEventListener('click', (e) => {
    if (e.target === pickerOverlay) closePicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pickerOverlay.classList.contains('meter__picker-overlay--open')) {
      closePicker();
    }
  });

  // Update add button state
  function updateAddBtnState() {
    addBtn.disabled = addedDinos.length >= 4;
  }

  // Wrap renderCompare to also update button state
  const _origRenderCompare = renderCompare;
  renderCompare = function() {
    _origRenderCompare();
    updateAddBtnState();
  };

  // Filter click handlers
  document.querySelectorAll('.meter__filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.meter__filter-btn').forEach(b => b.classList.remove('meter__filter-btn--active'));
      btn.classList.add('meter__filter-btn--active');
      renderSelectorList();
    });
  });

  search.addEventListener('input', renderSelectorList);

  // Initial render
  renderSelectorList();
  renderCompare();
}

// ===== TIMELINE =====
function initTimeline() {
  const track = document.getElementById('timeline-vertical-track');
  if (!track) return;

  const stageDetails = {
    // Triassic
    "Induan": { range: "252 – 251 MYA", fact: "The very beginning of the Triassic, right after the Great Dying extinction." },
    "Olenekian": { range: "251 – 247 MYA", fact: "Earth was hot and dry. Early reptiles began adapting to the desert heat." },
    "Anisian": { range: "247 – 242 MYA", fact: "Lush plants started returning. Early cousins of dinosaurs started walking upright." },
    "Ladinian": { range: "242 – 237 MYA", fact: "The landmass of Pangaea was massive. Crocodile-like predators ruled the rivers." },
    "Carnian": { range: "237 – 227 MYA", fact: "The first true dinosaurs, like Eoraptor, appeared during this rainy age!" },
    "Norian": { range: "227 – 208 MYA", fact: "Early long-necked sauropod relatives and flying pterosaurs took to the skies." },
    "Rhaetian": { range: "208 – 201 MYA", fact: "Ended with huge volcanic eruptions that cleared the way for dinosaurs to dominate." },
    // Jurassic
    "Hettangian": { range: "201 – 199 MYA", fact: "Dinosaurs survived the extinction and started growing larger." },
    "Sinemurian": { range: "199 – 191 MYA", fact: "Armored dinosaurs like Scelidosaurus began to develop plates for defense." },
    "Pliensbachian": { range: "191 – 183 MYA", fact: "Continents began to drift apart, creating new oceans and coastlines." },
    "Toarcian": { range: "183 – 174 MYA", fact: "A time of major ocean warming, with giant sea monsters like Ichthyosaurs ruling the seas." },
    "Aalenian": { range: "174 – 171 MYA", fact: "Ferns and conifers thrived in a warm, moist, greenhouse-like climate." },
    "Bajocian": { range: "171 – 168 MYA", fact: "Early stegosaurs and giant sauropods began browsing high up in tree canopies." },
    "Bathonian": { range: "168 – 165 MYA", fact: "Megalosaurus, one of the first giant meat-eaters, hunted in European forests." },
    "Callovian": { range: "165 – 163 MYA", fact: "Huge marine reptiles like Liopleurodon ruled the warm shallow seas." },
    "Oxfordian": { range: "163 – 157 MYA", fact: "Warm coral reefs grew in the oceans, while Archaeopteryx began gliding through trees." },
    "Kimmeridgian": { range: "157 – 152 MYA", fact: "Stegosaurus and Allosaurus faced off in classic prehistoric duels." },
    "Tithonian": { range: "152 – 145 MYA", fact: "Massive herds of long-necked giants migrated across open plains." },
    // Cretaceous
    "Berriasian": { range: "145 – 140 MYA", fact: "The start of the Cretaceous period. Early flowering plants made their debut." },
    "Valanginian": { range: "140 – 134 MYA", fact: "Temperatures cooled slightly, and dinosaurs evolved feathers for warmth." },
    "Hauterivian": { range: "134 – 129 MYA", fact: "Early bird-like dinosaurs diversified, learning to flap their wings." },
    "Barremian": { range: "129 – 125 MYA", fact: "Fierce raptors like Utahraptor hunted in packs using giant toe claws." },
    "Aptian": { range: "125 – 113 MYA", fact: "Flowering plants began to attract early insects like bees and beetles." },
    "Albian": { range: "113 – 100 MYA", fact: "Colossal dinosaurs like Spinosaurus adapted to life in rivers and swamps." },
    "Cenomanian": { range: "100 – 94 MYA", fact: "Giganotosaurus and Argentinosaurus had epic battles in South America." },
    "Turonian": { range: "94 – 90 MYA", fact: "High sea levels flooded land, creating warm inland seaways filled with sharks." },
    "Coniacian": { range: "90 – 86 MYA", fact: "Plesiosaurs and Mosasaurs became the apex predators of the Cretaceous oceans." },
    "Santonian": { range: "86 – 83 MYA", fact: "Horned dinosaurs like Protoceratops started developing protective frills." },
    "Campanian": { range: "83 – 72 MYA", fact: "Duck-billed dinosaurs like Parasaurolophus used hollow crests to trumpet calls." },
    "Maastrichtian": { range: "72 – 66 MYA", fact: "The grand finale of the dinosaur age, ending with the famous asteroid impact." }
  };

  track.innerHTML = timelineData.map(era => {
    const subperiodsHtml = era.subperiods.map(subperiod => {
      // Group dinosaurs by subperiod
      const subDinos = dinoData.filter(d => {
        const p = (d.period || '').toLowerCase().trim();
        const subName = subperiod.name.toLowerCase().trim();
        if (subName === 'late cretaceous') {
          return p === 'late cretaceous' || p === 'paleogene';
        }
        return p === subName;
      });

      // Meet the Dinosaurs section with custom kid-friendly explanations for Triassic empty states
      let dinosHtml = '';
      if (subDinos.length > 0) {
        dinosHtml = `
          <div class="timeline__dinos-section">
            <h4 class="timeline__dinos-header">Meet the Dinosaurs</h4>
            <div class="timeline__dino-grid">
              ${subDinos.map(dino => {
                  const imgSrc = dino.image && dino.image.trim() !== '' ? dino.image : 'images/dinos/trex.webp';
                  const cleanSrc = resolveAssetPath(imgSrc);
                  return `
                  <a href="/DinoDeets_Website/explore/dino-detail.html?dino=${encodeURIComponent(dino.name)}" class="timeline__dino-icon" style="background-image: url('${cleanSrc}'); border-color: ${era.color};" data-dino="${dino.name}">
                    <div class="timeline__dino-bubble" style="--bubble-color: ${era.color}; color: #0E1A16;">
                      <p class="timeline__dino-bubble-name">${dino.name}</p>
                      <p class="timeline__dino-bubble-diet">${dino.diet}</p>
                    </div>
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        `;
      } else {
        let emptyMessage = 'No dinosaurs found for this subperiod.';
        if (subperiod.name === 'Early Triassic') {
          emptyMessage = '<strong>Did you know?</strong> True dinosaurs hadn\'t evolved yet! Earth was slowly recovering from a massive extinction, ruled by ancient reptiles like the shovel-faced <em>Lystrosaurus</em>.';
        } else if (subperiod.name === 'Middle Triassic') {
          emptyMessage = '<strong>Did you know?</strong> The first tiny dinosaur cousins (Dinosauromorphs) were just beginning to run around, but true dinosaurs wouldn\'t evolve for another 10 million years!';
        }
        dinosHtml = `
          <div class="timeline__dinos-section">
            <h4 class="timeline__dinos-header">Meet the Dinosaurs</h4>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.45; margin: 0; background: rgba(0,0,0,0.18); padding: 12px 16px; border-radius: 8px; border-left: 3px solid ${era.color};">${emptyMessage}</p>
          </div>
        `;
      }

      // Geological ages/stages horizontal chip view with detailed tooltips
      const agesHtml = subperiod.ages && subperiod.ages.length > 0 ? `
        <div class="timeline__stages-wrapper">
          <div class="timeline__stages-title" style="color: ${era.color};">Geological Stages (Hover for Details)</div>
          <div class="timeline__stages-grid">
            ${subperiod.ages.map(age => {
              const info = stageDetails[age] || { range: "TBD", fact: "A fascinating geological age." };
              return `
                <div class="timeline__stage-chip" style="--era-color-alpha: ${era.color}1c; --era-color: ${era.color};">
                  ${age}
                  <div class="timeline__stage-tooltip" style="--bubble-color: ${era.color}; color: #0E1A16;">
                    <p class="timeline__stage-tooltip-title">${age}</p>
                    <p class="timeline__stage-tooltip-range">${info.range}</p>
                    <p class="timeline__stage-tooltip-fact">${info.fact}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : '';

      // Events (Milestones) HTML
      const eventsHtml = subperiod.events && subperiod.events.length > 0 ? `
        <div class="timeline__events-section">
          <h4 class="timeline__dinos-header">Key Milestones</h4>
          <div class="timeline__vertical-events">
            ${subperiod.events.map(ev => {
              const evImgSrc = ev.image ? resolveAssetPath(ev.image) : '';
              return `
                <div class="timeline__vertical-event">
                  <span class="timeline__event-year-pill" style="background: ${era.color}; color: #0E1A16;">${ev.year}</span>
                  <div class="timeline__event-content">
                    ${evImgSrc ? `<img src="${evImgSrc}" alt="" class="timeline__event-img" />` : ''}
                    <h5 class="timeline__event-title">${ev.title}</h5>
                    <p class="timeline__event-desc">${ev.desc}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : '';

      return `
        <div class="timeline__vertical-subperiod" style="border-left-color: ${era.color}; --era-color: ${era.color};">
          <div class="timeline__subperiod-node" style="border-color: ${era.color}; --era-color: ${era.color};"></div>
          <h3 class="timeline__subperiod-title">${subperiod.name} <span class="timeline__subperiod-years">${subperiod.years}</span></h3>
          <p class="timeline__subperiod-desc">${subperiod.description}</p>
          
          ${agesHtml}
          ${dinosHtml}
          ${eventsHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="timeline__vertical-era" style="--era-color: ${era.color};">
        <div class="timeline__era-node" style="background: ${era.color};"></div>
        <div class="timeline__era-header-wrap">
          <h2 class="timeline__era-title" style="color: ${era.color};">${era.era} Period</h2>
          <span class="timeline__era-years">${era.years}</span>
          <p class="timeline__era-desc">${era.description}</p>
        </div>
        
        <div class="timeline__subperiods-container">
          ${subperiodsHtml}
        </div>
      </div>
    `;
  }).join('');


}

// ===== DICTIONARY =====
function initDictionary() {
  const listEl = document.getElementById('dictionary-list');
  const lettersEl = document.getElementById('dictionary-letters');
  const searchEl = document.getElementById('dictionary-search');
  if (!listEl) return;

  const usedLetters = new Set(dinoGlossary.map(g => g.term[0].toUpperCase()));
  let activeLetter = null;

  // Render letter buttons
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    const btn = document.createElement('button');
    btn.className = `dictionary__letter${usedLetters.has(letter) ? '' : ' dictionary__letter--disabled'}`;
    btn.textContent = letter;
    btn.addEventListener('click', () => {
      activeLetter = activeLetter === letter ? null : letter;
      renderList();
      lettersEl.querySelectorAll('.dictionary__letter').forEach(b => {
        b.classList.toggle('dictionary__letter--active', b.textContent === activeLetter);
      });
    });
    lettersEl.appendChild(btn);
  });

  function renderList(filter = '') {
    let items = dinoGlossary;
    if (activeLetter) items = items.filter(g => g.term[0].toUpperCase() === activeLetter);
    if (filter) items = items.filter(g => g.term.toLowerCase().includes(filter) || g.definition.toLowerCase().includes(filter));

    listEl.innerHTML = items.map(g => `
      <div class="dictionary__item">
        <h4 class="dictionary__term">${g.term}</h4>
        <p class="dictionary__def">${g.definition}</p>
        <span class="dictionary__cat">${g.category}</span>
      </div>
    `).join('') || '<p style="color: var(--color-text-muted); text-align: center; grid-column: 1/-1;">No terms found. Try a different search!</p>';
  }

  searchEl.addEventListener('input', () => {
    activeLetter = null;
    lettersEl.querySelectorAll('.dictionary__letter').forEach(b => b.classList.remove('dictionary__letter--active'));
    renderList(searchEl.value.toLowerCase());
  });

  renderList();
}

// ===== ASK DEVAANSH =====
function initAskForm() {
  // 1. Clean up any existing instances in document.body
  const existingFabs = document.querySelectorAll('body > #ask-devaansh-fab');
  const existingModals = document.querySelectorAll('body > #ask-devaansh-modal');
  existingFabs.forEach(el => el.remove());
  existingModals.forEach(el => el.remove());

  // 2. Check if we are on the homepage
  const path = window.location.pathname;
  const isHomepage = path === '/' || path === '/index.html' || path === '/DinoDeets_Website/' || path === '/DinoDeets_Website/index.html';

  if (!isHomepage) {
    // If not homepage, we are done (any old ones are removed, and there are no new ones)
    return;
  }

  // 3. We are on the homepage, get the fresh elements from the wrapper
  const fab = document.getElementById('ask-devaansh-fab');
  const modal = document.getElementById('ask-devaansh-modal');
  const closeBtn = document.getElementById('ask-modal-close');
  const form = document.getElementById('ask-form');
  const success = document.getElementById('ask-success');
  
  if (!modal || !form || !success) return;

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleEscape);
  }

  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
  }

  // Move them outside the content wrapper to the body so position: fixed is relative to the viewport
  document.body.appendChild(fab);
  document.body.appendChild(modal);

  // Bind event listeners
  fab?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.style.display = 'block';
  });

  document.getElementById('ask-another')?.addEventListener('click', () => {
    form.reset();
    form.style.display = 'grid';
    success.style.display = 'none';
  });

  // Ensure it is visible
  if (fab) fab.style.display = 'flex';
}



// ===== FAN ART GALLERY =====
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = fanArtGallery.map((art, i) => `
    <div class="gallery__card" data-idx="${i}">
      <img src="${resolveAssetPath(art.image)}" alt="${art.title}" class="gallery__card-img" loading="lazy" />
      <div class="gallery__card-info">
        <span class="gallery__card-likes">♥ ${art.likes}</span>
        <h3 class="gallery__card-title">${art.title}</h3>
        <p class="gallery__card-artist">${art.artist}</p>
      </div>
    </div>
  `).join('');

  const lightbox = document.getElementById('gallery-lightbox');
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery__card');
    if (!card) return;
    const art = fanArtGallery[parseInt(card.dataset.idx)];
    document.getElementById('gallery-lightbox-img').src = resolveAssetPath(art.image);
    document.getElementById('gallery-lightbox-title').textContent = art.title;
    document.getElementById('gallery-lightbox-artist').textContent = art.artist;
    lightbox.style.display = 'flex';
  });

  document.getElementById('gallery-close')?.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });
}

// ===== COLORING PAGES =====
function initColoringPages() {
  const grid = document.getElementById('coloring-grid');
  if (!grid) return;

  grid.innerHTML = coloringPages.map(page => `
    <div class="coloring__card">
      <img src="${resolveAssetPath(page.image)}" alt="${page.name}" class="coloring__card-img" loading="lazy" />
      <div class="coloring__card-info">
        <h3 class="coloring__card-name">${page.name}</h3>
        <p class="coloring__card-diff">Difficulty: ${page.difficulty}</p>
        <a href="${resolveAssetPath(page.image)}" download="DinoDeets-${page.name.replace(/\s+/g, '-')}.webp" class="coloring__download">
          Download & Print
        </a>
      </div>
    </div>
  `).join('');
}


// ===== PAGE TRANSITIONS & PJAX ROUTING =====
let pageCleanups = [];
let countdownInterval = null;

window.registerPageCleanup = function(fn) {
  pageCleanups.push(fn);
};

function runPageCleanups() {
  pageCleanups.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Error during page cleanup:', e);
    }
  });
  pageCleanups = [];
}

function wrapPageContent() {
  let wrapper = document.getElementById('app-content-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'app-content-wrapper';
    
    const nav = document.getElementById('main-nav');
    const footer = document.getElementById('footer');
    if (nav && footer) {
      footer.parentNode.insertBefore(wrapper, footer);
      
      let next = nav.nextSibling;
      while (next && next !== wrapper) {
        const current = next;
        next = next.nextSibling;
        wrapper.appendChild(current);
      }
    }
  }
}

function initPageContent() {
  runPageCleanups();
  normalizeAllImages();

  initParticles();
  loadEpisodes();
  initFossilDig();
  initDinoMap();
  
  // Re-initialize countdown with safety check
  if (countdownInterval) clearInterval(countdownInterval);
  const nextEl = document.getElementById('countdown-next');
  if (nextEl) {
    initCountdown();
  }
  
  initQuiz();
  initMeter();
  initTimeline();
  initDictionary();
  initAskForm();
  initGallery();
  initColoringPages();
  initEncyclopedia();
  initDinoDetail();

  // Page bundle initializers
  initDinoQuizPage();
  initFossilDigPage();
  initDinoMapPage();

  initScrollAnimations();
  initSmoothLinks();
  
  updateNavbarActiveLinks();
}

let progressBarEl = null;
let progressInterval = null;
let progressWidth = 0;

function createProgressBar() {
  if (!progressBarEl) {
    progressBarEl = document.createElement('div');
    progressBarEl.className = 'page-progress-bar';
    document.body.appendChild(progressBarEl);
  }
}

function startProgressBar() {
  createProgressBar();
  progressBarEl.style.opacity = '1';
  progressBarEl.style.width = '0%';
  progressWidth = 0;
  
  if (progressInterval) clearInterval(progressInterval);
  
  setTimeout(() => {
    if (progressBarEl) {
      progressBarEl.style.width = '10%';
      progressWidth = 10;
    }
  }, 10);
  
  progressInterval = setInterval(() => {
    if (progressWidth < 90) {
      const inc = (90 - progressWidth) * 0.15 * Math.random();
      progressWidth += inc;
      if (progressBarEl) progressBarEl.style.width = `${progressWidth}%`;
    }
  }, 150);
}

function finishProgressBar() {
  if (progressInterval) clearInterval(progressInterval);
  if (progressBarEl) {
    progressBarEl.style.width = '100%';
    setTimeout(() => {
      if (progressBarEl) {
        progressBarEl.style.opacity = '0';
        setTimeout(() => {
          if (progressBarEl && progressBarEl.style.opacity === '0') {
            progressBarEl.style.width = '0%';
          }
        }, 300);
      }
    }, 200);
  }
}

function getPageContentElements(doc = document) {
  const elements = [];
  const nav = doc.getElementById('main-nav');
  const footer = doc.getElementById('footer');
  if (!nav || !footer) {
    const main = doc.querySelector('main');
    if (main) return [main];
    return Array.from(doc.body.children).filter(el => {
      return el.tagName !== 'SCRIPT' && el.id !== 'mascot' && el.id !== 'back-to-top' && el.id !== 'main-nav' && el.id !== 'footer';
    });
  }
  
  let current = nav.nextElementSibling;
  while (current && current !== footer) {
    if (current.id !== 'mascot' && current.id !== 'back-to-top' && current.tagName !== 'SCRIPT') {
      elements.push(current);
    }
    current = current.nextElementSibling;
  }
  return elements;
}

function updateNavbarActiveLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#nav-links a');
  
  navLinks.forEach(link => link.classList.remove('active'));
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    let linkPath = '';
    try {
      linkPath = new URL(href, window.location.origin).pathname;
    } catch (e) {
      return;
    }
    
    const normCurrent = currentPath.replace(/\/$/, '');
    const normLink = linkPath.replace(/\/$/, '');
    
    if (normCurrent === normLink) {
      link.classList.add('active');
    }
  });
  
  const normCurrent = currentPath.replace(/\/$/, '');
  const hasActive = Array.from(navLinks).some(link => link.classList.contains('active'));
  
  if (!hasActive) {
    if (normCurrent.includes('/games/')) {
      const gamesToggle = document.querySelector('#nav-links a[data-dropdown="games"]');
      if (gamesToggle) gamesToggle.classList.add('active');
    } else if (normCurrent.includes('/explore/encyclopedia.html') || 
               normCurrent.includes('/explore/dino-detail.html') ||
               normCurrent.includes('/explore/origins.html') ||
               normCurrent.includes('/explore/extinction.html') ||
               normCurrent.includes('/explore/paleo-guide.html')) {
      const encLink = document.querySelector('#nav-links a[href*="encyclopedia.html"]');
      if (encLink) encLink.classList.add('active');
    } else if (normCurrent.includes('/explore/')) {
      const exploreToggle = document.querySelector('#nav-links a[data-dropdown="explore"]');
      if (exploreToggle) exploreToggle.classList.add('active');
    }
  }
}

async function fetchPage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
  } catch (err) {
    console.error('Failed to fetch page:', err);
    return null;
  }
}

let currentTransitionPromise = null;

async function navigateToPage(url, pushState = true) {
  if (currentTransitionPromise) return;
  
  currentTransitionPromise = (async () => {
    try {
      startProgressBar();
      
      const wrapper = document.getElementById('app-content-wrapper');
      let fadeOutPromise = Promise.resolve();
      if (wrapper) {
        wrapper.classList.add('page-transition--fading');
        fadeOutPromise = new Promise(resolve => {
          wrapper.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
              wrapper.removeEventListener('transitionend', handler);
              resolve();
            }
          });
          setTimeout(resolve, 350);
        });
      }
      
      const fetchPromise = fetchPage(url.href);
      const [newDoc] = await Promise.all([fetchPromise, fadeOutPromise]);
      
      if (!newDoc) {
        window.location.href = url.href;
        return;
      }
      
      document.title = newDoc.querySelector('title')?.innerText || '';
      document.body.className = newDoc.body.className;
      
      if (pushState) {
        window.history.pushState(null, '', url.href);
      }
      
      if (wrapper) {
        wrapper.innerHTML = '';
        const newElements = getPageContentElements(newDoc);
        newElements.forEach(el => {
          const imported = document.importNode(el, true);
          wrapper.appendChild(imported);
        });
      }
      
      if (url.hash) {
        const hashEl = document.querySelector(url.hash);
        if (hashEl) {
          hashEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      
      initPageContent();
      
      finishProgressBar();
      
      if (wrapper) {
        wrapper.getBoundingClientRect(); // reflow
        wrapper.classList.remove('page-transition--fading');
      }
    } catch (err) {
      console.error('PJAX navigation error:', err);
      window.location.href = url.href;
    } finally {
      currentTransitionPromise = null;
    }
  })();
}

function handleLinkClick(e) {
  const link = e.target.closest('a');
  if (!link) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;
  
  const href = link.getAttribute('href');
  if (!href || href.startsWith('javascript:')) return;
  if (href.startsWith('#')) return;
  
  let targetUrl;
  try {
    targetUrl = new URL(link.href);
  } catch (err) {
    return;
  }
  
  if (targetUrl.origin !== window.location.origin) return;
  
  if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
    if (targetUrl.hash) {
      const targetEl = document.querySelector(targetUrl.hash);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  
  e.preventDefault();
  navigateToPage(targetUrl);
}

function initSmoothLinks() {
  const container = document.getElementById('app-content-wrapper') || document;
  container.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => {
  wrapPageContent();
  initNav();
  initDropdowns();
  
  // Initialize persistent components
  initInteractiveMascot();
  initBackToTop();
  
  // Normalize images
  normalizeAllImages();
  
  // Initialize dynamic page content
  initPageContent();
  
  // Set up global click interceptor for link navigation
  document.body.addEventListener('click', handleLinkClick);
  
  // Listen to popstate event for browser back/forward buttons
  window.addEventListener('popstate', () => {
    navigateToPage(new URL(window.location.href), false);
  });
});
