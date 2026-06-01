const fs = require('fs');

// 1. Update HTML
let html = fs.readFileSync('index.html', 'utf-8');

const newNavLinks = `
        <ul class="nav__links" id="nav-links">
          <li>
            <a href="/DinoDeets_Website/" class="nav__icon-link" aria-label="Home">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span class="nav__tooltip">Home</span>
            </a>
          </li>
          <li>
            <a href="/DinoDeets_Website/explore/encyclopedia.html" class="nav__icon-link" aria-label="Encyclopedia">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span class="nav__tooltip">Encyclopedia</span>
            </a>
          </li>
          <li>
            <a href="/DinoDeets_Website/games/" class="nav__icon-link" aria-label="Games">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><path d="M15 13h.01"></path><path d="M18 11h.01"></path>
              </svg>
              <span class="nav__tooltip">Games</span>
            </a>
          </li>
          <li>
            <a href="/DinoDeets_Website/explore/" class="nav__icon-link" aria-label="Explore">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span class="nav__tooltip">Explore</span>
            </a>
          </li>
          <li>
            <a href="/DinoDeets_Website/printables/" class="nav__icon-link" aria-label="Printables">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span class="nav__tooltip">Printables</span>
            </a>
          </li>
        </ul>`;

html = html.replace(/<ul class="nav__links" id="nav-links">[\s\S]*?<\/ul>/, newNavLinks);
fs.writeFileSync('index.html', html);

// 2. Update CSS
let css = fs.readFileSync('src/style.css', 'utf-8');

// Remove old nav__links a styles and inject new icon styles
css = css.replace(/\.nav__links a \{[\s\S]*?\}/g, '');
css = css.replace(/\.nav__links a:hover, \.nav__links a\.active \{[\s\S]*?\}/g, '');

const navIconCss = `
.nav__icon-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: var(--color-text-primary);
  text-decoration: none;
}
.nav__icon {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
}
.nav__icon-link:hover, .nav__icon-link.active {
  background: rgba(212, 168, 67, 0.2);
  color: var(--color-accent-gold);
}
.nav__icon-link:hover .nav__icon, .nav__icon-link.active .nav__icon {
  transform: scale(1.15);
}
.nav__tooltip {
  position: absolute;
  top: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: var(--font-accent);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border: 1px solid rgba(212, 168, 67, 0.3);
  z-index: 1001;
}
.nav__icon-link:hover .nav__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
/* Ensure tooltip triangle if desired - omitted for flat look */
`;

if (!css.includes('.nav__icon-link')) {
  css = css.replace(/\.nav__links \{/, navIconCss + '\n.nav__links {');
}

// Ensure mobile view isn't showing text since we replaced it with icons
// Update mobile menu to support tooltips natively or just show icons larger
css = css.replace(/\.nav__links--open \{/, `.nav__links--open {\n  gap: 16px;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n`);

fs.writeFileSync('src/style.css', css);

console.log('Nav updated successfully.');
