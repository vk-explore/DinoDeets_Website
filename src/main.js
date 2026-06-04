import './style.css';
import { initInteractiveMascot } from './mascot.js';
import { initEncyclopedia } from './encyclopedia.js';
import { initDinoDetail } from './dino-detail.js';
import fossilData from './data/fossil-dig.json';
import discoveryData from './data/dino-map.json';
import quizQuestions from './data/quiz.json';
import dinoGlossary from './data/glossary.json';
import dinoSizes from './data/dino-meter.json';
import timelineData from './data/timeline.json';
import dinoCreatorData from './data/dino-creator.json';
import artData from './data/art.json';

const { creatorParts, dinoNameParts } = dinoCreatorData;
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
  const colors = ['rgba(212,168,67,0.4)', 'rgba(76,175,80,0.3)', 'rgba(232,101,45,0.3)'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${50 + Math.random() * 50}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
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
    return `
      <a href="${item.link || '#'}" target="_blank" rel="noopener"
         class="episode-card anim-fade-up" style="animation-delay: ${i * 0.1}s" id="episode-${i}">
        <div class="episode-card__thumb">
          <img src="${thumb}" alt="${item.title}" loading="lazy" />
          <div class="episode-card__play"><span class="episode-card__play-icon">▶</span></div>
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
  grid.innerHTML = fallback.map((ep, i) => `
    <a href="https://www.youtube.com/@dinodeets" target="_blank" rel="noopener"
       class="episode-card anim-fade-up" id="episode-${i}">
      <div class="episode-card__thumb">
        <img src="${ep.img}" alt="${ep.title}" loading="lazy" style="object-fit: cover;" />
        <div class="episode-card__play"><span class="episode-card__play-icon">▶</span></div>
      </div>
      <div class="episode-card__body">
        <h3 class="episode-card__title">${ep.title}</h3>
        <span class="episode-card__date">Watch on YouTube</span>
      </div>
    </a>
  `).join('');
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

// ===== SMOOTH SCROLL =====
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ===== EPISODE COUNTDOWN =====
function initCountdown() {
  function getNextFriday() {
    const now = new Date();
    const next = new Date(now);
    const day = now.getDay();
    const daysUntilFri = (5 - day + 7) % 7 || 7;
    next.setDate(now.getDate() + daysUntilFri);
    next.setHours(10, 0, 0, 0); // 10 AM release time
    if (next <= now) next.setDate(next.getDate() + 7);
    return next;
  }

  const nextFri = getNextFriday();
  const nextEl = document.getElementById('countdown-next');
  if (nextEl) {
    nextEl.textContent = `New episode: ${nextFri.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
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
  setInterval(update, 1000);
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
    imgWrap.innerHTML = q.image ? `<img src="${q.image}" alt="" />` : '';

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
      'Incredible! Devaansh would be proud.',
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
  const slider = document.getElementById('meter-slider');
  if (!slider) return;

  const labelsEl = document.getElementById('meter-labels');
  labelsEl.innerHTML = dinoSizes.map(d => `<span>${d.name.split(' ')[0]}</span>`).join('');

  function updateMeter(idx) {
    const d = dinoSizes[idx];
    document.getElementById('meter-img').src = d.image;
    document.getElementById('meter-name').textContent = d.name;
    document.getElementById('meter-height').textContent = `${d.height}m`;
    document.getElementById('meter-length').textContent = `${d.length}m`;
    document.getElementById('meter-weight').textContent = d.weight;
    document.getElementById('meter-comparison').textContent = d.comparison;
    document.getElementById('meter-diet').textContent = d.diet;
    const maxH = 15; // Argentinosaurus
    document.getElementById('meter-bar').style.width = `${(d.height / maxH) * 100}%`;
    // Scale the image
    const wrap = document.querySelector('.meter__dino-wrap');
    const scale = 0.6 + (d.height / maxH) * 0.5;
    wrap.style.transform = `scale(${Math.min(scale, 1.1)})`;
  }

  slider.addEventListener('input', () => updateMeter(parseInt(slider.value)));
  updateMeter(parseInt(slider.value));
}

// ===== TIMELINE =====
function initTimeline() {
  const track = document.getElementById('timeline-track');
  if (!track) return;

  track.innerHTML = timelineData.map(era => `
    <div class="timeline__era" style="border-left-color: ${era.color}">
      <h3 class="timeline__era-header" style="color: ${era.color}">${era.era} — ${era.period}</h3>
      <p class="timeline__era-years">${era.years}</p>
      ${era.events.map(ev => `
        <div class="timeline__event" style="border-left-color: ${era.color}">
          ${ev.image ? `<img src="${ev.image}" alt="" class="timeline__event-img" />` : ''}
          <p class="timeline__event-year">${ev.year}</p>
          <h4 class="timeline__event-title">${ev.title}</h4>
          <p class="timeline__event-desc">${ev.desc}</p>
        </div>
      `).join('')}
    </div>
  `).join('');
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
  const form = document.getElementById('ask-form');
  const success = document.getElementById('ask-success');
  if (!form) return;

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
}

// ===== DINO CREATOR =====
function initCreator() {
  const canvas = document.getElementById('creator-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const state = {
    head: creatorParts.heads[0],
    body: creatorParts.bodies[0],
    tail: creatorParts.tails[0],
    special: creatorParts.specials[0],
    color: creatorParts.colors[0],
  };

  function genName() {
    const p = dinoNameParts;
    return `${p.prefixes[Math.floor(Math.random()*p.prefixes.length)]}${p.roots[Math.floor(Math.random()*p.roots.length)]} ${p.titles[Math.floor(Math.random()*p.titles.length)]}`;
  }

  function drawDino() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const c = state.color;
    const cx = w / 2, cy = h / 2;
    const bodyScale = state.body.scale;

    // Body
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 70 * bodyScale, 50 * bodyScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = c;
    [-30, 30].forEach(ox => {
      ctx.beginPath();
      ctx.roundRect(cx + ox - 10, cy + 50 * bodyScale, 20, 40, 8);
      ctx.fill();
    });

    // Tail
    ctx.strokeStyle = c; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 70 * bodyScale, cy + 20);
    const tailEnds = { club: [-130, cy+10], spike: [-140, cy-10], whip: [-150, cy+30], fan: [-120, cy-20], short: [-100, cy+15] };
    const te = tailEnds[state.tail.id] || tailEnds.whip;
    ctx.quadraticCurveTo(cx - 100 * bodyScale, cy - 10, cx + te[0], te[1]);
    ctx.stroke();
    // Tail end
    if (state.tail.id === 'club') { ctx.beginPath(); ctx.arc(cx + te[0], te[1], 15, 0, Math.PI*2); ctx.fillStyle = c; ctx.fill(); }
    if (state.tail.id === 'spike') { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx+te[0]+i*8, te[1]); ctx.lineTo(cx+te[0]+i*8+4, te[1]-15); ctx.lineTo(cx+te[0]+i*8+8, te[1]); ctx.fillStyle = c; ctx.fill(); } }
    if (state.tail.id === 'fan') { ctx.beginPath(); ctx.arc(cx+te[0], te[1], 20, -0.5, 0.5); ctx.fillStyle = c; ctx.fill(); }

    // Head
    ctx.fillStyle = c;
    const headX = cx + 60 * bodyScale, headY = cy - 20;
    if (state.head.id === 'rex') {
      ctx.beginPath(); ctx.ellipse(headX + 20, headY - 10, 35, 25, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0E1A16'; ctx.beginPath(); ctx.arc(headX + 35, headY - 20, 4, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#0E1A16'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(headX+10, headY); ctx.lineTo(headX+45, headY-2); ctx.stroke();
    } else if (state.head.id === 'tri') {
      ctx.beginPath(); ctx.ellipse(headX + 15, headY, 30, 22, 0.1, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(headX+30, headY-20); ctx.lineTo(headX+38, headY-40); ctx.lineTo(headX+22, headY-20); ctx.fill();
      ctx.beginPath(); ctx.moveTo(headX+35, headY-8); ctx.lineTo(headX+50, headY-20); ctx.lineTo(headX+35, headY+2); ctx.fill();
      ctx.fillStyle = '#0E1A16'; ctx.beginPath(); ctx.arc(headX+25, headY-8, 3, 0, Math.PI*2); ctx.fill();
    } else if (state.head.id === 'raptor') {
      ctx.beginPath(); ctx.ellipse(headX + 20, headY - 5, 28, 18, 0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0E1A16'; ctx.beginPath(); ctx.arc(headX+30, headY-14, 4, 0, Math.PI*2); ctx.fill();
    } else if (state.head.id === 'brachio') {
      ctx.strokeStyle = c; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(headX-10, headY+10); ctx.quadraticCurveTo(headX+20, headY-60, headX+10, headY-80); ctx.stroke();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(headX+10, headY-85, 18, 12, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0E1A16'; ctx.beginPath(); ctx.arc(headX+18, headY-90, 3, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.ellipse(headX + 15, headY - 5, 25, 20, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0E1A16'; ctx.beginPath(); ctx.arc(headX+25, headY-15, 3, 0, Math.PI*2); ctx.fill();
    }

    // Special
    ctx.fillStyle = c; ctx.globalAlpha = 0.7;
    if (state.special.id === 'wings') {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx-80, cy-70, cx-50, cy-30); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx+80, cy-70, cx+50, cy-30); ctx.fill();
    }
    if (state.special.id === 'armor') {
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(cx - 30 + i*15, cy - 25*bodyScale, 8, 0, Math.PI*2); ctx.fill(); }
    }
    if (state.special.id === 'horns') {
      [cx-20, cx, cx+20].forEach(x => { ctx.beginPath(); ctx.moveTo(x-5, cy-45*bodyScale); ctx.lineTo(x, cy-70*bodyScale); ctx.lineTo(x+5, cy-45*bodyScale); ctx.fill(); });
    }
    if (state.special.id === 'crest') {
      ctx.beginPath(); ctx.ellipse(headX+15, headY-40, 20, 30, 0, Math.PI, 0); ctx.fill();
    }
    if (state.special.id === 'glow') {
      ctx.shadowColor = c; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.ellipse(cx, cy+20, 75*bodyScale, 55*bodyScale, 0, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function renderOptions(catId, items, stateKey) {
    const el = document.getElementById(`creator-${catId}`);
    if (!el) return;
    el.innerHTML = items.map((item, i) => `
      <button class="creator__option${i === 0 ? ' creator__option--active' : ''}" data-idx="${i}">
        ${item.name}
        <span class="creator__option-desc">${item.desc}</span>
      </button>
    `).join('');
    el.addEventListener('click', (e) => {
      const btn = e.target.closest('.creator__option');
      if (!btn) return;
      el.querySelectorAll('.creator__option').forEach(b => b.classList.remove('creator__option--active'));
      btn.classList.add('creator__option--active');
      state[stateKey] = items[parseInt(btn.dataset.idx)];
      drawDino();
    });
  }

  renderOptions('heads', creatorParts.heads, 'head');
  renderOptions('bodies', creatorParts.bodies, 'body');
  renderOptions('tails', creatorParts.tails, 'tail');
  renderOptions('specials', creatorParts.specials, 'special');

  // Colors
  const colorsEl = document.getElementById('creator-colors');
  colorsEl.innerHTML = creatorParts.colors.map((c, i) => `
    <button class="creator__color${i === 0 ? ' creator__color--active' : ''}" style="background:${c}" data-idx="${i}"></button>
  `).join('');
  colorsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.creator__color');
    if (!btn) return;
    colorsEl.querySelectorAll('.creator__color').forEach(b => b.classList.remove('creator__color--active'));
    btn.classList.add('creator__color--active');
    state.color = creatorParts.colors[parseInt(btn.dataset.idx)];
    drawDino();
  });

  document.getElementById('creator-randomize')?.addEventListener('click', () => {
    const rand = arr => arr[Math.floor(Math.random() * arr.length)];
    state.head = rand(creatorParts.heads);
    state.body = rand(creatorParts.bodies);
    state.tail = rand(creatorParts.tails);
    state.special = rand(creatorParts.specials);
    state.color = rand(creatorParts.colors);
    document.getElementById('creator-dino-name').textContent = genName();
    // Update active states
    ['heads','bodies','tails','specials'].forEach(cat => {
      const key = cat.slice(0, -1);
      const el = document.getElementById(`creator-${cat}`);
      const idx = creatorParts[cat].indexOf(state[key === 'bodie' ? 'body' : key]);
      el?.querySelectorAll('.creator__option').forEach((b, i) => b.classList.toggle('creator__option--active', i === idx));
    });
    const cidx = creatorParts.colors.indexOf(state.color);
    colorsEl.querySelectorAll('.creator__color').forEach((b, i) => b.classList.toggle('creator__color--active', i === cidx));
    drawDino();
  });

  document.getElementById('creator-dino-name').textContent = genName();
  drawDino();
}

// ===== FAN ART GALLERY =====
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = fanArtGallery.map((art, i) => `
    <div class="gallery__card" data-idx="${i}">
      <img src="${art.image}" alt="${art.title}" class="gallery__card-img" loading="lazy" />
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
    document.getElementById('gallery-lightbox-img').src = art.image;
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
      <img src="${page.image}" alt="${page.name}" class="coloring__card-img" loading="lazy" />
      <div class="coloring__card-info">
        <h3 class="coloring__card-name">${page.name}</h3>
        <p class="coloring__card-diff">Difficulty: ${page.difficulty}</p>
        <a href="${page.image}" download="DinoDeets-${page.name.replace(/\s+/g, '-')}.webp" class="coloring__download">
          Download & Print
        </a>
      </div>
    </div>
  `).join('');
}


// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDropdowns();
  initParticles();
  loadEpisodes();
  initFossilDig();
  initDinoMap();
  initCountdown();
  initQuiz();
  initMeter();
  initTimeline();
  initDictionary();
  initAskForm();
  initCreator();
  initGallery();
  initColoringPages();
  initEncyclopedia();
  initDinoDetail();

  initInteractiveMascot();
  initBackToTop();
  initScrollAnimations();
  
  initSmoothLinks();
});
