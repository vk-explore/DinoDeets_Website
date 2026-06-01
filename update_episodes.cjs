const fs = require('fs');

// 1. Modify index.html
let html = fs.readFileSync('index.html', 'utf-8');

// Remove the standalone countdown section
html = html.replace(/<!-- Episode Countdown -->[\s\S]*?<\/section>/, '');

// Create the compact countdown HTML
const compactCountdownHTML = `
        <div class="episodes__countdown anim-fade-up" id="countdown-timer">
          <div class="episodes__countdown-inner">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span class="episodes__countdown-label">Next Hatching:</span>
            <span class="episodes__countdown-time">
              <span id="cd-days">0</span>d : 
              <span id="cd-hours">00</span>h : 
              <span id="cd-mins">00</span>m : 
              <span id="cd-secs">00</span>s
            </span>
          </div>
          <p class="episodes__countdown-date" id="countdown-next"></p>
        </div>`;

// Insert the compact countdown into the episodes section, right below the subtitle
html = html.replace(/(<p class="section__subtitle">New dino discoveries every Friday!<\/p>)/, `$1\n${compactCountdownHTML}`);
fs.writeFileSync('index.html', html);

// 2. Modify src/main.js
let mainJs = fs.readFileSync('src/main.js', 'utf-8');
// Replace the calendar emoji with SVG
mainJs = mainJs.replace(/📅/g, '<svg class="inline-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle; margin-bottom: 2px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
fs.writeFileSync('src/main.js', mainJs);

// 3. Modify src/style.css
let css = fs.readFileSync('src/style.css', 'utf-8');
// Add compact countdown CSS
const compactCss = `
.episodes__countdown {
  display: inline-block;
  background: var(--color-bg-secondary);
  border: 1px solid rgba(212, 168, 67, 0.2);
  border-radius: 30px;
  padding: 12px 24px;
  margin: 16px auto 32px auto;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.episodes__countdown-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-accent-gold);
  font-family: var(--font-accent);
  font-size: 1.1rem;
}
.episodes__countdown-time {
  font-weight: bold;
}
.episodes__countdown-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.episode-card {
  text-decoration: none !important;
}
.episode-card__title {
  text-decoration: none !important;
  color: var(--color-text-primary);
}
.episode-card:hover .episode-card__title {
  color: var(--color-accent-gold);
}
`;
css += compactCss;

// Also try to remove any existing blue underlines or text-decoration on episode titles if it's there
css = css.replace(/text-decoration:\s*underline;/g, 'text-decoration: none;');

fs.writeFileSync('src/style.css', css);

console.log('Update script finished successfully.');
