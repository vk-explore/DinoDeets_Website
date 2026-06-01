const fs = require('fs');
const path = require('path');

// 1. Remove audio play/pause from index.html
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(/<button class="nav__sound-toggle"[\s\S]*?<\/button>/, '');
fs.writeFileSync('index.html', html);

// 2. Remove audio play/pause from split_html.js generated files? 
// No need, because split_html.js pulls the nav from index.html!
// But wait, split_html.js has a replacement logic for nav, let's check.
// Actually, split_html.js copies `<nav>...</nav>` from `index.html`. So we just need to run it.

// 3. Update main.js
let mainJs = fs.readFileSync('src/main.js', 'utf-8');
mainJs = mainJs.replace(/UCw2MYnMzFLWY_fndEWfmLdg/g, 'UCyUZWmztaj_lRgG4n1kt-Ug');
mainJs = mainJs.replace(/initSound\(\);/g, '');
mainJs = mainJs.replace(/\/\/ ===== SOUND TOGGLE =====[\s\S]*?function initSound\(\) \{[\s\S]*?\}\s*(?=\/\/ =====)/, '');
fs.writeFileSync('src/main.js', mainJs);

// 4. Compact nav and footer in style.css
let css = fs.readFileSync('src/style.css', 'utf-8');
// Compact Nav
css = css.replace(/top: 20px; left: 50%; transform: translateX\(-50%\); z-index: 1000;\n\s*width: 90%; max-width: 1200px;/g, 
  'top: 12px; left: 50%; transform: translateX(-50%); z-index: 1000;\n  width: max-content; max-width: 95%;');
css = css.replace(/border-radius: 40px;/g, 'border-radius: 50px;');
css = css.replace(/top: 10px;/g, 'top: 6px;');
css = css.replace(/\.nav__inner \{\n\s*max-width: 1200px; margin: 0 auto;\n\s*display: flex; align-items: center; justify-content: space-between;\n\s*padding: 12px 24px;\n\}/g, 
  `.nav__inner {\n  display: flex; align-items: center; justify-content: center; gap: 24px;\n  padding: 8px 24px;\n}`);

// Compact Footer
css = css.replace(/\.footer__inner \{ max-width: 1100px; margin: 0 auto; padding: 40px 24px; \}/g,
  `.footer__inner { max-width: 1100px; margin: 0 auto; padding: 16px 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; }`);
css = css.replace(/\.footer__brand \{ text-align: center; margin-bottom: 40px; \}/g, 
  `.footer__brand { text-align: center; margin-bottom: 0; }`);
css = css.replace(/\.footer__socials \{ text-align: center; margin-bottom: 40px; \}/g,
  `.footer__socials { text-align: center; margin-bottom: 0; }`);
css = css.replace(/\.footer__socials h4 \{\n\s*font-family: var\(--font-accent\); color: var\(--color-text-secondary\);\n\s*font-size: 1.2rem; margin-bottom: 16px;\n\}/g,
  `.footer__socials h4 {\n  font-family: var(--font-accent); color: var(--color-text-secondary);\n  font-size: 1.1rem; margin-bottom: 8px;\n}`);
css = css.replace(/\.footer__bottom \{\n\s*text-align: center; padding-top: 32px;\n\s*border-top: 1px solid rgba\(212, 168, 67, 0.1\);\n\}/g,
  `.footer__bottom {\n  text-align: center; padding-top: 16px; margin-top: 8px;\n  border-top: 1px solid rgba(212, 168, 67, 0.1);\n  width: 100%;\n}`);

fs.writeFileSync('src/style.css', css);

console.log('Tweaks applied successfully.');
