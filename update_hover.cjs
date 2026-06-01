const fs = require('fs');

// 1. Update style.css
let css = fs.readFileSync('src/style.css', 'utf-8');
const artCss = `
/* ===== ART CARDS ===== */
.art-card__image-wrap {
  position: relative;
  overflow: hidden;
}
.art-card__download {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(26, 18, 11, 0.7);
  color: var(--color-amber);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(212, 168, 67, 0.3);
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s var(--ease-bounce);
}
.art-card__image-wrap:hover .art-card__download {
  opacity: 1;
  transform: translateY(0);
}
.art-card__download:hover {
  background: var(--color-amber);
  color: #1A120B;
  transform: translateY(0) scale(1.1);
}
`;
if (!css.includes('.art-card__download')) {
  fs.appendFileSync('src/style.css', artCss);
}

// 2. Update split_html.js
let splitHtml = fs.readFileSync('scripts/split_html.js', 'utf-8');

splitHtml = splitHtml.replace(/<a href="#" style="position: absolute;[\s\S]*?<\/a>/g, 
  '<a href="#" class="art-card__download" aria-label="Download">\\n              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">\\n                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>\\n                <polyline points="7 10 12 15 17 10"></polyline>\\n                <line x1="12" y1="15" x2="12" y2="3"></line>\\n              </svg>\\n            </a>'
);

splitHtml = splitHtml.replace(/style="position: relative; width: 100%; aspect-ratio: 16\/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var\(--color-text-muted\); overflow: hidden;"/g, 'class="art-card__image-wrap" style="width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);"');

splitHtml = splitHtml.replace(/style="position: relative; width: 100%; aspect-ratio: 9\/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var\(--color-text-muted\); overflow: hidden;"/g, 'class="art-card__image-wrap" style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);"');

splitHtml = splitHtml.replace(/style="position: relative; overflow: hidden; border-radius: 4px;"/g, 'class="art-card__image-wrap" style="border-radius: 4px;"');

fs.writeFileSync('scripts/split_html.js', splitHtml);

console.log('Update complete');
