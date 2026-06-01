const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf-8');

// Replace the Games, Explore, and Printables links with dropdown structures
html = html.replace(/<li>\s*<a href="\/DinoDeets_Website\/games\/" class="nav__icon-link" aria-label="Games">[\s\S]*?<\/a>\s*<\/li>/, `
          <li class="nav__dropdown">
            <a href="#" class="nav__icon-link nav__dropdown-toggle" aria-label="Games" data-dropdown="games">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><path d="M15 13h.01"></path><path d="M18 11h.01"></path>
              </svg>
              <span class="nav__tooltip">Games</span>
            </a>
            <div class="nav__submenu" id="dropdown-games">
              <a href="/DinoDeets_Website/games/fossil-dig.html" class="nav__submenu-link">Fossil Dig</a>
              <a href="/DinoDeets_Website/games/dino-quiz.html" class="nav__submenu-link">Dino Quiz</a>
              <a href="/DinoDeets_Website/games/dino-creator.html" class="nav__submenu-link">Dino Creator</a>
            </div>
          </li>`);

html = html.replace(/<li>\s*<a href="\/DinoDeets_Website\/explore\/" class="nav__icon-link" aria-label="Explore">[\s\S]*?<\/a>\s*<\/li>/, `
          <li class="nav__dropdown">
            <a href="#" class="nav__icon-link nav__dropdown-toggle" aria-label="Explore" data-dropdown="explore">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span class="nav__tooltip">Explore</span>
            </a>
            <div class="nav__submenu" id="dropdown-explore">
              <a href="/DinoDeets_Website/explore/dino-map.html" class="nav__submenu-link">Dino Map</a>
              <a href="/DinoDeets_Website/explore/dino-timeline.html" class="nav__submenu-link">Dino Timeline</a>
              <a href="/DinoDeets_Website/explore/dino-meter.html" class="nav__submenu-link">Dino-o-Meter</a>
            </div>
          </li>`);

html = html.replace(/<li>\s*<a href="\/DinoDeets_Website\/printables\/" class="nav__icon-link" aria-label="Printables">[\s\S]*?<\/a>\s*<\/li>/, `
          <li class="nav__dropdown">
            <a href="#" class="nav__icon-link nav__dropdown-toggle" aria-label="Printables" data-dropdown="printables">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span class="nav__tooltip">Printables</span>
            </a>
            <div class="nav__submenu" id="dropdown-printables">
              <a href="/DinoDeets_Website/printables/coloring-pages.html" class="nav__submenu-link">Coloring Pages</a>
              <a href="/DinoDeets_Website/printables/fan-art.html" class="nav__submenu-link">Fan Art</a>
            </div>
          </li>`);

fs.writeFileSync('index.html', html);

// 2. Update CSS
let css = fs.readFileSync('src/style.css', 'utf-8');
const submenuCSS = `
/* Submenus */
.nav__dropdown {
  position: relative;
}
.nav__submenu {
  position: absolute;
  top: 140%;
  left: 50%;
  transform: translateX(-50%) translateY(10px) scale(0.95);
  background: rgba(20, 48, 30, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: 16px;
  padding: 8px 0;
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s var(--ease-spring);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.nav__submenu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}
.nav__submenu-link {
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 10px 20px;
  font-family: var(--font-accent);
  font-size: 1rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.nav__submenu-link:hover {
  background: rgba(212, 168, 67, 0.15);
  color: var(--color-accent-gold);
  transform: translateX(4px);
}
`;
if(!css.includes('.nav__submenu')) {
  css += submenuCSS;
}
fs.writeFileSync('src/style.css', css);

// 3. Update main.js
let mainJs = fs.readFileSync('src/main.js', 'utf-8');
const dropdownJS = `
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
`;
if(!mainJs.includes('initDropdowns()')) {
  mainJs = mainJs.replace(/function initScrollAnimations\(\) \{/, dropdownJS + '\nfunction initScrollAnimations() {');
  mainJs = mainJs.replace(/initMobileMenu\(\);/, 'initMobileMenu();\n  initDropdowns();');
}
fs.writeFileSync('src/main.js', mainJs);

// 4. Update split_html.js
let splitHtml = fs.readFileSync('scripts/split_html.js', 'utf-8');
// Remove Games index
splitHtml = splitHtml.replace(/createPage\('games\/index\.html'[\s\S]*?'Games'\);\n/, '');
// Remove Explore index
splitHtml = splitHtml.replace(/createPage\('explore\/index\.html'[\s\S]*?'Explore'\);\n/, '');
// Remove Printables index
splitHtml = splitHtml.replace(/createPage\('printables\/index\.html'[\s\S]*?'Printables & Art'\);\n/, '');
fs.writeFileSync('scripts/split_html.js', splitHtml);

console.log('Submenus implemented successfully.');
