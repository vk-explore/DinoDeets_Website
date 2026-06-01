const fs = require('fs');
const path = require('path');

const files = [
  'src/style.css',
  'scripts/split_html.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Colors
  content = content.replace(/--color-ocean/g, '--color-wood');
  content = content.replace(/#29B6F6/g, '#8D6E63');
  
  content = content.replace(/--color-volcanic-glow/g, '--color-bark-glow');
  content = content.replace(/#FF7A3D/g, '#8D6E63');
  
  content = content.replace(/--color-volcanic/g, '--color-bark');
  content = content.replace(/#E8652D/g, '#795548');
  
  content = content.replace(/btn--volcanic/g, 'btn--bark');
  
  // rgba replacements
  content = content.replace(/rgba\(232,\s*101,\s*45/g, 'rgba(121, 85, 72');
  content = content.replace(/rgba\(41,\s*182,\s*246/g, 'rgba(141, 110, 99');
  content = content.replace(/rgba\(171,\s*71,\s*188/g, 'rgba(212, 225, 87');
  content = content.replace(/#CE93D8/g, '#D4E157');

  // Fonts
  content = content.replace(/Caveat/g, 'Fredoka');
  content = content.replace(/cursive/g, 'sans-serif');
  
  // Backgrounds to warmer browns
  if (file.endsWith('style.css')) {
    content = content.replace(/--color-bg-primary: #0E1A16;/g, '--color-bg-primary: #1A120B;');
    content = content.replace(/--color-bg-secondary: #142420;/g, '--color-bg-secondary: #241A10;');
    content = content.replace(/--color-bg-tertiary: #1A3C34;/g, '--color-bg-tertiary: #3C2A1E;');
    content = content.replace(/--color-surface: #1E2D28;/g, '--color-surface: #2E2218;');
  }

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
